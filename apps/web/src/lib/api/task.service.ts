import apiClient from "./client";
import type {
    Task,
    AssignedTaskResponse,
    UpdateTaskProgressInput,
    CompleteTaskInput,
    SetAvailabilityInput,
    TaskActionResponse,
} from "../types/task.types";

/**
 * Task Service
 * API calls for worker task management
 */

class TaskService {
    /**
     * Get all tasks assigned to the authenticated worker
     */
    async getAssignedTasks(): Promise<Task[]> {
        const response = await apiClient.get<AssignedTaskResponse[]>("/api/tasks", {
            params: { assignedTo: "me" },
        });

        // Transform backend response to match our Task interface
        return response.data.map((task) => ({
            id: task.taskId,
            requestId: task.requestId,
            title: task.title,
            description: "",
            requiredSkills: [],
            estimatedMin: task.estimated_minutes,
            status: task.status,
            createdAt: new Date().toISOString(),
        }));
    }

    /**
     * Accept a task assignment
     */
    async acceptTask(taskId: string): Promise<TaskActionResponse> {
        const response = await apiClient.post<TaskActionResponse>(
            `/api/tasks/${taskId}/accept`
        );
        return response.data;
    }

    /**
     * Update task progress
     */
    async updateTaskProgress(
        taskId: string,
        data: UpdateTaskProgressInput
    ): Promise<TaskActionResponse> {
        const response = await apiClient.post<TaskActionResponse>(
            `/api/tasks/${taskId}/update`,
            data
        );
        return response.data;
    }

    /**
     * Complete a task
     */
    async completeTask(
        taskId: string,
        data: CompleteTaskInput
    ): Promise<TaskActionResponse> {
        const response = await apiClient.post<TaskActionResponse>(
            `/api/tasks/${taskId}/complete`,
            data
        );
        return response.data;
    }

    /**
     * Set worker availability
     */
    async setAvailability(
        workerId: string,
        data: SetAvailabilityInput
    ): Promise<TaskActionResponse> {
        const response = await apiClient.post<TaskActionResponse>(
            `/api/workers/${workerId}/availability`,
            data
        );
        return response.data;
    }
}

export const taskService = new TaskService();
