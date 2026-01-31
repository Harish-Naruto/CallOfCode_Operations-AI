import type { Request, Response, NextFunction } from "express";

// In-memory cache for idempotency (replace with Redis in production)
const idempotencyCache = new Map<
    string,
    {
        response: any;
        timestamp: number;
    }
>();

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Idempotency middleware
 * Caches responses based on Idempotency-Key header
 */
export const idempotency = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const idempotencyKey = req.headers["idempotency-key"] as string;

    // Only apply to POST, PUT, PATCH requests
    if (!["POST", "PUT", "PATCH"].includes(req.method)) {
        return next();
    }

    if (!idempotencyKey) {
        // Idempotency key is optional but recommended
        return next();
    }

    // Check cache
    const cached = idempotencyCache.get(idempotencyKey);

    if (cached) {
        const isExpired = Date.now() - cached.timestamp > CACHE_TTL_MS;

        if (!isExpired) {
            // Return cached response
            res.status(200).json(cached.response);
            return;
        }

        // Remove expired entry
        idempotencyCache.delete(idempotencyKey);
    }

    // Intercept response to cache it
    const originalJson = res.json.bind(res);

    res.json = function (body: any) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            idempotencyCache.set(idempotencyKey, {
                response: body,
                timestamp: Date.now(),
            });

            // Clean up old entries periodically
            cleanupExpiredEntries();
        }

        return originalJson(body);
    };

    next();
};

/**
 * Cleanup expired cache entries
 */
function cleanupExpiredEntries(): void {
    const now = Date.now();

    for (const [key, value] of Array.from(idempotencyCache.entries())) {
        if (now - value.timestamp > CACHE_TTL_MS) {
            idempotencyCache.delete(key);
        }
    }
}
