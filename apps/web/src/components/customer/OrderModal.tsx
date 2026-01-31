"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InventoryItem } from "@/lib/api/inventory.service";
import { X } from "lucide-react";

interface OrderModalProps {
    item: InventoryItem | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (orderData: OrderFormData) => Promise<void>;
}

export interface OrderFormData {
    sku: string;
    qty: number;
    size?: string;
    color?: string;
    notes?: string;
}

export default function OrderModal({ item, isOpen, onClose, onSubmit }: OrderModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("");
    const [color, setColor] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!item) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (quantity < 1 || quantity > item.quantity) {
            alert(`Please enter a quantity between 1 and ${item.quantity}`);
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                sku: item.sku,
                qty: quantity,
                size: size || undefined,
                color: color || undefined,
                notes: notes || undefined,
            });
            handleClose();
        } catch (error) {
            console.error("Order submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setQuantity(1);
        setSize("");
        setColor("");
        setNotes("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-[#002535] border-white/10 text-white max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl font-bold">Book Order</DialogTitle>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Item Details */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="font-semibold text-[#00B4D8] mb-2">{item.name}</h3>
                        <p className="text-sm text-white/60">SKU: {item.sku}</p>
                        {item.unitPrice && (
                            <p className="text-sm text-white/60">Price: ₹{item.unitPrice.toFixed(2)}</p>
                        )}
                        <p className="text-sm text-white/60">Available: {item.quantity} units</p>
                    </div>

                    {/* Quantity */}
                    <div>
                        <Label htmlFor="quantity" className="text-white/80">Quantity *</Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            max={item.quantity}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="bg-white/5 border-white/10 text-white"
                            required
                        />
                    </div>

                    {/* Size */}
                    <div>
                        <Label htmlFor="size" className="text-white/80">Size (Optional)</Label>
                        <Input
                            id="size"
                            type="text"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            placeholder="e.g., M, L, XL"
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    {/* Color */}
                    <div>
                        <Label htmlFor="color" className="text-white/80">Color (Optional)</Label>
                        <Input
                            id="color"
                            type="text"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            placeholder="e.g., Blue, Red"
                            className="bg-white/5 border-white/10 text-white"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <Label htmlFor="notes" className="text-white/80">Special Instructions (Optional)</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any special requirements..."
                            className="bg-white/5 border-white/10 text-white"
                            rows={3}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex-1 border-white/10 text-white hover:bg-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-[#00B4D8] hover:bg-[#00B4D8]/90 text-[#001D29]"
                        >
                            {isSubmitting ? "Submitting..." : "Confirm Order"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
