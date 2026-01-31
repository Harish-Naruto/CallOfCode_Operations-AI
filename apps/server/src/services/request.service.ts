import type { NormalizedRequestPayload } from "../types/types";
import { RequestStatus } from "../types/types";

/**
 * Request Service - Business logic for request management
 * TODO: Integrate with Prisma client from @Hackron/db
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
        // TODO: Replace with actual Prisma client
        const requestId = `req_${Date.now()}`;

        console.log("Creating request:", {
            requestId,
            customerId,
            source,
            status: RequestStatus.NEW,
            payload,
        });

        // In production:
        // const request = await prisma.request.create({
        //   data: {
        //     customerId,
        //     source,
        //     status: RequestStatus.NEW,
        //     payload,
        //     payloadRaw: payload,
        //     priority: 0,
        //   },
        // });
        //
        // // Trigger AgentFlow
        // await agentService.enqueueJob({
        //   type: 'handle_request',
        //   requestId: request.id,
        // });

        return requestId;
    }

    /**
     * Get request status with worker info
     */
    async getRequestStatus(requestId: string): Promise<any> {
        // TODO: Replace with actual Prisma query
        console.log("Fetching request status:", requestId);

        // In production:
        // const request = await prisma.request.findUnique({
        //   where: { id: requestId },
        //   include: {
        //     tasks: {
        //       include: {
        //         assignedTo: true,
        //       },
        //     },
        //   },
        // });
        //
        // if (!request) {
        //   throw new AppError(404, 'Request not found');
        // }
        //
        // const assignedTask = request.tasks.find(t => t.assignedTo);
        //
        // return {
        //   requestId: request.id,
        //   status: request.status,
        //   eta: request.dueBy,
        //   assigned_worker: assignedTask?.assignedTo ? {
        //     id: assignedTask.assignedTo.id,
        //     name: assignedTask.assignedTo.name,
        //   } : undefined,
        // };

        return {
            requestId,
            status: RequestStatus.NEW,
            eta: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        };
    }

    /**
     * Get request detail with full audit trail
     */
    async getRequestDetail(requestId: string): Promise<any> {
        // TODO: Replace with actual Prisma query
        console.log("Fetching request detail:", requestId);

        // In production:
        // const request = await prisma.request.findUnique({
        //   where: { id: requestId },
        //   include: {
        //     customer: true,
        //     tasks: {
        //       include: {
        //         assignedTo: true,
        //       },
        //     },
        //     auditLogs: {
        //       orderBy: { createdAt: 'desc' },
        //     },
        //   },
        // });
        //
        // if (!request) {
        //   throw new AppError(404, 'Request not found');
        // }

        return {
            request: { id: requestId },
            tasks: [],
            auditActions: [],
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

        // TODO: Replace with actual Prisma query
        console.log("Listing requests:", { filters, skip, limit });

        // In production:
        // const where: any = {};
        // if (filters.status) {
        //   where.status = filters.status;
        // }
        //
        // const [requests, total] = await Promise.all([
        //   prisma.request.findMany({
        //     where,
        //     skip,
        //     take: limit,
        //     include: {
        //       customer: true,
        //       tasks: true,
        //     },
        //     orderBy: { createdAt: 'desc' },
        //   }),
        //   prisma.request.count({ where }),
        // ]);

        return {
            data: [],
            pagination: {
                total: 0,
                page,
                limit,
                totalPages: 0,
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
        // TODO: Implement with Prisma
        console.log("Force assigning:", { requestId, workerId, reason, ownerId });

        // In production:
        // await prisma.$transaction(async (tx) => {
        //   // Create or update task
        //   const task = await tx.task.findFirst({
        //     where: { requestId },
        //   });
        //
        //   if (task) {
        //     await tx.task.update({
        //       where: { id: task.id },
        //       data: {
        //         assignedToId: workerId,
        //         status: TaskStatus.ASSIGNED,
        //       },
        //     });
        //   }
        //
        //   // Create audit log
        //   await tx.auditAction.create({
        //     data: {
        //       requestId,
        //       actor: AuditActor.OWNER,
        //       action: 'force_assign',
        //       context: { workerId, ownerId },
        //       reason,
        //     },
        //   });
        // });
    }
}

export const requestService = new RequestService();
