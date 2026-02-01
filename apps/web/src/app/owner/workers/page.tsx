"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ownerService } from "@/lib/api/owner.service";
import type { WorkerSummary, UnassignedTask } from "@/lib/api/owner.service";

export default function OwnerWorkersPage() {
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

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-amber-600 mb-2">
                        Atelier Artisans
                    </h1>
                    <p className="text-stone-400">Monitor real-time status and workload of your staff.</p>
                </div>
                <button
                    onClick={fetchAllData}
                    disabled={loading}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-sm border border-stone-700 transition-colors disabled:opacity-50"
                >
                    {loading ? "Refreshing..." : "Refresh Status"}
                </button>
            </div>

            {loading && (
                <div className="flex justify-center p-20">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workers.map((worker) => (
                        <WorkerAssignmentCard
                            key={worker.id}
                            worker={worker}
                            unassignedTasks={unassignedTasks}
                            onAssign={fetchAllData}
                        />
                    ))}
                </div>
            )}
        </div>
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1C1917] border border-stone-800 p-6 rounded-xl shadow-lg hover:border-orange-500/30 transition-all flex flex-col justify-between"
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-xl border border-stone-700 text-stone-300">
                            {worker.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-stone-100">{worker.name}</h3>
                            <p className="text-xs text-stone-500 uppercase tracking-wider">{worker.role}</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${worker.status === 'BUSY'
                        ? 'bg-amber-900/30 border-amber-700/50 text-amber-500'
                        : 'bg-green-900/30 border-green-700/50 text-green-500'
                        }`}>
                        {worker.status}
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center bg-stone-900/50 p-3 rounded-lg border border-stone-800/50 hover:border-stone-700 transition-colors">
                        <span className="text-stone-400 text-sm">Active Tasks</span>
                        <span className="text-xl font-mono text-stone-200">{worker.activeTaskCount}</span>
                    </div>

                    <div>
                        <span className="text-xs text-stone-500 mb-2 block uppercase tracking-wider">Specialties</span>
                        <div className="flex flex-wrap gap-2">
                            {worker.skills.map(skill => (
                                <span key={skill} className="px-2 py-1 bg-stone-800/80 text-stone-300 text-xs rounded border border-stone-700/50">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-stone-800">
                {!assigning ? (
                    <button
                        onClick={() => setAssigning(true)}
                        className="w-full py-2 bg-stone-800 text-stone-300 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-stone-700 transition-colors border border-stone-700"
                    >
                        + Assign Task
                    </button>
                ) : (
                    <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center text-xs text-stone-400 font-bold uppercase tracking-wider">
                            <span>Select Task</span>
                            <button onClick={() => setAssigning(false)} className="text-red-400 hover:text-red-300">Cancel</button>
                        </div>
                        <select
                            value={selectedTaskId}
                            onChange={(e) => setSelectedTaskId(e.target.value)}
                            className="w-full p-2 bg-stone-900 border border-stone-700 rounded-lg text-stone-300 text-xs outline-none focus:border-orange-500"
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
                            className="w-full py-2 bg-orange-600 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-orange-500 disabled:opacity-50 transition-colors shadow-lg shadow-orange-900/20"
                        >
                            {loading ? "Assigning..." : "Confirm"}
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
