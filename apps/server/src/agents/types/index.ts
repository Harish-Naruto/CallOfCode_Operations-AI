/**
 * LangGraph AI Agent Type Definitions
 * Defines types for LangGraph-based agent workflows
 */

/**
 * Agent State
 * Represents the state of the agent workflow
 */
export interface AgentState {
  requestId?: string;
  taskId?: string;
  userId?: string;
  context: Record<string, unknown>;
  decision?: AgentDecision;
  reasoning: string[];
  actions: AgentAction[];
  errors: string[];
}

/**
 * Agent Decision
 * Represents a decision made by the agent
 */
export interface AgentDecision {
  type: "assign_task" | "check_inventory" | "escalate" | "complete";
  confidence: number;
  reasoning: string;
  metadata?: Record<string, unknown>;
}

/**
 * Agent Action
 * Represents an action to be executed
 */
export interface AgentAction {
  type: string;
  payload: Record<string, unknown>;
  timestamp: Date;
  status: "pending" | "completed" | "failed";
}

/**
 * Node Result
 * Result from a LangGraph node execution
 */
export interface NodeResult {
  state: Partial<AgentState>;
  nextNode?: string;
}
