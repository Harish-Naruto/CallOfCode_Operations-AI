import { Router, type IRouter } from "express";
import { ownerController } from "../../controllers/owner.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import {
    validate,
    forceAssignSchema,
    decisionRulesSchema,
} from "../../middleware/validation.middleware";
import { UserRole } from "../../types/types";

const router: IRouter = Router();

// All owner routes require OWNER role
router.use(authenticate);
router.use(requireRole([UserRole.OWNER]));

/**
 * @route   GET /api/owner/requests
 * @desc    List all requests with filters
 * @access  Owner
 */
router.get("/requests", (req, res, next) =>
    ownerController.listRequests(req, res).catch(next),
);

/**
 * @route   GET /api/owner/requests/:requestId
 * @desc    Get request detail with audit trail
 * @access  Owner
 */
router.get("/requests/:requestId", (req, res, next) =>
    ownerController.getRequestDetail(req, res).catch(next),
);

/**
 * @route   POST /api/owner/requests/:requestId/force-assign
 * @desc    Force assign worker to request
 * @access  Owner
 */
router.post(
    "/requests/:requestId/force-assign",
    validate(forceAssignSchema),
    (req, res, next) => ownerController.forceAssign(req, res).catch(next),
);

/**
 * @route   PUT /api/owner/config/decision-rules
 * @desc    Update decision rules
 * @access  Owner
 */
router.put(
    "/config/decision-rules",
    validate(decisionRulesSchema),
    (req, res, next) => ownerController.updateDecisionRules(req, res).catch(next),
);

/**
 * @route   GET /api/owner/audit
 * @desc    Query audit logs
 * @access  Owner
 */
router.get("/audit", (req, res, next) =>
    ownerController.getAuditLogs(req, res).catch(next),
);

export default router;
