"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { inventoryService, type InventoryItem } from "@/lib/api/inventory.service";
import { customerService } from "@/lib/api/customer.service";
import OrderModal, { type OrderFormData } from "@/components/customer/OrderModal";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Package } from "lucide-react";

export default function CustomerInventoryPage() {
    const router = useRouter();
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            setIsLoading(true);
            const data = await inventoryService.getInventoryItems();
            setItems(data.filter(item => item.quantity > 0)); // Only show in-stock items
        } catch (error) {
            console.error("Failed to load inventory:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOrder = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleSubmitOrder = async (orderData: OrderFormData) => {
        try {
            // Create request payload matching backend expectations
            const payload = {
                type: "order" as const,
                items: [{
                    sku: orderData.sku,
                    qty: orderData.qty,
                    size: orderData.size,
                    color: orderData.color,
                }],
                required_skills: [], // Order requests don't require specific skills
                estimated_minutes: 30, // Default estimation
                notes: orderData.notes,
            };

            const response = await customerService.createRequest({ payload });

            // Show success message and close modal
            alert(`Order placed successfully! Request ID: ${response.requestId}`);
            setIsModalOpen(false);

            // Navigate back to dashboard
            router.push("/customer/dashboard" as any);
        } catch (error) {
            console.error("Failed to create order:", error);
            alert("Failed to place order. Please try again.");
            throw error;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
            <div className="min-h-screen bg-[#001D29] text-white p-4 md:p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => router.back()}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold">Inventory</h1>
                            <p className="text-white/60">Browse available items</p>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B4D8]"></div>
                            <p className="mt-4 text-white/60">Loading inventory...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20">
                            <Package className="w-16 h-16 mx-auto mb-4 text-white/40" />
                            <h3 className="text-xl font-semibold mb-2">No items available</h3>
                            <p className="text-white/60">Check back later for new inventory</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {items.map((item) => (
                                <motion.div
                                    key={item.sku}
                                    variants={itemVariants}
                                    className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/10 transition-all"
                                >
                                    {/* Image */}
                                    {item.imageUrl ? (
                                        <div className="w-full h-48 bg-white/5">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-48 bg-white/5 flex items-center justify-center">
                                            <Package className="w-16 h-16 text-white/20" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                            <p className="text-xs text-white/40">SKU: {item.sku}</p>
                                        </div>

                                        {item.description && (
                                            <p className="text-sm text-white/60 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                            <div>
                                                <p className="text-xs text-white/40">Available</p>
                                                <p className="font-semibold">{item.quantity} units</p>
                                            </div>
                                            {item.unitPrice && (
                                                <div className="text-right">
                                                    <p className="text-xs text-white/40">Price</p>
                                                    <p className="font-semibold text-[#00B4D8]">
                                                        ₹{item.unitPrice.toFixed(2)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {item.category && (
                                            <div className="inline-block px-3 py-1 bg-[#00B4D8]/10 text-[#00B4D8] rounded-full text-xs">
                                                {item.category}
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleOrder(item)}
                                            className="w-full py-3 bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#001D29] rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Book Order
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Order Modal */}
                    <OrderModal
                        item={selectedItem}
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleSubmitOrder}
                    />
                </div>
            </div>
        </ProtectedRoute>
    );
}
