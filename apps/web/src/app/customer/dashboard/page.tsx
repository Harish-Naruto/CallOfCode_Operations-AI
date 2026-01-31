"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LogOut, User, Mail, Phone, Shield,
    PlusCircle, ListChecks, LayoutDashboard,
    Settings, Bell, Search, Sparkles
} from "lucide-react";

export default function CustomerDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    // Animation Variants
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
            <div className="min-h-screen bg-[#001D29] text-white flex flex-col lg:flex-row relative overflow-hidden">

                {/* --- Ambient Background Elements --- */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0096C7] rounded-full blur-[150px] opacity-10 pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#00B4D8] rounded-full blur-[120px] opacity-10 pointer-events-none" />

                {/* --- Unique Side Navigation --- */}
                <aside className="w-full lg:w-24 bg-[#002535]/50 backdrop-blur-xl border-r border-white/5 flex flex-col items-center py-8 gap-8 z-20">
                    <div className="w-12 h-12 bg-[#00B4D8] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00B4D8]/20">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <nav className="flex flex-row lg:flex-col gap-6">
                        <button className="p-3 bg-white/10 rounded-xl text-[#48CAE4]"><LayoutDashboard className="w-6 h-6" /></button>
                        <button className="p-3 text-white/40 hover:text-white transition-colors"><Bell className="w-6 h-6" /></button>
                        <button className="p-3 text-white/40 hover:text-white transition-colors"><Settings className="w-6 h-6" /></button>
                    </nav>
                    <button
                        onClick={handleLogout}
                        className="mt-auto p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
                    >
                        <LogOut className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </aside>

                {/* --- Main Content Area --- */}
                <main className="flex-1 relative z-10 p-4 md:p-8 lg:p-12 overflow-y-auto">

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-6xl mx-auto space-y-10"
                    >
                        {/* Header Section */}
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <motion.div variants={itemVariants}>
                                <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
                                <p className="text-[#00B4D8] font-medium mt-1">
                                    Welcome back, <span className="text-white">{user?.name}</span>
                                </p>
                            </motion.div>

                            <motion.div variants={itemVariants} className="relative w-full md:w-auto group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input
                                    placeholder="Search services..."
                                    className="w-full md:w-64 pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[#00B4D8] transition-all"
                                />
                            </motion.div>
                        </header>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Profile Card (Left) */}
                            <motion.section
                                variants={itemVariants}
                                className="lg:col-span-1 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 space-y-8"
                            >
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0096C7] to-[#48CAE4] p-1 shadow-2xl">
                                        <div className="w-full h-full rounded-full bg-[#001D29] flex items-center justify-center">
                                            <span className="text-3xl font-bold text-[#48CAE4]">{user?.name?.charAt(0)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{user?.name}</h2>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00B4D8] px-3 py-1 bg-[#00B4D8]/10 rounded-full mt-2 inline-block">
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-4 text-white/70">
                                        <Mail className="w-4 h-4 text-[#00B4D8]" />
                                        <span className="text-sm truncate">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/70">
                                        <Phone className="w-4 h-4 text-[#00B4D8]" />
                                        <span className="text-sm">{user?.phone || "Private"}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-white/70">
                                        <Shield className="w-4 h-4 text-[#00B4D8]" />
                                        <span className="text-sm">Verified Member</span>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Quick Actions & Feed (Right) */}
                            <div className="lg:col-span-2 space-y-8">
                                <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => router.push('/customer/inventory')}
                                        className="group p-6 bg-[#00B4D8] rounded-[2rem] text-[#001D29] flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#00B4D8]/20">
                                        <div className="p-3 bg-white/20 rounded-2xl group-hover:rotate-12 transition-transform">
                                            <PlusCircle className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold">Show Inventory</div>
                                            <div className="text-xs opacity-70">Browse available items</div>
                                        </div>
                                    </button>

                                    <button className="group p-6 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-4 transition-all hover:bg-white/10 active:scale-95">
                                        <div className="p-3 bg-[#0077B6]/20 rounded-2xl group-hover:scale-110 transition-transform text-[#00B4D8]">
                                            <ListChecks className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold">My Requests</div>
                                            <div className="text-xs text-white/40">Track progress</div>
                                        </div>
                                    </button>
                                </motion.div>

                                <motion.div
                                    variants={itemVariants}
                                    className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8"
                                >
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        Recent Activity
                                        <div className="h-1.5 w-1.5 bg-[#00B4D8] rounded-full animate-pulse" />
                                    </h3>
                                    <div className="space-y-6">
                                        {/* Placeholder for empty state or real data */}
                                        <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-white/10 text-white/20 text-sm justify-center">
                                            No recent transactions found.
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>

            {/* --- Global Scrollbar Styling --- */}
            <style jsx global>{`
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-thumb { background: rgba(0, 180, 216, 0.2); border-radius: 10px; }
                ::-webkit-scrollbar-thumb:hover { background: rgba(0, 180, 216, 0.5); }
            `}</style>
        </ProtectedRoute>
    );
}