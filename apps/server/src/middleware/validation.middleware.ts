import type { Request, Response, NextFunction } from "express";
import { z, type ZodType } from "zod";
import { AppError } from "./error.middleware";

/**
 * Validation middleware factory
 */
export const validate = (schema: ZodType) => {
    return (req: Request, _res: Response, next: NextFunction): void => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                next(new AppError(400, "Validation failed", error.issues));
            } else {
                next(error);
            }
        }
    };
};

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

export const requestItemSchema = z.object({
    sku: z.string().min(1),
    qty: z.number().int().positive(),
    size: z.string().optional(),
    color: z.string().optional(),
    fabric: z.string().optional(),
    alteration_type: z.string().optional(),
    measurement: z.record(z.string(), z.number()).optional(),
});

export const normalizedRequestPayloadSchema = z.object({
    type: z.enum(["alteration", "order", "stitching"]),
    items: z.array(requestItemSchema).min(1),
    required_skills: z.array(z.string()),
    estimated_minutes: z.number().int().positive(),
    preferred_slot: z
        .object({
            start: z.string().datetime(),
            end: z.string().datetime(),
        })
        .optional(),
    notes: z.string().optional(),
});

export const createRequestSchema = z.object({
    payload: normalizedRequestPayloadSchema,
    customerId: z.string().uuid().optional(),
});

export const updateTaskProgressSchema = z.object({
    actual_minutes_so_far: z.number().int().min(0),
    notes: z.string().optional(),
});

export const completeTaskSchema = z.object({
    actual_minutes: z.number().int().positive(),
    quality_ok: z.boolean(),
    notes: z.string().optional(),
});

export const setAvailabilitySchema = z.object({
    shifts: z.array(
        z.object({
            start: z.string().datetime(),
            end: z.string().datetime(),
        }),
    ),
});

export const forceAssignSchema = z.object({
    workerId: z.string().uuid(),
    reason: z.string().min(1),
});

export const decisionRulesSchema = z.object({
    weights: z.object({
        inventory: z.number().min(0).max(1),
        staff: z.number().min(0).max(1),
        dependency: z.number().min(0).max(1),
    }),
    thresholds: z.object({
        promise: z.number().min(0).max(1),
    }),
});

export const updateInventorySchema = z.object({
    sku: z.string().min(1),
    delta: z.number().int(),
    source: z.string(),
});

export const supplierWebhookSchema = z.object({
    orderRef: z.string(),
    eta: z.string().datetime(),
});
