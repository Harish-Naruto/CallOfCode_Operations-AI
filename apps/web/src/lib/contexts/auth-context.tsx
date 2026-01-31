"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../api/auth.service";
import type { User, LoginInput, RegisterCustomerInput, RegisterWorkerInput, RegisterOwnerInput } from "../types/auth";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginInput) => Promise<void>;
    registerCustomer: (data: RegisterCustomerInput) => Promise<void>;
    registerWorker: (data: RegisterWorkerInput) => Promise<void>;
    registerOwner: (data: RegisterOwnerInput) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for stored user on mount
    useEffect(() => {
        const storedUser = authService.getStoredUser();
        if (storedUser) {
            setUser(storedUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginInput) => {
        try {
            setIsLoading(true);
            setError(null);

            // Note: We use the same login endpoint for all roles
            // The backend determines the role from the user's email
            const response = await authService.loginCustomer(credentials);
            setUser(response.user);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Login failed";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const registerCustomer = async (data: RegisterCustomerInput) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authService.registerCustomer(data);
            setUser(response.user);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Registration failed";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const registerWorker = async (data: RegisterWorkerInput) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authService.registerWorker(data);
            setUser(response.user);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Registration failed";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const registerOwner = async (data: RegisterOwnerInput) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authService.registerOwner(data);
            setUser(response.user);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Registration failed";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await authService.logout();
            setUser(null);
        } catch (err: unknown) {
            console.error("Logout error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        registerCustomer,
        registerWorker,
        registerOwner,
        logout,
        error,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
