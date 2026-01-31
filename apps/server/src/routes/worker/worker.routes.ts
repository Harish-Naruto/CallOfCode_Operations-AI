import { Router, type IRouter } from "express";
import { workerController } from "../../controllers/worker.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/authorization.middleware";
import {
    validate,
    updateTaskProgressSchema,
    completeTaskSchema,
    setAvailabilitySchema,
} from "../../middleware/validation.middleware";
import { UserRole } from "../../types/types";

const router: IRouter = Router();

// All worker routes require authentication
router.use(authenticate);
router.use(requireRole([UserRole.WORKER, UserRole.OWNER]));

/**
 * @route   GET /api/tasks
 * @desc    Get assigned tasks
 * @access  Worker, Owner
 */
router.get("/tasks", (req, res, next) =>
    workerController.getAssignedTasks(req, res).catch(next),
);

/**
 * @route   POST /api/tasks/:taskId/accept
 * @desc    Accept task
 * @access  Worker, Owner
 */
router.post("/tasks/:taskId/accept", (req, res, next) =>
    workerController.acceptTask(req, res).catch(next),
);

/**
 * @route   POST /api/tasks/:taskId/update
 * @desc    Update task progress
 * @access  Worker, Owner
 */
router.post(
    "/tasks/:taskId/update",
    validate(updateTaskProgressSchema),
    (req, res, next) => workerController.updateTaskProgress(req, res).catch(next),
);

/**
 * @route   POST /api/tasks/:taskId/complete
 * @desc    Complete task
 * @access  Worker, Owner
 */
router.post(
    "/tasks/:taskId/complete",
    validate(completeTaskSchema),
    (req, res, next) => workerController.completeTask(req, res).catch(next),
);

/**
 * @route   POST /api/workers/:workerId/availability
 * @desc    Set worker availability
 * @access  Worker, Owner
 */
router.post(
    "/workers/:workerId/availability",
    validate(setAvailabilitySchema),
    (req, res, next) => workerController.setAvailability(req, res).catch(next),
);

export default router;
