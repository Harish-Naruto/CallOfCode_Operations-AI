import prisma from "@Hackron/db";
import type { NormalizedRequestPayload } from "../types/types";
import { RequestStatus } from "../types/types";
import { invokeAgent } from "../agent";
import { AppError } from "../middleware/error.middleware";

/**
 * Request Service - Business logic for request management
 */

export class RequestService {
    /**
     * Create a new request
     */
    async createRequest(
        payload: NormalizedRequestPayload,
        customerId?: string,
        source: string = "web",
    ): Promise<string> {

        console.log("[CreateRequest] Received customerId:", customerId);

        // If customerId is provided and looks like a userId (from JWT), lookup the actual Customer record
        let actualCustomerId: string | null = null;

        if (customerId) {
            // Try to find Customer by userId (in case we received User.id instead of Customer.id)
            const customer = await prisma.customer.findUnique({
                where: { userId: customerId },
            });

            console.log("[CreateRequest] Customer lookup by userId:", customer?.id || "NOT FOUND");

            if (customer) {
                actualCustomerId = customer.id;
            } else {
                // Check if it's already a Customer.id
                const directCustomer = await prisma.customer.findUnique({
                    where: { id: customerId },
                });
                console.log("[CreateRequest] Customer lookup by id:", directCustomer?.id || "NOT FOUND");
                if (directCustomer) {
                    actualCustomerId = directCustomer.id;
                }
            }
        }

        console.log("[CreateRequest] Final actualCustomerId:", actualCustomerId);

        const request = await prisma.request.create({
            data: {
                customerId: actualCustomerId, // Use looked-up Customer.id or null
                source,
                status: RequestStatus.NEW,
                payload: payload as any, // Prisma json type handling
                payloadRaw: payload as any,
                priority: 0,
            },
        });

        // Trigger AgentFlow (fire and forget)
        invokeAgent(request.id).catch(err =>
            console.error(`[RequestService] Agent trigger failed for ${request.id}:`, err)
        );

        return request.id;
    }

    /**
     * Get request status with worker info
     */
    async getRequestStatus(requestId: string): Promise<any> {
        const request = await prisma.request.findUnique({
            where: { id: requestId },
            include: {
                tasks: {
                    include: {
                        worker: true,
                    },
                },
            },
        });

        if (!request) {
            throw new AppError(404, 'Request not found');
        }

        const assignedTask = request.tasks.find(t => t.worker);
        // Estimate ETA based on tasks or default (2h)
        const eta = request.dueBy ? request.dueBy.toISOString() : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

        return {
            requestId: request.id,
            status: request.status,
            eta,
            assigned_worker: assignedTask?.worker ? {
                id: assignedTask.worker.id,
                name: assignedTask.worker.name,
            } : undefined,
        };
    }

    /**
     * Get request detail with full audit trail
     */
    async getRequestDetail(requestId: string): Promise<any> {
        const request = await prisma.request.findUnique({
            where: { id: requestId },
            include: {
                customer: true,
                tasks: {
                    include: {
                        worker: true,
                    },
                },
                auditLogs: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!request) {
            throw new AppError(404, 'Request not found');
        }

        return {
            request: {
                ...request,
                customer: request.customer
            },
            tasks: request.tasks,
            auditActions: request.auditLogs,
        };
    }

    /**
     * List requests with filters
     */
    async listRequests(filters: {
        status?: RequestStatus;
        page?: number;
        limit?: number;
    }): Promise<any> {
        const page = filters.page || 1;
        const limit = filters.limit || 20;
        const skip = (page - 1) * limit;

        const where: any = {};
        if (filters.status) {
            where.status = filters.status;
        }

        const [requests, total] = await Promise.all([
            prisma.request.findMany({
                where,
                skip,
                take: limit,
                include: {
                    customer: true,
                    tasks: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.request.count({ where }),
        ]);

        return {
            data: requests,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Force assign request to specific worker
     */
    async forceAssign(
        requestId: string,
        workerId: string,
        reason: string,
        ownerId: string,
    ): Promise<void> {

        await prisma.$transaction(async (tx) => {
            // Find first active task for this request
            const task = await tx.task.findFirst({
                where: {
                    requestId,
                    status: { in: ["PENDING", "ASSIGNED"] }
                },
            });

            if (task) {
                await tx.task.update({
                    where: { id: task.id },
                    data: {
                        workerId: workerId,
                        status: "ASSIGNED",
                    },
                });
            }

            // Create audit log
            await tx.auditAction.create({
                data: {
                    requestId,
                    actor: "OWNER", // AuditActor.OWNER
                    action: 'force_assign',
                    context: { workerId, ownerId } as any,
                    reason,
                },
            });
        });
    }
}

export const requestService = new RequestService();
