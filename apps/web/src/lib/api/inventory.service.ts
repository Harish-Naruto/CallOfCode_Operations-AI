import apiClient from "./client";

export interface InventoryItem {
    sku: string;
    name: string;
    description?: string;
    category?: string;
    quantity: number;
    unitPrice?: number;
    reorderPoint: number;
    imageUrl?: string;
    supplierId?: string;
    createdAt: string;
    updatedAt: string;
}

export const inventoryService = {
    /**
     * Get all inventory items (for customers to browse)
     * GET /api/inventory
     */
    async getInventoryItems(): Promise<InventoryItem[]> {
        const response = await apiClient.get("/api/inventory");
        // Backend returns { success: true, data: items[] }
        return response.data.data || response.data || [];
    },
};
