import { Router, type IRouter } from "express";
import { agentController } from "../../controllers/internal/agent.controller";
import { agentGuard } from "../../middleware/agent-guard.middleware";

const router: IRouter = Router();

// All internal routes require agent guard (API key or localhost in dev)
router.use(agentGuard);

/**
 * @route   POST /internal/agent/re-evaluate/:requestId
 * @desc    Trigger LangGraph re-evaluation for a request
 * @access  Internal (API Key)
 */
router.post("/re-evaluate/:requestId", (req, res, next) =>
    agentController.reEvaluateRequest(req, res).catch(next),
);

/**
 * @route   POST /internal/agent/simulate
 * @desc    Simulate agent decision without side effects
 * @access  Internal (API Key)
 */
router.post("/simulate", (req, res, next) =>
    agentController.simulateDecision(req, res).catch(next),
);

export default router;
