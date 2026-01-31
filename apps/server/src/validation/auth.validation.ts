import { z } from "zod";

/**
 * Authentication Validation Schemas
 * Zod schemas for validating authentication requests
 */

// Constants
const passwordMinLength = 8;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format


// ============================================================
// REGISTRATION SCHEMAS
// ============================================================

/**
 * Customer Registration Schema
 */
export const registerCustomerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().regex(emailRegex, "Invalid email format"),
    phone: z.string().regex(phoneRegex, "Invalid phone number format").optional(),
    password: z
        .string()
        .min(passwordMinLength, `Password must be at least ${passwordMinLength} characters`)
        .optional(),
    address: z.string().optional(),
});

/**
 * Worker Registration Schema
 */
export const registerWorkerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().regex(emailRegex, "Invalid email format"),
    phone: z.string().regex(phoneRegex, "Invalid phone number format").optional(),
    password: z
        .string()
        .min(passwordMinLength, `Password must be at least ${passwordMinLength} characters`),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
});

/**
 * Owner Registration
 * Highest security requirements
 */
export const registerOwnerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().regex(emailRegex, "Invalid email format"),
    phone: z.string().regex(phoneRegex, "Invalid phone number format").optional(),
    password: z
        .string()
        .min(passwordMinLength, `Password must be at least ${passwordMinLength} characters`),
});

// ============================================================
// LOGIN SCHEMAS
// ============================================================

/**
 * Login Schema
 */
export const loginSchema = z.object({
    email: z.string().regex(emailRegex, "Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

/**
 * OTP Login Schema (for customers without password)
 */
export const otpLoginSchema = z.object({
    phone: z.string().regex(phoneRegex, "Invalid phone number format"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

// ============================================================
// TOKEN SCHEMAS
// ============================================================

/**
 * Refresh Token Schema
 */
export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});

// ============================================================
// PASSWORD MANAGEMENT SCHEMAS
// ============================================================

/**
 * Change Password Schema
 */
export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(passwordMinLength, `Password must be at least ${passwordMinLength} characters`)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = z.object({
    phone: z.string().regex(phoneRegex, "Invalid phone number format"),
});

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
        .string()
        .min(passwordMinLength, `Password must be at least ${passwordMinLength} characters`)
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

/**
 * Request OTP Schema
 */
export const requestOtpSchema = z.object({
    phone: z.string().regex(phoneRegex, "Invalid phone number format"),
});

/**
 * Verify OTP Schema
 */
export const verifyOtpSchema = z.object({
    phone: z.string().regex(phoneRegex, "Invalid phone number format"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

// ============================================================
// PROFILE UPDATE SCHEMAS
// ============================================================

/**
 * Update Profile Schema
 */
export const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    address: z.string().optional(),
    skills: z.array(z.string()).min(1).max(10).optional(),
});

// ============================================================
// TYPE EXPORTS
// ============================================================

export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type RegisterWorkerInput = z.infer<typeof registerWorkerSchema>;
export type RegisterOwnerInput = z.infer<typeof registerOwnerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpLoginInput = z.infer<typeof otpLoginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
