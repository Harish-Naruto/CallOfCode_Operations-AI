import apiClient from "./client";
import type {
    CreateCustomerRequest,
    CustomerRequest,
    RequestStatus,
} from "@/lib/types/customer";

export const customerService = {
    /**
     * Create a new customer request
     * POST /api/requests
     */
    async createRequest(request: CreateCustomerRequest): Promise<CustomerRequest> {
        const response = await apiClient.post("/api/requests", request);
        return response.data;
    },

    /**
     * Get detailed status of a specific request
     * GET /api/requests/:requestId/status
     */
    async getRequestStatus(requestId: string): Promise<RequestStatus> {
        const response = await apiClient.get(`/api/requests/${requestId}/status`);
        return response.data;
    },
};
