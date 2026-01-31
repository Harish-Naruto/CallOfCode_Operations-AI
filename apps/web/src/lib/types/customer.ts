export enum CustomerRequestPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
}

export enum CustomerRequestStatus {
    PENDING = "PENDING",
    ASSIGNED = "ASSIGNED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface CreateCustomerRequest {
    payload: {
        type: "alteration" | "order" | "stitching";
        items: Array<{
            sku: string;
            qty: number;
            size?: string;
            color?: string;
            fabric?: string;
            alteration_type?: string;
            measurement?: Record<string, number>;
        }>;
        required_skills: string[];
        estimated_minutes: number;
        preferred_slot?: {
            start: string;
            end: string;
        };
        notes?: string;
    };
    customerId?: string;
}

export interface CustomerRequest {
    id: string;
    requestId?: string; // For newly created requests
    customerId: string;
    status: CustomerRequestStatus;
    payload: any;
    createdAt: string;
    updatedAt: string;
}

export interface RequestStatusUpdate {
    status: CustomerRequestStatus;
    message?: string;
    updatedAt: string;
    updatedBy?: string;
}

export interface RequestStatus {
    request: CustomerRequest;
    updates: RequestStatusUpdate[];
    currentETA?: string;
}
