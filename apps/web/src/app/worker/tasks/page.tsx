"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { UserRole } from "@/lib/types/auth";
import TaskList from "@/components/worker/TaskList";

export default function WorkerTasksPage() {
  return (
    <ProtectedRoute allowedRoles={[UserRole.WORKER]}>
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-6">My Tasks</h1>
        <TaskList />
      </div>
    </ProtectedRoute>
  );
}
