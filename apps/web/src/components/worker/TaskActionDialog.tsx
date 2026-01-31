"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    type: "update" | "complete";
    taskTitle: string;
}

export default function TaskActionDialog({
    isOpen,
    onClose,
    onSubmit,
    type,
    taskTitle,
}: TaskActionDialogProps) {
    const [minutes, setMinutes] = useState("");
    const [notes, setNotes] = useState("");
    const [qualityOk, setQualityOk] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data =
            type === "update"
                ? {
                      actual_minutes_so_far: parseInt(minutes),
                      notes,
                  }
                : {
                      actual_minutes: parseInt(minutes),
                      quality_ok: qualityOk,
                      notes,
                  };

        await onSubmit(data);
        setLoading(false);
        handleClose();
    };

    const handleClose = () => {
        setMinutes("");
        setNotes("");
        setQualityOk(true);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white/90 backdrop-blur-xl border border-[#001D29]/20 rounded-[2rem] p-8 shadow-2xl z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-black text-[#001D29] uppercase tracking-tight">
                                    {type === "update"
                                        ? "Update Progress"
                                        : "Complete Task"}
                                </h2>
                                <p className="text-xs text-[#0077B6] font-bold uppercase tracking-widest mt-1">
                                    {taskTitle}
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-[#001D29]/10 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5 text-[#001D29]" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label
                                    htmlFor="minutes"
                                    className="text-xs font-black uppercase tracking-widest text-[#001D29] mb-2 block"
                                >
                                    {type === "update"
                                        ? "Actual Minutes So Far"
                                        : "Total Actual Minutes"}
                                </Label>
                                <Input
                                    id="minutes"
                                    type="number"
                                    value={minutes}
                                    onChange={(e) => setMinutes(e.target.value)}
                                    required
                                    min="0"
                                    placeholder="Enter minutes"
                                    className="rounded-xl border-[#001D29]/20 focus:border-[#0077B6] focus:ring-[#0077B6]"
                                />
                            </div>

                            {type === "complete" && (
                                <div className="flex items-center space-x-3 p-4 bg-[#0077B6]/5 rounded-xl border border-[#0077B6]/20">
                                    <Checkbox
                                        id="quality"
                                        checked={qualityOk}
                                        onCheckedChange={(checked) =>
                                            setQualityOk(checked as boolean)
                                        }
                                        className="border-[#0077B6]"
                                    />
                                    <Label
                                        htmlFor="quality"
                                        className="text-sm font-bold text-[#001D29] cursor-pointer"
                                    >
                                        Quality check passed
                                    </Label>
                                </div>
                            )}

                            <div>
                                <Label
                                    htmlFor="notes"
                                    className="text-xs font-black uppercase tracking-widest text-[#001D29] mb-2 block"
                                >
                                    Notes (Optional)
                                </Label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    placeholder="Add any notes or comments..."
                                    className="w-full px-4 py-3 rounded-xl border border-[#001D29]/20 focus:border-[#0077B6] focus:ring-1 focus:ring-[#0077B6] outline-none transition-colors resize-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-3 bg-white border border-[#001D29]/20 text-[#001D29] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#001D29]/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !minutes}
                                    className="flex-1 px-6 py-3 bg-[#0077B6] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#48CAE4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
