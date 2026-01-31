import type { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";
import { UserRole } from "../types/types";

/**
 * Role-based authorization middleware factory
 * Usage: requireRole([UserRole.OWNER, UserRole.WORKER])
 */
export const requireRole = (allowedRoles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError(401, "Authentication required");
        }

        console.log("[AUTH DEBUG] User role:", req.user.role, "| Allowed roles:", allowedRoles);

        if (!allowedRoles.includes(req.user.role)) {
            console.log("[AUTH DEBUG] Access DENIED - role mismatch");
            throw new AppError(
                403,
                `Access denied. Required roles: ${allowedRoles.join(", ")}`,
            );
        }

        console.log("[AUTH DEBUG] Access GRANTED");
        next();
    };
};

/**
 * Ensure user owns the resource or is an OWNER
 */
export const requireOwnership = (userIdParam: string = "userId") => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError(401, "Authentication required");
        }

        const resourceUserId = req.params[userIdParam];

        if (req.user.role === UserRole.OWNER) {
            // Owners can access any resource
            return next();
        }

        if (req.user.id !== resourceUserId) {
            throw new AppError(403, "Access denied. You can only access your own resources");
        }

        next();
    };
};
