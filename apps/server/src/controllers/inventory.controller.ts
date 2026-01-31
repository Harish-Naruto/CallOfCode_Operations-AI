import type { Request, Response } from "express";
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

        // TODO: Implement with Prisma
        console.log("Updating inventory:", { sku, delta, source });

        // In production:
        // const item = await prisma.inventoryItem.findUnique({
        //   where: { sku },
        // });
        //
        // if (!item) {
        //   throw new AppError(404, 'Inventory item not found');
        // }
        //
        // await prisma.inventoryItem.update({
        //   where: { sku },
        //   data: {
        //     quantity: {
        //       increment: delta,
        //     },
        //   },
        // });
        //
        // // Create audit log
        // await auditService.createAuditAction({
        //   actor: AuditActor.OWNER,
        //   action: 'inventory_update',
        //   context: { sku, delta, source },
        // });
        //
        // // Check if below reorder point
        // const updated = await prisma.inventoryItem.findUnique({
        //   where: { sku },
        // });
        //
        // if (updated && updated.quantity <= updated.reorderPoint) {
        //   // Trigger agent to handle reorder
        //   await agentService.enqueueJob({
        //     type: 'inventory_low',
        //     payload: { sku, quantity: updated.quantity },
        //   });
        // }

        const response: SuccessResponse = {
            success: true,
        };

        res.status(200).json(response);
    }

    /**
     * POST /api/webhooks/supplier
     * Handle supplier order status webhook
     */
    async handleSupplierWebhook(req: Request, res: Response): Promise<void> {
        const { orderRef, eta } = req.body as SupplierWebhookRequest;

        // TODO: Implement with Prisma
        console.log("Supplier webhook received:", { orderRef, eta });

        // In production:
        // const order = await prisma.supplierOrder.findFirst({
        //   where: { id: orderRef },
        // });
        //
        // if (!order) {
        //   throw new AppError(404, 'Supplier order not found');
        // }
        //
        // await prisma.supplierOrder.update({
        //   where: { id: orderRef },
        //   data: {
        //     eta: new Date(eta),
        //   },
        // });
        //
        // // Trigger agent to re-evaluate affected requests
        // await agentService.enqueueJob({
        //   type: 'supplier_update',
        //   payload: { orderRef, eta },
        // });

        // Webhook response
        res.status(200).json({ success: true });
    }
}

export const inventoryController = new InventoryController();
