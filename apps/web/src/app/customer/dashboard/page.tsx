"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LogOut, Mail, Phone, Shield, PlusCircle, ListChecks, 
    LayoutDashboard, Settings, Bell, Sparkles, Clock, 
    AlertCircle, CheckCircle2, ChevronRight, Activity, Layers
} from "lucide-react";
import { useEffect, useState } from "react";
import { customerService } from "@/lib/api/customer.service";
import type { CustomerRequest } from "@/lib/types/customer";

export default function CustomerDashboard() {
    // --- YOUR LOGIC: UNTOUCHED ---
    const { user, logout } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState<CustomerRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    useEffect(() => {
        setIsMounted(true);
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

    // --- RENDER HELPERS ---
    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE":
            case "COMPLETED": return "text-emerald-400 bg-emerald-400/10";
            case "IN_PROGRESS": return "text-blue-400 bg-blue-400/10";
            case "NEW": return "text-amber-400 bg-amber-400/10";
            case "CANCELLED": return "text-red-400 bg-red-400/10";
            default: return "text-[#001D29]/60 bg-[#001D29]/5";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "DONE":
            case "COMPLETED": return <CheckCircle2 className="w-4 h-4" />;
            case "IN_PROGRESS": return <Clock className="w-4 h-4" />;
            case "NEW": return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    // Hydration Guard
    if (!isMounted) return <div className="min-h-screen bg-[#E0F2F1]" />;

    return (
        <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
            <div className="min-h-screen w-full bg-[#E0F2F1] flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 relative overflow-x-hidden font-sans">
                
                {/* Background Aesthetic Orbs */}
                <div className="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

                {/* --- Customer Glass Header --- */}
                <header className="sticky top-0 z-50 w-full max-w-7xl bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] px-8 py-4 mb-8 flex flex-col md:flex-row justify-between items-center shadow-[0_8px_32px_rgba(0,123,182,0.05)]">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#001D29] rounded-2xl shadow-lg">
                            <Sparkles className="w-6 h-6 text-[#48CAE4]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#001D29] tracking-tight">Customer Portal</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0077B6]">Premium Textiles Network</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#00B4D8]/10 rounded-full border border-[#00B4D8]/20">
                            <Activity className="w-3 h-3 text-[#0077B6] animate-pulse" />
                            <span className="text-[9px] font-bold text-[#0077B6] uppercase tracking-widest">Account Status: Active</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#001D29] hover:text-[#0077B6] transition-colors group"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </header>

                {/* --- Main Grid Architecture --- */}
                <main className="w-full max-w-7xl grid lg:grid-cols-12 gap-8 items-start relative z-10">
                    
                    {/* LEFT COLUMN: Identity Monolith */}
                    <div className="lg:col-span-4 space-y-8">
                        <section className="bg-[#001D29] rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[550px]">
                            <div className="relative z-10 space-y-12">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-[#0096C7] to-[#48CAE4] p-1 shadow-2xl">
                                        <div className="w-full h-full rounded-[1.8rem] bg-[#001D29] flex items-center justify-center">
                                            <span className="text-4xl font-bold text-[#48CAE4]">{user?.name?.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#48CAE4] rounded-2xl flex items-center justify-center border-4 border-[#001D29] shadow-lg">
                                        <Shield className="w-4 h-4 text-[#001D29]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-serif font-bold text-white tracking-tight">{user?.name}</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#48CAE4] opacity-80">Verified Member: {user?.role}</p>
                                </div>

                                <div className="space-y-6 pt-10 border-t border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-[#48CAE4]">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-medium text-white/90 truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-[#48CAE4]">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Mobile Contact</p>
                                            <p className="text-sm font-medium text-white/90">{user?.phone || "Private Registry"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Layers className="absolute bottom-[-2rem] right-[-2rem] opacity-5 pointer-events-none select-none text-white w-64 h-64 -rotate-12" />
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Interaction & History */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Quick Actions */}
                        <section className="grid md:grid-cols-2 gap-6">
                            <button 
                                onClick={() => router.push('/customer/inventory')}
                                className="group relative p-8 bg-[#0077B6] rounded-[2.5rem] shadow-xl shadow-[#0077B6]/20 transition-all hover:scale-[1.02] active:scale-98 overflow-hidden text-left"
                            >
                                <div className="relative z-10 flex flex-col h-full justify-between">
                                    <PlusCircle className="w-10 h-10 text-[#48CAE4] mb-8 transition-transform group-hover:rotate-90" />
                                    <div>
                                        <h4 className="text-2xl font-black text-white uppercase leading-none tracking-tighter">Show <br/> Inventory</h4>
                                        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#48CAE4] opacity-80">Browse Available Items</p>
                                    </div>
                                </div>
                            </button>

                            <button 
                                onClick={() => router.push('/customer/requests')}
                                className="group relative p-8 bg-white border border-[#001D29]/5 rounded-[2.5rem] shadow-lg shadow-[#001D29]/05 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-98 text-left"
                            >
                                <ListChecks className="w-10 h-10 text-[#0077B6] mb-8 group-hover:scale-110 transition-transform" />
                                <div>
                                    <h4 className="text-2xl font-black text-[#001D29] uppercase leading-none tracking-tighter">My <br/> Requests</h4>
                                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#0077B6]">Track Project Status</p>
                                </div>
                            </button>
                        </section>

                        {/* Recent Activity */}
                        <section className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-[3rem] p-10 shadow-sm">
                            <div className="flex justify-between items-center mb-8 px-2">
                                <h3 className="text-xl font-serif font-bold italic text-[#001D29] tracking-wide">Recent Activity</h3>
                                <div className="h-1.5 w-1.5 bg-[#00B4D8] rounded-full animate-pulse" />
                            </div>
                            
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="flex justify-center p-12">
                                        <div className="w-8 h-8 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : requests.length > 0 ? (
                                    requests.slice(0, 5).map((req) => (
                                        <div 
                                            key={req.id}
                                            onClick={() => router.push(`/customer/requests/${req.id}`)}
                                            className="group flex items-center justify-between p-5 rounded-3xl bg-white border border-[#001D29]/5 hover:border-[#00B4D8] hover:shadow-xl hover:shadow-[#0077B6]/5 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`p-3 rounded-2xl ${getStatusColor(req.status)}`}>
                                                    {getStatusIcon(req.status)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#001D29] text-sm uppercase tracking-tight">
                                                        {req.payload?.type || "Request"} #{req.id.slice(-6)}
                                                    </h4>
                                                    <p className="text-[10px] font-bold text-[#001D29]/40 uppercase tracking-widest pt-1">
                                                        {new Date(req.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-[#001D29]/20 group-hover:text-[#00B4D8] transition-colors" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-[#001D29]/10 rounded-[2.5rem] bg-white/40">
                                        <Activity className="w-8 h-8 text-[#001D29]/20 mb-3" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#001D29]/40">No recent transactions found</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </main>

                {/* --- GLOBAL SCROLLBAR STYLING --- */}
                <style jsx global>{`
                    ::-webkit-scrollbar { width: 8px; }
                    ::-webkit-scrollbar-track { background: #E0F2F1; }
                    ::-webkit-scrollbar-thumb { 
                        background: #00B4D8; 
                        border-radius: 10px; 
                        border: 2px solid #E0F2F1; 
                    }
                    ::-webkit-scrollbar-thumb:hover { background: #0077B6; }
                `}</style>
            </div>
        </ProtectedRoute>
    );
}