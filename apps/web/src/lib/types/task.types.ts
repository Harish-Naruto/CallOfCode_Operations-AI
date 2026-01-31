/**
 * Task Type Definitions for Worker Dashboard
 */

export enum TaskStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    BLOCKED = "BLOCKED",
    DONE = "DONE",
}

export interface Task {
    id: string;
    requestId: string;
    title: string;
    description?: string;
    requiredSkills: string[];
    estimatedMin: number;
    status: TaskStatus;
    workerId?: string;
    createdAt: string;
    startedAt?: string;
    completedAt?: string;
    metadata?: TaskMetadata;
    request?: {
        id: string;
        status: string;
        customerId?: string;
    };
}

export interface TaskMetadata {
    actualMinutesSoFar?: number;
    lastUpdate?: string;
    progressNotes?: string;
    actualMinutes?: number;
    completionNotes?: string;
    qualityCheck?: boolean;
}

export interface AssignedTaskResponse {
    taskId: string;
    requestId: string;
    title: string;
    estimated_minutes: number;
    status: TaskStatus;
}

export interface UpdateTaskProgressInput {
    actual_minutes_so_far: number;
    notes?: string;
}

export interface CompleteTaskInput {
    actual_minutes: number;
    quality_ok: boolean;
    notes?: string;
}

export interface WorkerShift {
    start: string; // ISO 8601
    end: string; // ISO 8601
}

export interface SetAvailabilityInput {
    shifts: WorkerShift[];
}

export interface TaskActionResponse {
    success: boolean;
    message?: string;
}
