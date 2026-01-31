import type { Request, Response, NextFunction } from "express";
import type { ErrorResponse } from "../types/types";

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: any,
    ) {
        super(message);
        this.name = "AppError";
    }
}

export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const isDev = process.env.NODE_ENV === "development";

    if (err instanceof AppError) {
        const response: ErrorResponse = {
            error: err.name,
            message: err.message,
            ...(isDev && err.details ? { details: err.details } : {}),
        };

        return res.status(err.statusCode).json(response);
    }

    // Unexpected errors
    console.error("Unexpected error:", err);

    const response: ErrorResponse = {
        error: "InternalServerError",
        message: isDev ? err.message : "An unexpected error occurred",
        ...(isDev ? { details: err.stack } : {}),
    };

    return res.status(500).json(response);
};

export const notFoundHandler = (_req: Request, res: Response) => {
    const response: ErrorResponse = {
        error: "NotFound",
        message: "Route not found",
    };

    res.status(404).json(response);
};
