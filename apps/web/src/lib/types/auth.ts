/**
 * Type definitions for authentication
 */

export enum UserRole {
    OWNER = "OWNER",
    WORKER = "WORKER",
    CUSTOMER = "CUSTOMER",
}

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: UserRole;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterCustomerInput {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
}

export interface RegisterWorkerInput {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    password: string;
}

export interface RegisterOwnerInput {
    name: string;
    email: string;
    phone: string;
    password: string;
}
