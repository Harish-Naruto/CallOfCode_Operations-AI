import type { Request, Response } from "express";
import { requestService } from "../services/request.service";
import { auditService } from "../services/audit.service";
import type {
    RequestDetailResponse,
    ForceAssignRequest,
    DecisionRulesConfig,
    SuccessResponse,
    UnassignedTask,
} from "../types/types";
import { RequestStatus, AuditActor, TaskStatus } from "../types/types";
import { workerService } from "../services/worker.service";
import prisma from "@Hackron/db";

/**
 * Owner Controller - Handles owner dashboard endpoints
 */

export class OwnerController {
    /**
     * GET /api/owner/requests?status=in_progress
     * List requests with filters
     */
    async listRequests(req: Request, res: Response): Promise<void> {
        const { status, page, limit } = req.query;

        const filters = {
            status: status as RequestStatus | undefined,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 20,
        };

        const result = await requestService.listRequests(filters);

        res.status(200).json(result);
    }

    /**
     * GET /api/owner/requests/:requestId
     * Get request detail with full audit trail
     */
    async getRequestDetail(req: Request, res: Response): Promise<void> {
        const requestId = req.params.requestId as string;

        const detail = await requestService.getRequestDetail(requestId);

        const response: RequestDetailResponse = detail;

        res.status(200).json(response);
    }

    /**
     * POST /api/owner/requests/:requestId/force-assign
     * Force assign request to worker (manual override)
     */
    async forceAssign(req: Request, res: Response): Promise<void> {
        const requestId = req.params.requestId as string;
        const { workerId, reason } = req.body as ForceAssignRequest;
        const ownerId = req.user!.id;

        await requestService.forceAssign(requestId, workerId, reason, ownerId);

        const response: SuccessResponse = {
            success: true,
        };

        res.status(200).json(response);
    }

    /**
     * POST /api/owner/tasks/:taskId/assign
     * Force assign specific task to worker
     */
    async assignTask(req: Request, res: Response): Promise<void> {
        const taskId = req.params.taskId as string;
        const { workerId, reason } = req.body as ForceAssignRequest;
        const ownerId = req.user!.id;

        // Use prisma directly for task-level update
        await prisma.$transaction(async (tx) => {
            await tx.task.update({
                where: { id: taskId },
                data: {
                    workerId: workerId,
                    status: TaskStatus.ASSIGNED,
                },
            });

            // Get task to find requestId for audit
            const task = await tx.task.findUnique({
                where: { id: taskId },
                select: { requestId: true }
            });

            if (task) {
                await tx.auditAction.create({
                    data: {
                        requestId: task.requestId,
                        actor: AuditActor.OWNER,
                        action: 'force_assign_task',
                        context: { taskId, workerId, ownerId } as any,
                        reason,
                    },
                });
            }
        });

        const response: SuccessResponse = {
            success: true,
        };

        res.status(200).json(response);
    }

    /**
     * PUT /api/owner/config/decision-rules
     * Update decision rule configuration
     */
    async updateDecisionRules(req: Request, res: Response): Promise<void> {
        const config = req.body as DecisionRulesConfig;

        // TODO: Save to database
        console.log("Updating decision rules:", config);

        // In production:
        // await prisma.systemConfig.upsert({
        //   where: { key: 'decision_rules' },
        //   create: {
        //     key: 'decision_rules',
        //     value: config,
        //   },
        //   update: {
        //     value: config,
        //   },
        // });

        // Create audit log
        await auditService.createAuditAction({
            actor: AuditActor.OWNER,
            action: "update_decision_rules",
            context: config,
            reason: "Configuration update by owner",
        });

        const response: SuccessResponse = {
            success: true,
        };

        res.status(200).json(response);
    }

    /**
     * GET /api/owner/audit?requestId=req_123
     * Query audit logs
     */
    async getAuditLogs(req: Request, res: Response): Promise<void> {
        const { requestId, actor, action, startDate, endDate, page, limit } =
            req.query;

        const filters = {
            requestId: requestId as string | undefined,
            actor: actor as AuditActor | undefined,
            action: action as string | undefined,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 50,
        };

        const result = await auditService.queryAuditLogs(filters);

        res.status(200).json(result);
    }

    /**
     * GET /api/owner/workers
     * List all workers with their status and load
     */
    async listWorkers(_req: Request, res: Response): Promise<void> {
        const workers = await workerService.listWorkersWithStatus();
        res.status(200).json(workers);
    }

    /**
     * GET /api/owner/tasks/unassigned
     * Get tasks that are unassigned or escalated
     */
    async getUnassignedTasks(_req: Request, res: Response): Promise<void> {
        // Fetch tasks that are PENDING (no worker) OR BLOCKED (needs intervention)
        const tasks = await prisma.task.findMany({
            where: {
                OR: [
                    { status: TaskStatus.PENDING, workerId: null },
                    { status: TaskStatus.BLOCKED }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const response: UnassignedTask[] = tasks.map(t => ({
            id: t.id,
            requestId: t.requestId,
            title: t.title,
            priority: 1,
            requiredSkills: t.requiredSkills,
            createdAt: t.createdAt.toISOString(),
            reason: t.status === TaskStatus.BLOCKED
                ? "Task Blocked - Manual Intervention Required"
                : "Agent could not find suitable worker"
        }));

        res.status(200).json(response);
    }
}

export const ownerController = new OwnerController();
