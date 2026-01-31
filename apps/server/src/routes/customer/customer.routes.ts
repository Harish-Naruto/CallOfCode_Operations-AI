import { Router, type IRouter } from "express";
import { customerController } from "../../controllers/customer.controller";
import { validate } from "../../middleware/validation.middleware";
import { createRequestSchema } from "../../middleware/validation.middleware";
import { optionalAuthenticate } from "../../middleware/auth.middleware";

const router: IRouter = Router();

/**
 * @route   POST /api/webhooks/whatsapp
 * @desc    Handle WhatsApp webhook
 * @access  Public (webhook)
 */
router.post(
    "/webhooks/whatsapp",
    (req, res, next) =>
        customerController.handleWhatsAppWebhook(req, res).catch(next),
);

/**
 * @route   POST /api/requests
 * @desc    Create new request from web
 * @access  Public (optional auth)
 */
router.post(
    "/requests",
    optionalAuthenticate,
    validate(createRequestSchema),
    (req, res, next) => customerController.createRequest(req, res).catch(next),
);

/**
 * @route   GET /api/requests/:requestId/status
 * @desc    Get request status
 * @access  Public (optional auth)
 */
router.get(
    "/requests/:requestId/status",
    optionalAuthenticate,
    (req, res, next) => customerController.getRequestStatus(req, res).catch(next),
);

export default router;
