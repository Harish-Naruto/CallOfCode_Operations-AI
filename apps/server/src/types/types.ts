// ============================================================
// ENUMS (matching Prisma schema)
// ============================================================

export enum UserRole {
    OWNER = "OWNER",
    WORKER = "WORKER",
    CUSTOMER = "CUSTOMER",
}

export enum RequestStatus {
    NEW = "NEW",
    IN_PROGRESS = "IN_PROGRESS",
    BLOCKED = "BLOCKED",
    DONE = "DONE",
    CANCELLED = "CANCELLED",
}

export enum TaskStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    BLOCKED = "BLOCKED",
    DONE = "DONE",
}

export enum AuditActor {
    AGENT = "AGENT",
    OWNER = "OWNER",
    WORKER = "WORKER",
    CUSTOMER = "CUSTOMER",
    WEBHOOK = "WEBHOOK",
}

// ============================================================
// NORMALIZED REQUEST PAYLOAD (Clothes Business)
// ============================================================

export type AlterationType =
    | "sleeve_shortening"
    | "sleeve_lengthening"
    | "waist_adjustment"
    | "hem_adjustment"
    | "general_alteration";

export type RequestType = "alteration" | "order" | "stitching";

export type UserProfile = {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
};


export interface RequestItem {
    sku: string;
    qty: number;
    size?: string;
    color?: string;
    fabric?: string;
    alteration_type?: AlterationType;
    measurement?: Record<string, number>;
}

export interface PreferredSlot {
    start: string; // ISO 8601
    end: string; // ISO 8601
}

export interface NormalizedRequestPayload {
    type: RequestType;
    items: RequestItem[];
    required_skills: string[];
    estimated_minutes: number;
    preferred_slot?: PreferredSlot;
    notes?: string;
}

// ============================================================
// API REQUEST/RESPONSE TYPES
// ============================================================

// Customer Interfaces
export interface WhatsAppWebhookRequest {
    message_id: string;
    from: string;
    text: string;
}

export interface CreateRequestRequest {
    payload: NormalizedRequestPayload;
    customerId?: string;
}

export interface CreateRequestResponse {
    requestId: string;
}

export interface RequestStatusResponse {
    requestId: string;
    status: RequestStatus;
    eta?: string;
    assigned_worker?: {
        id: string;
        name: string;
    };
}

// Worker Interfaces
export interface AssignedTaskResponse {
    taskId: string;
    requestId: string;
    title: string;
    estimated_minutes: number;
    status: TaskStatus;
}

export interface UpdateTaskProgressRequest {
    actual_minutes_so_far: number;
    notes?: string;
}

export interface CompleteTaskRequest {
    actual_minutes: number;
    quality_ok: boolean;
    notes?: string;
}

export interface WorkerShift {
    start: string; // ISO 8601
    end: string; // ISO 8601
}

export interface SetAvailabilityRequest {
    shifts: WorkerShift[];
}

// Owner Interfaces
export interface ForceAssignRequest {
    workerId: string;
    reason: string;
}

export interface WorkerSummary {
    id: string;
    name: string;
    email: string;
    role: "WORKER";
    skills: string[];
    status: "IDLE" | "BUSY" | "OFFLINE";
    activeTaskCount: number;
}

export interface UnassignedTask {
    id: string;
    requestId: string;
    title: string;
    priority: number;
    requiredSkills: string[];
    createdAt: string;
    reason?: string; // Why it's unassigned/escalated
}

export interface DecisionRulesConfig {
    weights: {
        inventory: number;
        staff: number;
        dependency: number;
    };
    thresholds: {
        promise: number;
    };
}

export interface RequestDetailResponse {
    request: any; // Full request object
    tasks: any[]; // Associated tasks
    auditActions: any[]; // Audit trail
    decisionBreakdown?: any; // Agent decision context
}

// Inventory Interfaces
export interface UpdateInventoryRequest {
    sku: string;
    delta: number;
    source: string;
}

export interface SupplierWebhookRequest {
    orderRef: string;
    eta: string; // ISO 8601
}

// Agent Interfaces
export interface SimulateAgentRequest {
    snapshot: any; // Current state snapshot
}

// ============================================================
// EXPRESS REQUEST EXTENSIONS
// ============================================================

export interface AuthenticatedUser {
    id: string;
    role: UserRole;
    name: string;
    email: string;
    phone?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

// ============================================================
// COMMON RESPONSE TYPES
// ============================================================

export interface SuccessResponse {
    success: boolean;
    message?: string;
}

export interface ErrorResponse {
    error: string;
    message: string;
    details?: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
