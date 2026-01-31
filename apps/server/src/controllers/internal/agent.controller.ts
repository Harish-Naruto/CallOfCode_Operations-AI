import type { Request, Response } from "express";
import type {
    SuccessResponse,
} from "../../types/types";

/**
 * Agent Controller - Handles internal agent communication
 * These endpoints are only accessible via internal API key
 * 
 * NOTE: Using LangGraph for agent workflow orchestration
 */

export class AgentController {
    /**
     * POST /internal/agent/re-evaluate/:requestId
     * Trigger re-evaluation of a request
     * This will invoke the LangGraph workflow for the specified request
     */
    async reEvaluateRequest(req: Request, res: Response): Promise<void> {
        const { requestId } = req.params;

        // TODO: Trigger LangGraph workflow re-evaluation
        console.log("Re-evaluating request via LangGraph:", requestId);

        // In production:
        // await langGraphClient.invoke('re_evaluate_request', {
        //   requestId,
        // });

        const response: SuccessResponse = {
            success: true,
            message: "Re-evaluation triggered",
        };

        res.status(200).json(response);
    }

    /**
     * POST /internal/agent/simulate
     * Simulate agent decision without side effects
     * Useful for testing agent logic without making actual database changes
     */
    async simulateDecision(_req: Request, res: Response): Promise<void> {
        // Snapshot will be used when agent logic is implemented
        // const { snapshot } = req.body as SimulateAgentRequest;

        // TODO: Run LangGraph simulation without DB writes
        console.log("Simulating agent decision via LangGraph");

        // In production:
        // const decision = await langGraphClient.simulate(snapshot);
        //
        // return {
        //   decision,
        //   reasoning: decision.reasoning,
        //   actions: decision.actions,
        //   scores: decision.scores,
        // };

        const simulatedResponse = {
            decision: "assign_task",
            reasoning: "Simulated decision based on snapshot",
            actions: [],
            scores: {},
        };

        res.status(200).json(simulatedResponse);
    }
}

export const agentController = new AgentController();
