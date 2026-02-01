"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    ArrowLeft, Search, Clock, AlertCircle, CheckCircle2, ChevronRight, Hash, Activity, Layers
} from "lucide-react";
import { useEffect, useState } from "react";
import { customerService } from "@/lib/api/customer.service";
import type { CustomerRequest } from "@/lib/types/customer";

export default function CustomerRequestsPage() {
    // --- LOGIC: UNTOUCHED ---
    const router = useRouter();
    const [requests, setRequests] = useState<CustomerRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const data = await customerService.getMyRequests();
            setRequests(data);
        } catch (error) {
            console.error("Failed to load requests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE":
            case "COMPLETED": return "text-emerald-600 bg-emerald-100 border-emerald-200";
            case "IN_PROGRESS": return "text-[#0077B6] bg-blue-50 border-blue-100";
            case "NEW": return "text-amber-600 bg-amber-50 border-amber-100";
            case "CANCELLED": return "text-red-600 bg-red-50 border-red-100";
            default: return "text-[#001D29]/60 bg-[#001D29]/5 border-[#001D29]/10";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE":
            case "COMPLETED": return <CheckCircle2 className="w-5 h-5" />;
            case "IN_PROGRESS": return <Activity className="w-5 h-5" />;
            case "NEW": return <AlertCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filter === "ALL" || req.status === filter;
        const matchesSearch = searchQuery === "" || 
            req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.payload?.type?.toLowerCase().includes(searchQuery.toLowerCase());
            
        return matchesStatus && matchesSearch;
    });

    // --- DESIGN: LIGHT TEAL BLUE THEME ---
    return (
        <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
            <div className="min-h-screen w-full bg-[#E0F2F1] text-[#001D29] p-4 md:p-8 lg:p-12 font-sans relative overflow-x-hidden selection:bg-[#00B4D8] selection:text-white">
                
                 {/* Background Aesthetic Orbs */}
                <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-6xl mx-auto relative z-10">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-[#001D29]/5 pb-10">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => router.back()}
                                className="p-3 bg-[#001D29] text-[#48CAE4] hover:bg-[#0077B6] hover:text-white rounded-2xl shadow-lg transition-all active:scale-95 group"
                            >
                                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            </button>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-serif font-black italic tracking-tighter text-[#001D29]">
                                    Request <span className="text-[#0077B6]">Archive</span>
                                </h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#0077B6] mt-2 opacity-80">
                                    Service Ledger v.2026.0
                                </p>
                            </div>
                        </div>

                         <div className="w-full md:w-auto">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#001D29]/30 group-focus-within:text-[#0077B6] transition-colors" />
                                <input
                                    placeholder="Filter by ID or Type..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-64 pl-12 pr-4 py-4 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.5rem] outline-none focus:border-[#00B4D8] focus:bg-white focus:shadow-xl transition-all font-bold text-xs uppercase tracking-widest placeholder:text-[#001D29]/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 custom-scrollbar">
                        {["ALL", "NEW", "IN_PROGRESS", "COMPLETED"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap shadow-sm border ${
                                    filter === status 
                                    ? "bg-[#001D29] text-[#48CAE4] border-[#001D29] shadow-xl -translate-y-0.5" 
                                    : "bg-white/40 text-[#001D29]/40 border-white/60 hover:bg-white/80 hover:text-[#001D29]"
                                }`}
                            >
                                {status.replace("_", " ")}
                            </button>
                        ))}
                    </div>

                    {/* Request List */}
                    <div className="space-y-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center py-32 gap-4">
                                <div className="w-12 h-12 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0077B6]">Syncing Node...</p>
                            </div>
                        ) : filteredRequests.length > 0 ? (
                            filteredRequests.map((req, index) => (
                                <motion.div
                                    key={req.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => router.push(`/customer/requests/${req.id}` as any)}
                                    className="group bg-white/70 backdrop-blur-md border border-white/80 rounded-[3rem] p-8 hover:shadow-2xl hover:shadow-[#0077B6]/10 transition-all cursor-pointer relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
                                >
                                    {/* Visual Accent Layer */}
                                    <div className="absolute left-0 top-0 h-full w-2 bg-[#00B4D8] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                                    
                                    <div className="flex items-center gap-8 w-full md:w-auto">
                                        <div className="w-16 h-16 bg-[#001D29] rounded-[1.5rem] flex flex-col items-center justify-center text-[#48CAE4] shadow-lg group-hover:bg-[#0077B6] transition-colors duration-500">
                                            <Hash className="w-4 h-4 opacity-40 mb-1" />
                                            <span className="text-xs font-black tracking-tighter">{req.id.slice(-2)}</span>
                                        </div>
                                        
                                        <div className="space-y-2 text-center md:text-left">
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                <h3 className="text-2xl font-serif font-black italic text-[#001D29] tracking-tight">
                                                    {req.payload?.type ? req.payload.type : "Service Request"} 
                                                </h3>
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </div>
                                            <p className="text-[10px] font-bold text-[#001D29]/40 uppercase tracking-[0.2em] flex items-center justify-center md:justify-start gap-2">
                                                <Clock className="w-3 h-3 text-[#00B4D8]" />
                                                EST: {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[#001D29]/5 pt-6 md:pt-0">
                                         <div className="hidden lg:block text-right">
                                            <p className="text-[8px] text-[#001D29]/30 uppercase tracking-[0.3em] font-black mb-1">Integrity Key</p>
                                            <p className="font-mono text-[10px] text-[#0077B6] font-bold tracking-tighter opacity-60">#{req.id.slice(0, 12)}...</p>
                                        </div>
                                        <div className="p-4 bg-white border border-[#001D29]/5 rounded-2xl text-[#001D29] group-hover:bg-[#001D29] group-hover:text-white transition-all duration-300 shadow-sm">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                             <div className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-sm border border-white/60 rounded-[4rem] border-dashed">
                                <div className="p-6 bg-[#001D29]/5 rounded-3xl mb-6">
                                    <Layers className="w-12 h-12 text-[#001D29]/10" />
                                </div>
                                <h3 className="text-xl font-serif font-black italic text-[#001D29]">Registry Empty</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#001D29]/30 mt-3">No matching service nodes found in this path.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #00B4D8; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0077B6; }
            `}</style>
        </ProtectedRoute>
    );
}