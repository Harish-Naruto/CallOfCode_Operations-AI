import type { Request, Response } from "express";
import prisma from "@Hackron/db";
import { AppError } from "../middleware/error.middleware";
import type {
    UpdateInventoryRequest,
    SupplierWebhookRequest,
    SuccessResponse,
} from "../types/types";

/**
 * Inventory Controller - Handles inventory and supplier endpoints
 */

export class InventoryController {
    /**
     * POST /api/inventory/update
     * Update inventory (manual adjustment)
     */
    async updateInventory(req: Request, res: Response): Promise<void> {
        const { sku, delta, source } = req.body as UpdateInventoryRequest;

        const item = await prisma.inventoryItem.findUnique({
            where: { sku },
        });

        if (!item) {
            throw new AppError(404, 'Inventory item not found');
        }

        const updated = await prisma.inventoryItem.update({
            where: { sku },
            data: {
                quantity: {
                    increment: delta,
                },
            },
        });

        // Log audit action (optional but recommended)
        await prisma.auditAction.create({
            data: {
                actor: "OWNER",
                action: 'inventory_update',
                context: { sku, delta, source, newQuantity: updated.quantity } as any,
                reason: `Manual update from ${source}`,
            },
        });

        const response: SuccessResponse = {
            success: true,
        };

        res.status(200).json(response);
    }

    /**
     * POST /api/inventory/bulk
     * Seeding or bulk upsert of inventory data
     */
    async bulkUpsert(req: Request, res: Response): Promise<void> {
        const items = req.body as any[]; // Expected array of { sku, name, quantity, reorderPoint }

        if (!Array.isArray(items)) {
            throw new AppError(400, "Body must be an array of inventory items");
        }

        const results = await Promise.all(
            items.map(item =>
                prisma.inventoryItem.upsert({
                    where: { sku: item.sku },
                    update: {
                        name: item.name,
                        quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
                        reorderPoint: typeof item.reorderPoint === 'string' ? parseInt(item.reorderPoint) : item.reorderPoint,
                    },
                    create: {
                        sku: item.sku,
                        name: item.name,
                        quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
                        reorderPoint: typeof item.reorderPoint === 'string' ? parseInt(item.reorderPoint) : item.reorderPoint,
                    }
                })
            )
        );

        res.status(200).json({
            success: true,
            count: results.length
        });
    }

    /**
     * POST /api/webhooks/supplier
     * Handle supplier order status webhook
     */
    async handleSupplierWebhook(req: Request, res: Response): Promise<void> {
        const { orderRef, eta } = req.body as SupplierWebhookRequest;

        const order = await prisma.supplierOrder.findUnique({
            where: { id: orderRef },
        });

        if (!order) {
            throw new AppError(404, 'Supplier order not found');
        }

        await prisma.supplierOrder.update({
            where: { id: orderRef },
            data: {
                eta: new Date(eta),
            },
        });

        // Webhook response
        res.status(200).json({ success: true });
    }
}

export const inventoryController = new InventoryController();
