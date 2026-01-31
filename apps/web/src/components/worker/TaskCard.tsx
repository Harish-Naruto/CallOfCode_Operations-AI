"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle, PlayCircle, Circle } from "lucide-react";
import { TaskStatus } from "@/lib/types/task.types";
import type { Task } from "@/lib/types/task.types";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
    task: Task;
    onAccept: (taskId: string) => void;
    onUpdateProgress: (taskId: string) => void;
    onComplete: (taskId: string) => void;
    loading?: boolean;
}

export default function TaskCard({
    task,
    onAccept,
    onUpdateProgress,
    onComplete,
    loading = false,
}: TaskCardProps) {
    const getStatusColor = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.ASSIGNED:
                return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
            case TaskStatus.IN_PROGRESS:
                return "bg-blue-500/20 text-blue-700 border-blue-500/30";
            case TaskStatus.DONE:
                return "bg-green-500/20 text-green-700 border-green-500/30";
            case TaskStatus.BLOCKED:
                return "bg-red-500/20 text-red-700 border-red-500/30";
            default:
                return "bg-gray-500/20 text-gray-700 border-gray-500/30";
        }
    };

    const getStatusIcon = (status: TaskStatus) => {
        switch (status) {
            case TaskStatus.ASSIGNED:
                return <Circle className="w-3 h-3" />;
            case TaskStatus.IN_PROGRESS:
                return <PlayCircle className="w-3 h-3" />;
            case TaskStatus.DONE:
                return <CheckCircle className="w-3 h-3" />;
            default:
                return <Circle className="w-3 h-3" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-white/60 backdrop-blur-sm border border-[#001D29]/10 rounded-[2rem] p-6 hover:shadow-xl transition-all hover:scale-[1.02]"
        >
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusColor(
                        task.status
                    )}`}
                >
                    {getStatusIcon(task.status)}
                    <span>{task.status.replace("_", " ")}</span>
                </div>
                <div className="flex items-center gap-2 text-[#0077B6]">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold">{task.estimatedMin} min</span>
                </div>
            </div>

            {/* Task Info */}
            <div className="mb-4">
                <h3 className="text-lg font-black text-[#001D29] uppercase tracking-tight mb-2">
                    {task.title}
                </h3>
                {task.description && (
                    <p className="text-sm text-[#001D29]/60 font-medium">
                        {task.description}
                    </p>
                )}
                <p className="text-xs text-[#0077B6] font-bold uppercase tracking-widest mt-2">
                    Request ID: {task.requestId.slice(0, 8)}...
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                {task.status === TaskStatus.ASSIGNED && (
                    <button
                        onClick={() => onAccept(task.id)}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-[#0077B6] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#48CAE4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Accepting..." : "Accept Task"}
                    </button>
                )}

                {task.status === TaskStatus.IN_PROGRESS && (
                    <>
                        <button
                            onClick={() => onUpdateProgress(task.id)}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-white border border-[#0077B6] text-[#0077B6] rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0077B6]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => onComplete(task.id)}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-[#0077B6] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#48CAE4] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Complete
                        </button>
                    </>
                )}

                {task.status === TaskStatus.DONE && (
                    <div className="flex-1 px-4 py-3 bg-green-500/20 text-green-700 rounded-xl text-xs font-black uppercase tracking-widest text-center">
                        Completed ✓
                    </div>
                )}
            </div>
        </motion.div>
    );
}
