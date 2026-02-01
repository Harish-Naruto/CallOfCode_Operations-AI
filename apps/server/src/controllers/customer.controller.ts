import type { Request, Response } from "express";
import { whatsappService } from "../services/whatsapp.service";
import { requestService } from "../services/request.service";
import type {
    WhatsAppWebhookRequest,
    CreateRequestRequest,
    CreateRequestResponse,
    RequestStatusResponse,
} from "../types/types";

/**
 * Customer Controller - Handles customer-facing endpoints
 */

export class CustomerController {
    /**
     * POST /api/webhooks/whatsapp
     * Handle incoming WhatsApp webhook
     */
    async handleWhatsAppWebhook(req: Request, res: Response): Promise<void> {
        const { message_id, from, text } = req.body as WhatsAppWebhookRequest;

        // Parse message to normalized payload
        const payload = whatsappService.parseMessage(text);

        // Create request with WhatsApp source
        const requestId = await requestService.createRequest(
            payload,
            undefined, // customerId can be looked up by phone number
            "whatsapp",
        );

        console.log("WhatsApp message processed:", {
            message_id,
            from,
            requestId,
        });

        // Return 200 OK immediately (webhook requirement)
        res.status(200).json({ success: true });
    }

    /**
     * POST /api/requests
     * Create a new request from web
     */
    async createRequest(req: Request, res: Response): Promise<void> {
        var { payload, customerId } = req.body as CreateRequestRequest;

        if (customerId === "" || customerId == undefined) {
            customerId = req.user?.id
        }
        const requestId = await requestService.createRequest(
            payload,
            customerId || req.user?.id,
            "web",
        );

        const response: CreateRequestResponse = {
            requestId,
        };

        res.status(201).json(response);
    }

    /**
     * GET /api/requests/:requestId/status
     * Get request status
     */
    async getRequestStatus(req: Request, res: Response): Promise<void> {
        const requestId = req.params.requestId as string;

        const status = await requestService.getRequestStatus(requestId);

        const response: RequestStatusResponse = status;

        res.status(200).json(response);
    }
    /**
     * GET /api/requests
     * Get all requests for current customer
     */
    async getRequests(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const requests = await requestService.getRequestsForUser(userId);
        res.status(200).json(requests);
    }

    /**
    * GET /api/requests/:requestId
    * Get full request details
    */
    async getRequestDetail(req: Request, res: Response): Promise<void> {
        const requestId = req.params.requestId as string;
        // Ideally should check if this request belongs to the user
        const detail = await requestService.getRequestDetail(requestId);
        res.status(200).json(detail);
    }
}

export const customerController = new CustomerController();
