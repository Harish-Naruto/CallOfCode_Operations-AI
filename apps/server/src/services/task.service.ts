import { TaskStatus } from "../types/types";
import prisma from "@Hackron/db";
import { AppError } from "../middleware/error.middleware";
import { invokeAgent } from "../agent";
import type { PlannedTask } from "../agent";

/**
 * Task Service - Business logic for task management
 */

export class TaskService {
    /**
     * Get tasks assigned to a worker
     */
    async getAssignedTasks(workerId: string): Promise<any[]> {
        const tasks = await prisma.task.findMany({
            where: {
                workerId: workerId,
                status: {
                    in: [TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS],
                },
            },
            include: {
                request: true,
            },
            orderBy: { createdAt: "asc" },
        });

        return tasks;
    }

    /**
     * Accept a task
     */
    async acceptTask(taskId: string, workerId: string): Promise<void> {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            throw new AppError(404, "Task not found");
        }

        if (task.workerId !== workerId) {
            throw new AppError(403, "Task not assigned to you");
        }

        await prisma.task.update({
            where: { id: taskId },
            data: {
                status: TaskStatus.IN_PROGRESS,
                startedAt: new Date(),
            },
        });
    }

    /**
     * Update task progress
     */
    async updateTaskProgress(
        taskId: string,
        workerId: string,
        actualMinutesSoFar: number,
        notes?: string,
    ): Promise<void> {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task || task.workerId !== workerId) {
            throw new AppError(403, 'Task not found or not assigned to you');
        }

        await prisma.task.update({
            where: { id: taskId },
            data: {
                metadata: {
                    ...(task.metadata as object),
                    actualMinutesSoFar,
                    lastUpdate: new Date().toISOString(),
                    progressNotes: notes,
                } as any,
            },
        });
    }

    /**
     * Complete a task
     */
    async completeTask(
        taskId: string,
        workerId: string,
        actualMinutes: number,
        qualityOk: boolean,
        notes?: string,
    ): Promise<void> {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { request: true },
        });

        if (!task || task.workerId !== workerId) {
            throw new AppError(403, 'Task not found or not assigned to you');
        }

        await prisma.$transaction(async (tx) => {
            // Update task
            await tx.task.update({
                where: { id: taskId },
                data: {
                    status: "DONE",
                    completedAt: new Date(),
                    metadata: {
                        actualMinutes,
                        completionNotes: notes,
                        qualityCheck: qualityOk
                    } as any,
                },
            });

            // Update request status if all tasks are done
            if (task.requestId) {
                const allTasks = await tx.task.findMany({
                    where: { requestId: task.requestId },
                });

                const allDone = allTasks.every(t =>
                    t.id === taskId ? true : t.status === "DONE"
                );

                if (allDone) {
                    await tx.request.update({
                        where: { id: task.requestId },
                        data: { status: "DONE" },
                    });
                }
            }
        });
    }

    /**
     * Set worker availability
     */
    async setAvailability(workerId: string, shifts: any[]): Promise<void> {
        // Feature temporarily disabled
        // TODO: Implement availability tracking
        // Placeholder until WorkerAvailability model is confirmed/added
        // Placeholder until WorkerAvailability model is confirmed/added
        console.log("Setting worker availability:", { workerId, shifts });

        // await prisma.workerAvailability.deleteMany({
        //   where: {
        //     workerId,
        //     start: { gte: new Date() },
        //   },
        // });
        //
        // await prisma.workerAvailability.createMany({
        //   data: shifts.map(shift => ({
        //     workerId,
        //     start: new Date(shift.start),
        //     end: new Date(shift.end),
        //   })),
        // });
    }

    /**
     * Create tasks from agent's planned tasks
     * Used by act.node to create tasks in DB
     */
    async createTasksFromAgent(requestId: string, plannedTasks: PlannedTask[]): Promise<any[]> {
        const createdTasks: any[] = [];

        for (const task of plannedTasks) {
            const created = await prisma.task.create({
                data: {
                    requestId,
                    title: task.title,
                    description: task.description,
                    requiredSkills: task.requiredSkills,
                    estimatedMin: task.estimatedMin,
                    status: task.suggestedWorkerId ? TaskStatus.ASSIGNED : TaskStatus.PENDING,
                    workerId: task.suggestedWorkerId,
                },
            });
            createdTasks.push(created);
        }

        console.log(`[TaskService] Created ${createdTasks.length} tasks from agent for request ${requestId}`);
        return createdTasks;
    }

    /**
     * Trigger agent re-evaluation for a request
     * Used when task state changes (accept, complete, etc.)
     */
    async triggerAgentReEvaluation(requestId: string): Promise<void> {
        console.log(`[TaskService] Triggering agent re-evaluation for request ${requestId}`);

        // Trigger agent workflow (fire and forget)
        invokeAgent(requestId).catch(err =>
            console.error(`[TaskService] Agent re-evaluation failed for ${requestId}:`, err)
        );
    }
}

export const taskService = new TaskService();

