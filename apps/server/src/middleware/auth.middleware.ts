import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import type { AuthenticatedUser } from "../types/types";
import { AppError } from "./error.middleware";

/**
 * Authentication Middleware
 * Verifies JWT tokens and attaches user to request
 */

/**
 * Extract token from Authorization header or cookies
 */
function extractToken(req: Request): string | null {
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.substring(7);
    }

    // Check cookies (for browser-based clients)
    if (req.cookies && req.cookies.accessToken) {
        return req.cookies.accessToken;
    }

    return null;
}

/**
 * Middleware to authenticate requests
 * Throws error if token is missing or invalid
 */
export function authenticate(
    req: Request,
    _res: Response,
    next: NextFunction,
): void {
    try {
        const token = extractToken(req);

        if (!token) {
            throw new AppError(401, "Authentication required");
        }

        // Verify token and extract payload
        const payload = authService.verifyAccessToken(token);

        // Attach user to request
        req.user = {
            id: payload.userId,
            role: payload.role,
            name: payload.email, // Will be replaced with actual name from DB
        } as AuthenticatedUser;

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't throw error if missing
 */
export function optionalAuthenticate(
    req: Request,
    _res: Response,
    next: NextFunction,
): void {
    try {
        const token = extractToken(req);

        if (token) {
            const payload = authService.verifyAccessToken(token);

            req.user = {
                id: payload.userId,
                role: payload.role,
                name: payload.email,
            } as AuthenticatedUser;
        }

        next();
    } catch (error) {
        // Ignore authentication errors for optional auth
        // Invalid tokens are simply not attached to req.user
        next();
    }
}
