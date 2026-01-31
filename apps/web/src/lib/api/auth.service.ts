import apiClient from "./client";
import type {
    AuthResponse,
    LoginInput,
    RegisterCustomerInput,
    RegisterWorkerInput,
    RegisterOwnerInput,
    User,
} from "../types/auth";

/**
 * Authentication Service
 * All API calls related to authentication
 */

class AuthService {
    /**
     * Login as Customer
     */
    async loginCustomer(credentials: LoginInput): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/api/auth/login", credentials);
        this.storeAuthData(response.data);
        return response.data;
    }

    /**
     * Login as Worker
     */
    async loginWorker(credentials: LoginInput): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/api/auth/login", credentials);
        this.storeAuthData(response.data);
        return response.data;
    }

    /**
     * Login as Owner
     */
    async loginOwner(credentials: LoginInput): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/api/auth/login", credentials);
        this.storeAuthData(response.data);
        return response.data;
    }

    /**
     * Register as Customer
     */
    async registerCustomer(data: RegisterCustomerInput): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/api/auth/register/customer", data);
        this.storeAuthData(response.data);
        return response.data;
    }

    /**
     * Register as Worker
     */
    async registerWorker(data: RegisterWorkerInput): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/api/auth/register/worker", data);
        this.storeAuthData(response.data);
        return response.data;
    }

    /**
     * Register as Owner
     */
    async registerOwner(data: RegisterOwnerInput): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>("/api/auth/register/owner", data);
        this.storeAuthData(response.data);
        return response.data;
    }

    /**
     * Get current user profile
     */
    async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>("/api/auth/me");
        return response.data;
    }

    /**
     * Logout
     */
    async logout(): Promise<void> {
        try {
            await apiClient.post("/api/auth/logout");
        } finally {
            this.clearAuthData();
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<AuthResponse> {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await apiClient.post<AuthResponse>("/api/auth/refresh", {
            refreshToken,
        });

        this.storeAuthData(response.data);
        return response.data;
    }

    /**
     * Store authentication data in localStorage
     */
    private storeAuthData(data: AuthResponse): void {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
    }

    /**
     * Clear authentication data from localStorage
     */
    private clearAuthData(): void {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    }

    /**
     * Get stored user data
     */
    getStoredUser(): User | null {
        const userStr = localStorage.getItem("user");
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem("accessToken");
    }
}

export const authService = new AuthService();
