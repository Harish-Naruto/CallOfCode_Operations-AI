"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
    LogOut, User, Mail, Phone, Shield, 
    ClipboardList, Calendar, History, 
    Bell, Scissors, ArrowRight, Activity, Sparkles, Layers
} from "lucide-react";
import TaskList from "@/components/worker/TaskList";

export default function WorkerDashboard() {
    // --- YOUR LOGIC: UNTOUCHED ---
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    // Animation Variants
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const fadeInUp = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <ProtectedRoute allowedRoles={[UserRole.WORKER, UserRole.OWNER]}>
            {/* Main Background: Consistent with your provided screenshot base */}
            <div className="min-h-screen w-full bg-[#E0F2F1] flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 relative overflow-hidden font-sans">
                
                {/* Subtle Kinetic Accents using the palette electric blues */}
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

                {/* --- Artisan Glass Header --- */}
                <motion.header 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-7xl bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] px-8 py-4 mb-8 flex flex-col md:flex-row justify-between items-center shadow-[0_8px_32px_rgba(0,123,182,0.05)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#001D29] rounded-2xl shadow-lg">
                            <Scissors className="w-6 h-6 text-[#48CAE4]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#001D29] tracking-tight">MSME Artisan Station</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0077B6]">Professional Network 2026</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#00B4D8]/10 rounded-full border border-[#00B4D8]/20">
                            <Activity className="w-3 h-3 text-[#0077B6] animate-pulse" />
                            <span className="text-[9px] font-bold text-[#0077B6] uppercase tracking-widest">System Online</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#001D29] hover:text-red-500 transition-colors group"
                        >
                            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            <span>Terminate Session</span>
                        </button>
                    </div>
                </motion.header>

                {/* --- Main Grid Architecture --- */}
                <motion.main 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-7xl space-y-8"
                >
                    {/* Top Section: User Info + Quick Actions */}
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* LEFT COLUMN: Identity Monolith */}
                        <motion.section 
                            variants={itemVariants}
                            className="lg:col-span-4 bg-[#001D29] rounded-[3rem] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                        >
                            <div className="relative z-10 space-y-8">
                                <div className="relative inline-block">
                                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-tr from-[#0096C7] to-[#48CAE4] p-1 shadow-2xl">
                                        <div className="w-full h-full rounded-[1.8rem] bg-[#001D29] flex items-center justify-center">
                                            <User className="w-8 h-8 text-[#48CAE4]" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#48CAE4] rounded-xl flex items-center justify-center border-4 border-[#001D29] shadow-lg">
                                        <Shield className="w-3 h-3 text-[#001D29]" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h2 className="text-2xl font-serif font-bold text-white tracking-tight">{user?.name}</h2>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#48CAE4] opacity-80">Identity: {user?.role}</p>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <Mail className="w-4 h-4 text-[#48CAE4]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Registered Mail</p>
                                            <p className="text-xs font-medium text-white/90 truncate">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <Phone className="w-4 h-4 text-[#48CAE4]" />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Contact Line</p>
                                            <p className="text-xs font-medium text-white/90">{user?.phone || "Private Registry"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Visual Watermark */}
                            <div className="absolute bottom-[-1.5rem] right-[-1.5rem] opacity-5 pointer-events-none select-none">
                                <Layers className="w-48 h-48 text-white -rotate-12" />
                            </div>
                        </motion.section>

                        {/* RIGHT COLUMN: Quick Access Modules */}
                        <div className="lg:col-span-8">
                            <motion.section variants={itemVariants} className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-xl font-serif font-bold italic text-[#001D29] tracking-wide">Quick Access</h3>
                                    <div className="h-[1px] flex-1 bg-[#001D29]/10 mx-6" />
                                </div>
                                
                            
<div className="flex flex-col sm:flex-row gap-6 w-full h-full">
    {/* My Tasks Terminal Block */}
    <button 
        onClick={() => router.push("/worker/tasks")}
        className="group relative flex-1 min-h-[220px] p-8 bg-[#0077B6] border border-white/5 rounded-[2.5rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 overflow-hidden text-left"
    >
        {/* Visual Background Gradient consistent with your palette */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0077B6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-[#00B4D8] transition-colors duration-300">
                <ClipboardList className="w-8 h-8 text-[#48CAE4] group-hover:text-[#001D29] transition-transform group-hover:rotate-6" />
            </div>
            
            <div>
                <h4 className="text-2xl font-black text-white uppercase leading-none tracking-tighter">
                    My Tasks
                </h4>
                <p className="mt-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#00B4D8] opacity-80">
                    Artisan Queue v.2026
                </p>
            </div>
        </div>

        {/* Decorative element from your brand identity */}
        <div className="absolute -bottom-4 -right-4 p-8 bg-[#48CAE4]/10 rounded-full group-hover:scale-110 transition-transform duration-500">
            <ArrowRight className="w-6 h-6 text-[#48CAE4]" />
        </div>
    </button>
</div>
                            </motion.section>
                        </div>
                    </div>

                    {/* System Health Decor */}
                    <motion.div variants={itemVariants} className="flex justify-center gap-2 opacity-40 py-4">
                        <Sparkles className="w-4 h-4 text-[#0077B6]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#001D29]">Artisan Station 2.0 Secure</span>
                    </motion.div>
                </motion.main>
            </div>
        </ProtectedRoute>
    );
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};