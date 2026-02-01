"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ownerService } from "@/lib/api/owner.service";
import type { WorkerSummary, UnassignedTask } from "@/lib/api/owner.service";
import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import { Sparkles, Activity, LogOut, ArrowLeft, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";

export default function OwnerWorkersPage() {
    const { logout } = useAuth();
    const router = useRouter();
    const [workers, setWorkers] = useState<WorkerSummary[]>([]);
    const [unassignedTasks, setUnassignedTasks] = useState<UnassignedTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [workersData, tasksData] = await Promise.all([
                ownerService.listWorkers(),
                ownerService.getUnassignedTasks()
            ]);
            setWorkers(workersData);
            setUnassignedTasks(tasksData);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            setError("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push("/auth/login");
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
            <div className="min-h-screen w-full bg-[#E0F2F1] flex flex-col items-center justify-start p-4 md:p-8 lg:p-12 relative overflow-hidden font-sans">
                {/* Subtle Kinetic Accents */}
                <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#0077B6]/10 rounded-full blur-[100px] pointer-events-none" />

                {/* --- Header --- */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-7xl bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2rem] px-8 py-4 mb-8 flex flex-col md:flex-row justify-between items-center shadow-[0_8px_32px_rgba(0,123,182,0.05)]"
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-3 bg-white/50 hover:bg-white rounded-2xl transition-colors text-[#001D29]"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="p-3 bg-[#001D29] rounded-2xl shadow-lg">
                            <Sparkles className="w-6 h-6 text-[#48CAE4]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[#001D29] tracking-tight">Manage Workers</h1>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0077B6]">Artisan Assignment</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#00B4D8]/10 rounded-full border border-[#00B4D8]/20">
                            <Activity className="w-3 h-3 text-[#0077B6] animate-pulse" />
                            <span className="text-[9px] font-bold text-[#0077B6] uppercase tracking-widest">System Online</span>
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

                <div className="w-full max-w-7xl mb-6 flex justify-between items-center">
                    <button
                        onClick={fetchAllData}
                        className="px-6 py-3 bg-[#001D29] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#0077B6] transition-colors shadow-lg shadow-[#001D29]/20"
                    >
                        {loading ? "Refreshing..." : "Refresh Status"}
                    </button>

                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#001D29]/40" />
                            <input
                                type="text"
                                placeholder="Search artisans..."
                                className="pl-10 pr-4 py-3 bg-white/40 border border-white/60 rounded-xl text-sm text-[#001D29] placeholder-[#001D29]/40 outline-none focus:border-[#0077B6] w-64 backdrop-blur-sm"
                            />
                        </div>
                        <button className="p-3 bg-white/40 border border-white/60 rounded-xl text-[#001D29] hover:bg-white transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center p-20">
                        <div className="w-10 h-10 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="w-full max-w-7xl bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-8">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {workers.map((worker) => (
                            <WorkerAssignmentCard
                                key={worker.id}
                                worker={worker}
                                unassignedTasks={unassignedTasks}
                                onAssign={fetchAllData}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </ProtectedRoute>
    );
}

function WorkerAssignmentCard({ worker, unassignedTasks, onAssign }: { worker: WorkerSummary, unassignedTasks: UnassignedTask[], onAssign: () => void }) {
    const [assigning, setAssigning] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAssign = async () => {
        if (!selectedTaskId) return;
        setLoading(true);
        try {
            await ownerService.assignTask(selectedTaskId, worker.id, "Manual assignment from worker list");
            setAssigning(false);
            setSelectedTaskId("");
            onAssign();
        } catch (err) {
            console.error("Assignment failed", err);
            alert("Failed to assign task");
        } finally {
            setLoading(false);
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
    };

    return (
        <motion.div
            variants={itemVariants}
            className="bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-[2rem] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex flex-col justify-between"
        >
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0096C7] to-[#48CAE4] p-[2px] shadow-md">
                            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center font-black text-[#001D29] text-xl">
                                {worker.name.charAt(0)}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-[#001D29] text-lg">{worker.name}</h3>
                            <p className="text-[10px] text-[#0077B6] font-bold uppercase tracking-wider">{worker.role}</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${worker.status === 'BUSY'
                        ? 'bg-amber-100 border-amber-200 text-amber-700'
                        : 'bg-emerald-100 border-emerald-200 text-emerald-700'
                        }`}>
                        {worker.status}
                    </div>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center bg-white/50 p-4 rounded-2xl border border-white/60">
                        <span className="text-[#001D29]/60 text-xs font-bold uppercase tracking-wider">Active Tasks</span>
                        <span className="text-2xl font-black text-[#001D29]">{worker.activeTaskCount}</span>
                    </div>

                    <div>
                        <span className="text-[10px] text-[#001D29]/40 font-bold uppercase tracking-widest mb-3 block">Specialties</span>
                        <div className="flex flex-wrap gap-2">
                            {worker.skills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-[#001D29]/5 text-[#001D29] text-[10px] font-bold uppercase tracking-wide rounded-lg border border-[#001D29]/5">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-[#001D29]/5">
                {!assigning ? (
                    <button
                        onClick={() => setAssigning(true)}
                        className="w-full py-3 bg-white border border-[#001D29]/10 text-[#001D29] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#001D29] hover:text-white transition-all shadow-sm"
                    >
                        + Assign Task
                    </button>
                ) : (
                    <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center text-[10px] text-[#001D29]/60 font-bold uppercase tracking-wider px-1">
                            <span>Select Task</span>
                            <button onClick={() => setAssigning(false)} className="text-red-500 hover:text-red-700">Cancel</button>
                        </div>
                        <select
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            className="w-full p-3 bg-white/80 border border-[#001D29]/10 rounded-xl text-[#001D29] text-sm outline-none focus:border-[#0077B6]"
                        >
                            <option value="">Choose task...</option>
                            {unassignedTasks.length === 0 && <option disabled>No unassigned tasks</option>}
                            {unassignedTasks.map(t => (
                                <option key={t.id} value={t.id}>
                                    {t.title}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAssign}
                            disabled={!selectedTaskId || loading}
                            className="w-full py-3 bg-[#0077B6] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#0096C7] disabled:opacity-50 transition-all shadow-lg shadow-[#0077B6]/20"
                        >
                            {loading ? "Assigning..." : "Confirm Assignment"}
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
