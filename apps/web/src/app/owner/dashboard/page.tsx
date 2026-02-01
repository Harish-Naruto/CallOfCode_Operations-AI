"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";
import {
    LogOut, User, Mail, Phone, Shield,
    Settings, Users, BarChart3, Database,
    FileSearch, Bell, Search, Compass, Sparkles,
    Activity, ArrowRight, Layers
} from "lucide-react";

export default function OwnerDashboard() {
    // --- YOUR LOGIC: UNTOUCHED ---
    const { user, logout } = useAuth();
    const router = useRouter();
    const [unassignedTasks, setUnassignedTasks] = React.useState<any[]>([]);
    const [workers, setWorkers] = React.useState<any[]>([]);

    React.useEffect(() => {
        import("@/lib/api/owner.service").then(({ ownerService }) => {
            Promise.all([
                ownerService.getUnassignedTasks(),
                ownerService.listWorkers()
            ]).then(([tasks, allWorkers]) => {
                setUnassignedTasks(tasks);
                setWorkers(allWorkers);
            }).catch(console.error);
        });
    }, []);

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
        <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
            {/* Main Background: Kept consistent with your provided screenshot base */}
            <div className="min-h-screen w-full bg-[#E0F2F1] flex flex-col items-center justify-start p-4 md:p-6 lg:p-8 relative overflow-hidden font-sans">

                {/* Subtle Kinetic Accents using the palette */}
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

                {/* --- Executive Glass Header --- */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-7xl bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] px-8 py-4 mb-6 flex flex-col md:flex-row justify-between items-center shadow-[0_8px_32px_rgba(0,123,182,0.05)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#001D29] rounded-2xl shadow-lg">
                            <Sparkles className="w-6 h-6 text-[#48CAE4]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#001D29] tracking-tight">MSME Control Center</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0077B6]">Operational Integrity 2026</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#00B4D8]/10 rounded-full border border-[#00B4D8]/20">
                            <Activity className="w-3 h-3 text-[#0077B6] animate-pulse" />
                            <span className="text-[9px] font-bold text-[#0077B6] uppercase tracking-widest">Real-time Node: Active</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#001D29] hover:text-[#0077B6] transition-colors group"
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
                    className="w-full max-w-7xl grid lg:grid-cols-12 gap-6 items-start"
                >
                    {/* LEFT COLUMN: Identity Monolith (Styled like your login left panel) */}
                    <motion.section
                        variants={itemVariants}
                        className="lg:col-span-4 bg-[#001D29] rounded-[3rem] p-10 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[500px]"
                    >
                        <div className="relative z-10 space-y-12">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-[#0096C7] to-[#48CAE4] p-1 shadow-2xl">
                                    <div className="w-full h-full rounded-[1.8rem] bg-[#001D29] flex items-center justify-center">
                                        <User className="w-10 h-10 text-[#48CAE4]" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#48CAE4] rounded-2xl flex items-center justify-center border-4 border-[#001D29] shadow-lg">
                                    <Shield className="w-4 h-4 text-[#001D29]" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-serif font-bold text-white tracking-tight">{user?.name}</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#48CAE4] opacity-80">Director: {user?.role}</p>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <Mail className="w-5 h-5 text-[#48CAE4]" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Global Mail</p>
                                        <p className="text-sm font-medium text-white/90 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <Phone className="w-5 h-5 text-[#48CAE4]" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Secure Line</p>
                                        <p className="text-sm font-medium text-white/90">{user?.phone || "Registry Encrypted"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Visual Watermark consistent with login panel */}
                        <div className="absolute bottom-[-2rem] right-[-2rem] opacity-5 pointer-events-none select-none">
                            <Layers className="w-64 h-64 text-white -rotate-12" />
                        </div>
                    </motion.section>

                    {/* RIGHT COLUMN: Interaction Module */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* GOVERNANCE PANEL - Always shown first to align with left card */}
                        <motion.section variants={itemVariants} className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-xl font-serif font-bold italic text-[#001D29] tracking-wide">Governance Panel</h3>
                                <div className="h-[1px] flex-1 bg-[#001D29]/10 mx-6" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Primary Action: Styled with palette electric blue */}
                                <button
                                    onClick={() => router.push("/owner/requests")}
                                    className="group relative p-8 bg-[#0077B6] rounded-[2.5rem] shadow-xl shadow-[#0077B6]/20 transition-all hover:scale-[1.02] active:scale-98 overflow-hidden text-left"
                                >
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <Compass className="w-10 h-10 text-[#48CAE4] mb-8 transition-transform group-hover:rotate-12" />
                                        <div>
                                            <h4 className="text-2xl font-black text-white uppercase leading-none tracking-tighter">View All <br /> Requests</h4>
                                            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#48CAE4] opacity-80">Full Customer Monitor</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="absolute bottom-8 right-8 w-6 h-6 text-white/30 group-hover:translate-x-2 transition-transform" />
                                </button>

                                {/* Manage Workers */}
                                <button
                                    onClick={() => router.push("/owner/workers")}
                                    className="group relative p-8 bg-white border border-[#001D29]/5 rounded-[2.5rem] shadow-lg shadow-[#001D29]/05 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-98 text-left"
                                >
                                    <Users className="w-10 h-10 text-[#0077B6] mb-8 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <h4 className="text-2xl font-black text-[#001D29] uppercase leading-none tracking-tighter">Manage <br /> Workers</h4>
                                        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-[#0077B6]">Artisan Assignment</p>
                                    </div>
                                </button>

                                {/* Other Controls (Mini Grid) */}
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        {
                                            title: "Inventory",
                                            icon: Database,
                                            desc: "Track Stock",
                                            onClick: () => router.push("/owner/inventory"),
                                        },
                                        {
                                            title: "Audit Trail",
                                            icon: FileSearch,
                                            desc: "Verify Logs",
                                            onClick: () => router.push("/owner/audit"),
                                        },
                                    ].map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={item.onClick}
                                            className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-sm border border-[#001D29]/5 rounded-[2rem] hover:bg-white transition-all group"
                                        >
                                            <item.icon className="w-6 h-6 text-[#0077B6] mb-3 group-hover:rotate-12 transition-transform" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#001D29]">
                                                {item.title}
                                            </span>
                                            <span className="text-[8px] font-bold text-[#0077B6]/60 uppercase mt-1">
                                                {item.desc}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        {/* System Summary Card */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-[#001D29]/5 border border-[#001D29]/10 rounded-[2.5rem] p-10 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <BarChart3 className="w-10 h-10 text-[#0077B6]" />
                                <div>
                                    <h4 className="font-bold text-[#001D29]">Network Analytics Summary</h4>
                                    <p className="text-xs text-[#001D29]/60 font-medium">Operational efficiency currently at 98.4% capacity.</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-1.5 h-1.5 bg-[#0077B6] rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </motion.div>

                        {/* UNASSIGNED TASKS ALERT SECTION - Moved to bottom */}
                        {unassignedTasks.length > 0 && (
                            <motion.section variants={itemVariants} className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-6">
                                <h3 className="text-xl font-serif font-bold italic text-amber-700 tracking-wide mb-6 flex items-center gap-2">
                                    <Bell className="w-6 h-6 animate-bounce" />
                                    Action Required ({unassignedTasks.length})
                                </h3>
                                <div className="space-y-4">
                                    {unassignedTasks.map(task => (
                                        <QuickAssignCard
                                            key={task.id}
                                            task={task}
                                            workers={workers}
                                            onAssign={() => window.location.reload()}
                                            viewDetail={() => router.push(`/owner/requests/${task.requestId}`)}
                                        />
                                    ))}
                                </div>
                            </motion.section>
                        )}
                    </div>
                </motion.main>
            </div>
        </ProtectedRoute>
    );
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

function QuickAssignCard({ task, workers, onAssign, viewDetail }: { task: any, workers: any[], onAssign: () => void, viewDetail: () => void }) {
    const [selectedWorker, setSelectedWorker] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleAssign = async () => {
        if (!selectedWorker) return;
        setLoading(true);
        try {
            const { ownerService } = await import("@/lib/api/owner.service");
            await ownerService.assignTask(task.id, selectedWorker, "Quick assign from dashboard");
            onAssign();
        } catch (err) {
            console.error("Quick assignment failed", err);
            alert("Assignment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/80 p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
                <h4 className="font-black text-[#001D29]">{task.title}</h4>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">{task.reason}</p>
                <button onClick={viewDetail} className="text-[10px] underline text-[#0077B6] mt-1 font-bold">
                    View Full Details
                </button>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
                <select
                    value={selectedWorker}
                    onChange={(e) => setSelectedWorker(e.target.value)}
                    className="p-2 rounded-lg bg-white border border-[#001D29]/10 text-xs font-bold text-[#001D29] outline-none focus:border-[#0077B6]"
                >
                    <option value="">Quick Select...</option>
                    {workers.map(w => (
                        <option key={w.id} value={w.id}>{w.name} ({w.activeTaskCount})</option>
                    ))}
                </select>
                <button
                    onClick={handleAssign}
                    disabled={!selectedWorker || loading}
                    className="px-4 py-2 bg-[#001D29] text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#0077B6] disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                    {loading ? "..." : "Assign"}
                </button>
            </div>
        </div>
    );
}