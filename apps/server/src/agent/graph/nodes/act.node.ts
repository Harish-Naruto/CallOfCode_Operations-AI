import prisma from "@Hackron/db";
import type { OpsState } from "../../prompts/state";
import { taskService } from "../../../services/task.service";

/**
 * Act Node (Execution Agent)
 * Purpose: Change the real world
 * - Creates tasks in database
 * - Updates request status
 * - Writes audit logs
 * - Handles different decision actions
 * 
 * Rule: Execution contains no reasoning. Must be idempotent and retry-safe.
 */
export async function actNode(state: OpsState): Promise<Partial<OpsState>> {
  console.log(`[ACT] Executing action: ${state.decision?.action}`);

  if (!state.request || !state.decision) {
    console.warn("[ACT] No request or decision to act on");
    return {};
  }

  // Handle Simulation Mode
  if (state.isSimulation) {
    console.log(`[ACT] Simulation mode: Skipping DB writes for ${state.decision.action}`);
    if (state.decision.action === "ACCEPT_AND_PLAN" && state.plannedTasks) {
      console.log(`[ACT] Would create ${state.plannedTasks.length} tasks`);
    }
    return {
      request: { ...state.request, status: "IN_PROGRESS" } as any // optimistic update for response node
    };
  }

  try {
    switch (state.decision.action) {
      case "ACCEPT_AND_PLAN":
        await handleAcceptAndPlan(state);
        break;
      case "DELAY_REQUEST":
        await handleDelayRequest(state);
        break;
      case "ESCALATE_TO_OWNER":
        await handleEscalateToOwner(state);
        break;
      default:
        console.warn(`[ACT] Unknown action: ${state.decision.action}`);
    }

    // Log audit action
    await prisma.auditAction.create({
      data: {
        requestId: state.request.id,
        actor: "AGENT",
        action: state.decision.action.toLowerCase(),
        context: JSON.parse(JSON.stringify({
          decision: state.decision,
          plannedTasksCount: state.plannedTasks?.length ?? 0,
          inventoryCheck: state.inventoryCheck,
          staffLoadSnapshot: state.staffLoad.slice(0, 5),
        })),
        reason: state.decision.reason,
      },
    });

    console.log("[ACT] Action executed and audit logged");
    return {};

  } catch (error) {
    console.error("[ACT] Error:", error);
    return {
      error: `Act error: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Handle ACCEPT_AND_PLAN: Create tasks and update status
 */
async function handleAcceptAndPlan(state: OpsState): Promise<void> {
  if (!state.plannedTasks || state.plannedTasks.length === 0) {
    console.warn("[ACT] No planned tasks to create");
    return;
  }

  // Create tasks using task service (better separation of concerns)
  await taskService.createTasksFromAgent(state.request!.id, state.plannedTasks);

  // Update request status
  await prisma.request.update({
    where: { id: state.request!.id },
    data: { status: "IN_PROGRESS" },
  });

  console.log(`[ACT] Created ${state.plannedTasks.length} tasks and updated request status`);
}

/**
 * Handle DELAY_REQUEST: Update request with delay info
 */
async function handleDelayRequest(state: OpsState): Promise<void> {
  await prisma.request.update({
    where: { id: state.request!.id },
    data: {
      status: "BLOCKED",
      // Store delay info in payload
      payload: {
        ...(state.request!.payload as object),
        _delayed: true,
        _delayReason: state.decision!.reason,
        _delayUntil: state.decision!.delayUntil,
      },
    },
  });

  console.log("[ACT] Request delayed");
}

/**
 * Handle ESCALATE_TO_OWNER: Mark for owner review
 */
async function handleEscalateToOwner(state: OpsState): Promise<void> {
  await prisma.request.update({
    where: { id: state.request!.id },
    data: {
      status: "BLOCKED",
      priority: state.decision!.escalationPriority === "high" ? 10 :
        state.decision!.escalationPriority === "medium" ? 5 : 1,
      payload: {
        ...(state.request!.payload as object),
        _escalated: true,
        _escalationReason: state.decision!.reason,
        _escalationPriority: state.decision!.escalationPriority,
      },
    },
  });

  console.log("[ACT] Request escalated to owner");
}
