import type { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";
import type { AuthenticatedUser } from "../types/types";

/**
 * Authentication middleware
 * TODO: Implement actual JWT validation with Supabase Auth or custom JWT
 */
export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError(401, "Missing or invalid authorization header");
        }

        const token = authHeader.substring(7);

        // TODO: Replace with actual JWT verification
        // For now, this is a placeholder that extracts mock user data
        const user = await verifyToken(token);

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuthenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            const user = await verifyToken(token);
            req.user = user;
        }

        next();
    } catch (error) {
        // Silently continue without user if token is invalid
        next();
    }
};

/**
 * TODO: Implement actual JWT verification
 * This is a placeholder implementation
 */
async function verifyToken(token: string): Promise<AuthenticatedUser> {
    // Placeholder: In production, verify JWT signature and decode payload
    if (!token || token === "invalid") {
        throw new AppError(401, "Invalid token");
    }

    // Mock user data - replace with actual JWT decode
    return {
        id: "user_placeholder",
        role: "WORKER" as any,
        name: "Placeholder User",
    };
}
