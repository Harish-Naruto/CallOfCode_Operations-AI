"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { inventoryService, type InventoryItem } from "@/lib/api/inventory.service";
import { customerService } from "@/lib/api/customer.service";
import OrderModal, { type OrderFormData } from "@/components/customer/OrderModal";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, Package, Sparkles, Activity, Layers, Hash } from "lucide-react";

export default function CustomerInventoryPage() {
    // --- LOGIC: UNTOUCHED ---
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
            setItems(data.filter(item => item.quantity > 0)); 
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
            const payload = {
                type: "order" as const,
                items: [{
                    sku: orderData.sku,
                    qty: orderData.qty,
                    size: orderData.size,
                    color: orderData.color,
                }],
                required_skills: [],
                estimated_minutes: 30,
                notes: orderData.notes,
            };

            const response = await customerService.createRequest({ payload });
            alert(`Order placed successfully! Request ID: ${response.requestId}`);
            setIsModalOpen(false);
            router.push("/owner/dashboard");
        } catch (error) {
            console.error("Failed to create order:", error);
            alert("Failed to place order. Please try again.");
            throw error;
        }
    };

    // --- DESIGN: REFINED ATMOSPHERIC TEXTILE GALLERY ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.CUSTOMER]}>
            {/* FIX: Removed 'overflow-y-auto' from this div to prevent the double scrollbar. 
                The browser will now use the global scrollbar for the page. */}
            <div className="min-h-screen w-full bg-[#E0F2F1] flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 relative font-sans selection:bg-[#00B4D8] selection:text-white">
                
                {/* Background Aesthetic Orbs */}
                <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="w-full max-w-7xl relative z-10">
                    {/* Glass Executive Header */}
                    <motion.header 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] px-8 py-4 mb-12 flex flex-col md:flex-row justify-between items-center shadow-[0_8px_32px_rgba(0,123,182,0.05)]"
                    >
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => router.back()}
                                className="p-3 bg-[#001D29] text-[#48CAE4] hover:bg-[#0077B6] hover:text-white rounded-2xl shadow-lg transition-all active:scale-95"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-[#001D29] tracking-tight">Textile Gallery</h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0077B6]">Premium Stock Inventory</p>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#00B4D8]/10 rounded-full border border-[#00B4D8]/20">
                            <Activity className="w-3 h-3 text-[#0077B6] animate-pulse" />
                            <span className="text-[9px] font-bold text-[#0077B6] uppercase tracking-widest">Catalog Node: Active</span>
                        </div>
                    </motion.header>

                    {isLoading ? (
                        <div className="flex flex-col items-center py-40 gap-4">
                            <div className="w-12 h-12 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0077B6]">Syncing Inventory...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-40 bg-white/40 backdrop-blur-sm border border-white/60 rounded-[3rem] border-dashed">
                            <Package className="w-16 h-16 text-[#00B4D8]/20 mb-6" />
                            <h3 className="text-xl font-serif font-bold text-[#001D29]">No items available</h3>
                            <p className="text-xs text-[#001D29]/40 font-bold uppercase tracking-widest mt-2">Check back later for new arrivals</p>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {items.map((item) => (
                                <motion.div
                                    key={item.sku}
                                    variants={itemVariants}
                                    className="bg-white/70 backdrop-blur-md border border-white/80 rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-[#0077B6]/10 transition-all group"
                                >
                                    {/* Media Section */}
                                    <div className="relative h-64 overflow-hidden bg-[#001D29]/5">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-[#00B4D8]/20">
                                                <Layers className="w-16 h-16" />
                                            </div>
                                        )}
                                        {item.category && (
                                            <div className="absolute top-6 left-6 px-3 py-1 bg-[#001D29] text-[#48CAE4] rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">
                                                {item.category}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Monolith */}
                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h3 className="font-serif font-bold text-xl text-[#001D29] group-hover:text-[#0077B6] transition-colors">{item.name}</h3>
                                                <div className="flex items-center gap-2 text-[9px] font-black text-[#00B4D8] uppercase tracking-widest">
                                                    <Hash className="w-3 h-3" /> SKU: {item.sku}
                                                </div>
                                            </div>
                                            {item.unitPrice && (
                                                <div className="text-right">
                                                    <p className="text-[18px] font-black text-[#001D29]">₹{item.unitPrice.toFixed(2)}</p>
                                                    <p className="text-[8px] font-black text-[#0077B6] uppercase tracking-widest">Unit Price</p>
                                                </div>
                                            )}
                                        </div>

                                        {item.description && (
                                            <p className="text-xs text-[#001D29]/60 font-medium leading-relaxed line-clamp-2 italic border-l-2 border-[#00B4D8]/20 pl-4">
                                                {item.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between p-4 bg-[#E0F2F1] rounded-2xl border border-[#CAF0F8]">
                                            <div className="flex items-center gap-3">
                                                <Package className="w-4 h-4 text-[#0077B6]" />
                                                <span className="text-[10px] font-black text-[#001D29] uppercase tracking-widest">Availability</span>
                                            </div>
                                            <p className="text-sm font-black text-[#0077B6]">{item.quantity} Units</p>
                                        </div>

                                    
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Footer Branding */}
                    {!isLoading && items.length > 0 && (
                        <div className="mt-20 flex flex-col items-center gap-4 opacity-[0.05] pointer-events-none select-none">
                             <Sparkles className="w-8 h-8 text-[#001D29]" />
                             <span className="text-6xl font-serif font-black italic text-[#001D29] uppercase tracking-tighter">Textile Network</span>
                        </div>
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

            {/* Custom Scrollbar Theme 
                The 'global' tag ensures these styles apply to the main browser scrollbar. */}
            <style jsx global>{`
                ::-webkit-scrollbar { width: 8px; }
                ::-webkit-scrollbar-track { background: #E0F2F1; }
                ::-webkit-scrollbar-thumb { 
                    background: #00B4D8; 
                    border-radius: 10px; 
                    border: 2px solid #E0F2F1; 
                }
                ::-webkit-scrollbar-thumb:hover { background: #0077B6; }
                
                /* Support for Firefox */
                * {
                    scrollbar-width: thin;
                    scrollbar-color: #00B4D8 #E0F2F1;
                }
            `}</style>
        </ProtectedRoute>
    );
}