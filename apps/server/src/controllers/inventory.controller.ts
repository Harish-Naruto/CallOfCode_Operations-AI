import type { Request, Response } from "express";
import prisma from "@Hackron/db";
import { AppError } from "../middleware/error.middleware";
import type {
    UpdateInventoryRequest,
    SupplierWebhookRequest,
    SuccessResponse,
} from "../types/types";
import { uploadImage } from "../utils/imageUtils";
import { supabase } from "../config/upload.config";

type MulterFile = Express.Multer.File;

/**
 * Inventory Controller - Handles inventory and supplier endpoints
 */

export class InventoryController {
    /**
     * POST /api/inventory/create
     * Create new inventory item with optional image
     */
    async createInventoryItem(req: Request, res: Response): Promise<void> {
        const { sku, name, quantity, reorderPoint } = req.body;
        const file = req.file as MulterFile | undefined;

        // Check if SKU already exists
        const existing = await prisma.inventoryItem.findUnique({
            where: { sku },
        });

        if (existing) {
            throw new AppError(400, "Inventory item with this SKU already exists");
        }

        let imageUrl: string | undefined;

        // Upload image if provided
        if (file) {
            imageUrl = await uploadImage(supabase, file, "Inventory");
        }

        // Create inventory item
        const item = await prisma.inventoryItem.create({
            data: {
                sku,
                name,
                quantity,
                reorderPoint,
                imageUrl,
            },
        });

        res.status(201).json({
            success: true,
            message: "Inventory item created successfully",
            data: item,
        });
    }

    /**
     * GET /api/inventory
     * Get all inventory items
     */
    async getInventoryItems(_req: Request, res: Response): Promise<void> {
        const items = await prisma.inventoryItem.findMany({
            orderBy: { name: "asc" },
        });

        res.status(200).json({
            success: true,
            data: items,
        });
    }

    /**
     * GET /api/inventory/:sku
     * Get single inventory item
     */
    async getInventoryItem(req: Request, res: Response): Promise<void> {
        const sku = req.params.sku as string;

        const item = await prisma.inventoryItem.findUnique({
            where: { sku },
        });

        if (!item) {
            throw new AppError(404, "Inventory item not found");
        }

        res.status(200).json({
            success: true,
            data: item,
        });
    }

    /**
     * PATCH /api/inventory/:sku
     * Update inventory item with optional image replacement
     */
    async updateInventoryItem(req: Request, res: Response): Promise<void> {
        const sku = req.params.sku as string;
        const { name, quantity, reorderPoint } = req.body;
        const file = req.file as MulterFile | undefined;

        // Get existing item
        const existing = await prisma.inventoryItem.findUnique({
            where: { sku },
        });

        if (!existing) {
            throw new AppError(404, "Inventory item not found");
        }

        let imageUrl: string | undefined = existing.imageUrl || undefined;

        // Handle image update
        if (file) {
            const oldImage = existing.imageUrl;

            // Upload new image (and delete old one if exists)
            if (oldImage) {
                imageUrl = await uploadImage(supabase, file, "Inventory", oldImage);
            } else {
                imageUrl = await uploadImage(supabase, file, "Inventory");
            }
        }

        // Update inventory item
        const item = await prisma.inventoryItem.update({
            where: { sku },
            data: {
                ...(name !== undefined && { name }),
                ...(quantity !== undefined && { quantity }),
                ...(reorderPoint !== undefined && { reorderPoint }),
                ...(file && { imageUrl }),
            },
        });

        res.status(200).json({
            success: true,
            message: "Inventory item updated successfully",
            data: item,
        });
    }

    /**
     * POST /api/inventory/update
     * Update inventory (manual adjustment) - Legacy endpoint
     */
    async updateInventory(req: Request, res: Response): Promise<void> {
        const { sku, delta, source } = req.body as UpdateInventoryRequest;
        const skuString = typeof sku === 'string' ? sku : String(sku);

        const item = await prisma.inventoryItem.findUnique({
            where: { sku: skuString },
        });

        if (!item) {
            throw new AppError(404, "Inventory item not found");
        }

        await prisma.inventoryItem.update({
            where: { sku: skuString },
            data: {
                quantity: {
                    increment: delta,
                },
            },
        });

        console.log("Inventory updated:", { sku, delta, source });

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

        // TODO: Implement with Prisma
        console.log("Supplier webhook received:", { orderRef, eta });

        // Webhook response
        res.status(200).json({ success: true });
    }
}

export const inventoryController = new InventoryController();

