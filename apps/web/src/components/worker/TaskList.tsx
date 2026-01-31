"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { TaskStatus } from "@/lib/types/task.types";
import type { Task } from "@/lib/types/task.types";
import { taskService } from "@/lib/api/task.service";
import TaskCard from "./TaskCard";
import TaskActionDialog from "./TaskActionDialog";
import { toast } from "sonner";

type FilterType = "all" | "assigned" | "in_progress";

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<FilterType>("all");
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<"update" | "complete">("update");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await taskService.getAssignedTasks();
            setTasks(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch tasks");
            toast.error("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchTasks();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchTasks, 30000);
        return () => clearInterval(interval);
    }, []);

    // Accept task
    const handleAcceptTask = async (taskId: string) => {
        try {
            setActionLoading(taskId);
            await taskService.acceptTask(taskId);
            toast.success("Task accepted successfully!");
            fetchTasks(); // Refresh list
        } catch (err: any) {
            toast.error(err.message || "Failed to accept task");
        } finally {
            setActionLoading(null);
        }
    };

    // Open update progress dialog
    const handleUpdateProgress = (taskId: string) => {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
            setSelectedTask(task);
            setDialogType("update");
            setDialogOpen(true);
        }
    };

    // Open complete task dialog
    const handleCompleteTask = (taskId: string) => {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
            setSelectedTask(task);
            setDialogType("complete");
            setDialogOpen(true);
        }
    };

    // Submit dialog action
    const handleDialogSubmit = async (data: any) => {
        if (!selectedTask) return;

        try {
            if (dialogType === "update") {
                await taskService.updateTaskProgress(selectedTask.id, data);
                toast.success("Progress updated successfully!");
            } else {
                await taskService.completeTask(selectedTask.id, data);
                toast.success("Task completed successfully!");
            }
            fetchTasks(); // Refresh list
        } catch (err: any) {
            toast.error(err.message || "Action failed");
        }
    };

    // Filter tasks
    const filteredTasks = tasks.filter((task) => {
        if (filter === "assigned") return task.status === TaskStatus.ASSIGNED;
        if (filter === "in_progress") return task.status === TaskStatus.IN_PROGRESS;
        return true;
    });

    return (
        <>
            <div className="bg-white/60 backdrop-blur-sm border border-[#001D29]/10 rounded-[3rem] p-8 md:p-12">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                >
                    {/* Section Header with Divider */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-[#0077B6] rounded-2xl shadow-lg">
                                <ClipboardList className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-3xl font-black text-[#001D29] uppercase tracking-tight">
                                    Task Management
                                </h2>
                                <p className="text-sm text-[#0077B6] font-bold uppercase tracking-widest mt-1">
                                    {filteredTasks.length} active task{filteredTasks.length !== 1 ? "s" : ""}
                                </p>
                            </div>
                            <button
                                onClick={fetchTasks}
                                disabled={loading}
                                className="p-4 bg-white border-2 border-[#0077B6]/20 rounded-2xl hover:bg-[#0077B6]/10 hover:border-[#0077B6]/40 transition-all disabled:opacity-50 group"
                            >
                                <RefreshCw
                                    className={`w-6 h-6 text-[#0077B6] ${loading ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`}
                                />
                            </button>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-[#0077B6]/30 to-transparent" />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-4">
                        {[
                            { value: "all" as FilterType, label: "All Tasks" },
                            { value: "assigned" as FilterType, label: "Assigned" },
                            { value: "in_progress" as FilterType, label: "In Progress" },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setFilter(tab.value)}
                                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                    filter === tab.value
                                        ? "bg-[#0077B6] text-white shadow-lg shadow-[#0077B6]/30"
                                        : "bg-white border-2 border-[#001D29]/10 text-[#001D29] hover:border-[#0077B6]/30 hover:bg-[#0077B6]/5"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Task Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center space-y-4">
                                <Loader2 className="w-10 h-10 text-[#0077B6] animate-spin mx-auto" />
                                <p className="text-sm font-bold text-[#001D29]/60 uppercase tracking-widest">
                                    Loading tasks...
                                </p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center space-y-4">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                                <p className="text-sm font-bold text-red-600">{error}</p>
                                <button
                                    onClick={fetchTasks}
                                    className="px-6 py-3 bg-[#0077B6] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#48CAE4] transition-all"
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center space-y-4">
                                <ClipboardList className="w-12 h-12 text-[#001D29]/20 mx-auto" />
                                <p className="text-sm font-bold text-[#001D29]/60 uppercase tracking-widest">
                                    No tasks found
                                </p>
                                <p className="text-xs text-[#001D29]/40">
                                    {filter === "all"
                                        ? "You have no assigned tasks at the moment."
                                        : `No ${filter.replace("_", " ")} tasks.`}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredTasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onAccept={handleAcceptTask}
                                    onUpdateProgress={handleUpdateProgress}
                                    onComplete={handleCompleteTask}
                                    loading={actionLoading === task.id}
                                />
                            ))}
                        </div>
                    )}
                </motion.section>
            </div>

            {/* Action Dialog */}
            <TaskActionDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleDialogSubmit}
                type={dialogType}
                taskTitle={selectedTask?.title || ""}
            />
        </>
    );
}
