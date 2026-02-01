import apiClient from "./client";

export interface WorkerSummary {
    id: string;
    name: string;
    email: string;
    role: "WORKER";
    skills: string[];
    status: "IDLE" | "BUSY" | "OFFLINE";
    activeTaskCount: number;
}

export interface UnassignedTask {
    id: string;
    requestId: string;
    title: string;
    priority: number;
    requiredSkills: string[];
    createdAt: string;
    reason?: string;
}

class OwnerService {
    /**
     * List all workers with status
     */
    async listWorkers(): Promise<WorkerSummary[]> {
        const response = await apiClient.get<WorkerSummary[]>("/api/owner/workers");
        return response.data;
    }

    /**
     * Get unassigned/escalated tasks
     */
    async getUnassignedTasks(): Promise<UnassignedTask[]> {
        const response = await apiClient.get<UnassignedTask[]>("/api/owner/tasks/unassigned");
        return response.data;
    }

    /**
     * Force assign a request to a worker
     */
    /**
     * Force assign a task to a worker
     */
    async assignTask(taskId: string, workerId: string, reason: string): Promise<void> {
        await apiClient.post(`/api/owner/tasks/${taskId}/assign`, {
            workerId,
            reason,
        });
    }
}

export const ownerService = new OwnerService();
