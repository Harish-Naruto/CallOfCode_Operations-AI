import type { Request, Response } from "express";
import { taskService } from "../services/task.service";
import type {
    AssignedTaskResponse,
    UpdateTaskProgressRequest,
    CompleteTaskRequest,
    SetAvailabilityRequest,
    SuccessResponse,
} from "../types/types";

/**
 * Worker Controller - Handles worker dashboard endpoints
 */

export class WorkerController {
    /**
     * GET /api/tasks?assignedTo=me
     * Get tasks assigned to authenticated worker
     */
    async getAssignedTasks(req: Request, res: Response): Promise<void> {
        const workerId = req.user!.id;

        const tasks = await taskService.getAssignedTasks(workerId);

        const response: AssignedTaskResponse[] = tasks.map((task: any) => ({
            taskId: task.id,
            requestId: task.requestId,
            title: task.title,
            estimated_minutes: task.estimatedMin,
            status: task.status,
        }));

        res.status(200).json(response);
    }

    /**
     * POST /api/tasks/:taskId/accept
     * Accept task assignment
     */
    async acceptTask(req: Request, res: Response): Promise<void> {
        const taskId = req.params.taskId as string;
        const workerId = req.user!.id;

        await taskService.acceptTask(taskId, workerId);

        // Auto-trigger agent to re-evaluate workload and priorities
        const task = await import("@Hackron/db").then(m => m.default.task.findUnique({
            where: { id: taskId },
            select: { requestId: true },
        }));

        if (task?.requestId) {
            await taskService.triggerAgentReEvaluation(task.requestId);
        }

        const response: SuccessResponse = {
            success: true,
        };

        res.status(200).json(response);
    }

    /**
     * POST /api/tasks/:taskId/update
     * Update task progress
     */
    async updateTaskProgress(req: Request, res: Response): Promise<void> {
        const taskId = req.params.taskId as string;
        const workerId = req.user!.id;
        const { actual_minutes_so_far, notes } = req.body as UpdateTaskProgressRequest;

        await taskService.updateTaskProgress(
            taskId,
            workerId,
            actual_minutes_so_far,
            notes,
        );

        const response: SuccessResponse = {
            success: true,
        };

        res.status(200).json(response);
    }

    /**
     * POST /api/tasks/:taskId/complete
     * Complete task
     */
    async completeTask(req: Request, res: Response): Promise<void> {
        const taskId = req.params.taskId as string;
        const workerId = req.user!.id;
        const { actual_minutes, quality_ok, notes } = req.body as CompleteTaskRequest;

        await taskService.completeTask(
            taskId,
            workerId,
            actual_minutes,
            quality_ok,
            notes,
        );

        // Auto-trigger agent to assign next tasks or mark request complete
        const task = await import("@Hackron/db").then(m => m.default.task.findUnique({
            where: { id: taskId },
            select: { requestId: true },
        }));

        if (task?.requestId) {
            await taskService.triggerAgentReEvaluation(task.requestId);
        }

        const response: SuccessResponse = {
            success: true,
        };

        res.status(200).json(response);
    }

    /**
     * POST /api/workers/:workerId/availability
     * Set worker availability
     */
    async setAvailability(req: Request, res: Response): Promise<void> {
        const workerId = req.params.workerId as string;
        const authenticatedWorkerId = req.user!.id;
        const { shifts } = req.body as SetAvailabilityRequest;

        // Workers can only set their own availability (unless OWNER)
        if (workerId !== authenticatedWorkerId && req.user!.role !== "OWNER") {
            res.status(403).json({
                error: "Forbidden",
                message: "You can only set your own availability",
            });
            return;
        }

        await taskService.setAvailability(workerId, shifts);

        const response: SuccessResponse = {
            success: true,
        };

        res.status(200).json(response);
    }
}

export const workerController = new WorkerController();
