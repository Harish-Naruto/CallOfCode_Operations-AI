import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import type { AuthResponse } from "../types/auth";

/**
 * API Client with Axios interceptors for authentication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Send cookies with requests
});

/**
 * Request Interceptor - Attach JWT token
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage
        const token = localStorage.getItem("accessToken");

        if (token) {
            // Attach token to Authorization header
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor - Handle 401 and token refresh
 */
apiClient.interceptors.response.use(
    (response) => {
        // Return successful responses as-is
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    // No refresh token, redirect to login
                    handleAuthError();
                    return Promise.reject(error);
                }

                // Call refresh endpoint
                const response = await axios.post<AuthResponse>(
                    `${API_URL}/api/auth/refresh`,
                    { refreshToken },
                    { withCredentials: true }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Update tokens in localStorage
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                handleAuthError();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

/**
 * Handle authentication errors
 */
function handleAuthError() {
    // Clear tokens
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Redirect to login page
    if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
    }
}

export default apiClient;
