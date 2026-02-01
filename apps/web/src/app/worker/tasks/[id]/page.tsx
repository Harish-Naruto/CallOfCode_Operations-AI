"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import apiClient from "@/lib/api/client";
import TaskActionDialog from "@/components/worker/TaskActionDialog";

type WorkerSummary = {
  id: string;
  name: string;
};

type TaskDetail = {
  id: string;
  status: string;
  requestId?: string | null;
  createdAt: string;
  startedAt?: string | null;
  completedAt?: string | null;
  metadata?: Record<string, any>;
  request?: {
    id: string;
    status: string;
  };
};

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<TaskDetail[]>("/api/worker/tasks")
      .then((res) => {
        const found = res.data.find((t) => t.id === id);
        setTask(found || null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10">Loading task…</div>;
  if (!task) return <div className="p-10">Task not found</div>;

  return (
    <ProtectedRoute allowedRoles={[UserRole.WORKER]}>
      <div className="max-w-4xl mx-auto p-10 space-y-8">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push("/worker/tasks")}
            className="text-sm text-blue-600 mb-4"
          >
            ← Back to My Tasks
          </button>

          <h1 className="text-2xl font-bold">Task #{task.id}</h1>
          <p className="text-sm text-gray-500">
            Status: <strong>{task.status}</strong>
          </p>
        </div>

        {/* Request Info */}
        {task.request && (
          <div className="p-6 bg-white rounded-xl shadow">
            <h3 className="font-semibold mb-2">Request</h3>
            <p>ID: {task.request.id}</p>
            <p>Status: {task.request.status}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="p-6 bg-white rounded-xl shadow space-y-2">
          <h3 className="font-semibold">Timeline</h3>
          <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
          {task.startedAt && (
            <p>Started: {new Date(task.startedAt).toLocaleString()}</p>
          )}
          {task.completedAt && (
            <p>Completed: {new Date(task.completedAt).toLocaleString()}</p>
          )}
        </div>

        {/* Metadata */}
        {task.metadata && (
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold mb-2">Progress</h3>
            <pre className="text-xs bg-white p-4 rounded-lg overflow-auto">
              {JSON.stringify(task.metadata, null, 2)}
            </pre>
          </div>
        )}

        {/* Actions */}
        {/* @ts-ignore */}
        <TaskActionDialog task={task} onUpdated={() => router.refresh()} />
      </div>
    </ProtectedRoute>
  );
}
