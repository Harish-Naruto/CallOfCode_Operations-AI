import prisma from "@Hackron/db";
import { UserRole, TaskStatus } from "../types/types";
import type { WorkerSummary } from "../types/types";

/**
 * Worker Service - Manage worker data for owners
 */
export class WorkerService {
    /**
     * List all workers with their current status and load
     */
    async listWorkersWithStatus(): Promise<WorkerSummary[]> {
        // 1. Fetch all users with WORKER role
        const workers = await prisma.user.findMany({
            where: {
                role: UserRole.WORKER,
                isActive: true,
            },
            include: {
                tasks: {
                    where: {
                        status: {
                            in: [TaskStatus.ASSIGNED, TaskStatus.IN_PROGRESS],
                        },
                    },
                },
            },
        });

        // 2. Map to summary DTO
        return workers.map((worker) => {
            const activeTaskCount = worker.tasks.length;

            // Simple status logic: IF > 0 active tasks THEN BUSY ELSE IDLE
            // In a real app, we might check last activity time for OFFLINE
            const status = activeTaskCount > 0 ? "BUSY" : "IDLE";

            return {
                id: worker.id,
                name: worker.name,
                email: worker.email,
                role: "WORKER",
                skills: worker.skills,
                status: status,
                activeTaskCount: activeTaskCount,
            };
        });
    }
}

export const workerService = new WorkerService();
