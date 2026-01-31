import type { Request, Response, NextFunction } from "express";
import { AppError } from "./error.middleware";

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "dev-internal-key";

/**
 * Agent guard middleware - protects internal routes
 * Only allows requests with valid internal API key or from localhost in dev
 */
export const agentGuard = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const isDev = process.env.NODE_ENV === "development";
    const apiKey = req.headers["x-internal-api-key"] as string;

    // In development, allow localhost without API key
    if (isDev && isLocalhost(req)) {
        return next();
    }

    // Validate API key
    if (!apiKey || apiKey !== INTERNAL_API_KEY) {
        throw new AppError(403, "Access denied. Internal API key required");
    }

    next();
};

/**
 * Check if request is from localhost
 */
function isLocalhost(req: Request): boolean {
    const ip =
        req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

    return (
        ip === "127.0.0.1" ||
        ip === "::1" ||
        ip === "localhost" ||
        ip === "::ffff:127.0.0.1"
    );
}
