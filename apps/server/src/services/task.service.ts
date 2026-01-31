// Unused import removed - TaskStatus will be used when Prisma is integrated
import { TaskStatus } from "../types/types";

/**
 * Task Service - Business logic for task management
 * TODO: Integrate with Prisma client from @Hackron/db
 */

export class TaskService {
    /**
     * Get tasks assigned to a worker
     */
    async getAssignedTasks(workerId: string): Promise<any[]> {
        // TODO: Replace with actual Prisma query
        console.log("Fetching assigned tasks for worker:", workerId);

        // In production:
        // const tasks = await prisma.task.findMany({
        //   where: {
        //     assignedToId: workerId,
        //     status: {
        //       in: [TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS],
        //     },
        //   },
        //   include: {
        //     request: true,
        //   },
        //   orderBy: { createdAt: 'asc' },
        // });

        return [];
    }

    /**
     * Accept a task
     */
    async acceptTask(taskId: string, workerId: string): Promise<void> {
        // TODO: Implement with Prisma
        console.log("Accepting task:", { taskId, workerId });

        // In production:
        // const task = await prisma.task.findUnique({
        //   where: { id: taskId },
        // });
        //
        // if (!task) {
        //   throw new AppError(404, 'Task not found');
        // }
        //
        // if (task.assignedToId !== workerId) {
        //   throw new AppError(403, 'Task not assigned to you');
        // }
        //
        // await prisma.task.update({
        //   where: { id: taskId },
        //   data: {
        //     status: TaskStatus.IN_PROGRESS,
        //     startedAt: new Date(),
        //   },
        // });
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
        // TODO: Implement with Prisma
        console.log("Updating task progress:", {
            taskId,
            workerId,
            actualMinutesSoFar,
            notes,
        });

        // In production:
        // const task = await prisma.task.findUnique({
        //   where: { id: taskId },
        // });
        //
        // if (!task || task.assignedToId !== workerId) {
        //   throw new AppError(403, 'Task not found or not assigned to you');
        // }
        //
        // await prisma.task.update({
        //   where: { id: taskId },
        //   data: {
        //     metadata: {
        //       ...(task.metadata as any),
        //       actualMinutesSoFar,
        //       lastUpdate: new Date().toISOString(),
        //       progressNotes: notes,
        //     },
        //   },
        // });
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
        // TODO: Implement with Prisma
        console.log("Completing task:", {
            taskId,
            workerId,
            actualMinutes,
            qualityOk,
            notes,
        });

        // TaskStatus.DONE will be used here when integrated with Prisma
        void TaskStatus.DONE;

        // In production:
        // const task = await prisma.task.findUnique({
        //   where: { id: taskId },
        //   include: { request: true },
        // });
        //
        // if (!task || task.assignedToId !== workerId) {
        //   throw new AppError(403, 'Task not found or not assigned to you');
        // }
        //
        // await prisma.$transaction(async (tx) => {
        //   // Update task
        //   await tx.task.update({
        //     where: { id: taskId },
        //     data: {
        //       status: TaskStatus.DONE,
        //       completedAt: new Date(),
        //       metadata: {
        //         actualMinutes,
        //         qualityOk,
        //         completionNotes: notes,
        //       },
        //     },
        //   });
        //
        //   // Update request status if all tasks are done
        //   const allTasks = await tx.task.findMany({
        //     where: { requestId: task.requestId },
        //   });
        //
        //   const allDone = allTasks.every(t =>
        //     t.id === taskId ? true : t.status === TaskStatus.DONE
        //   );
        //
        //   if (allDone) {
        //     await tx.request.update({
        //       where: { id: task.requestId },
        //       data: { status: RequestStatus.DONE },
        //     });
        //   }
        //
        //   // Trigger agent follow-up
        //   await agentService.enqueueJob({
        //     type: 'task_completed',
        //     requestId: task.requestId,
        //     payload: { taskId, qualityOk },
        //   });
        // });
    }

    /**
     * Set worker availability
     */
    async setAvailability(workerId: string, shifts: any[]): Promise<void> {
        // TODO: Implement availability tracking
        console.log("Setting worker availability:", { workerId, shifts });

        // In production, might use a separate WorkerAvailability model:
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
}

export const taskService = new TaskService();
