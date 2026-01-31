import { Router, type IRouter } from "express";
import { authController } from "../../controllers/auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation.middleware";
import {
    registerCustomerSchema,
    registerWorkerSchema,
    registerOwnerSchema,
    loginSchema,
    changePasswordSchema,
    requestOtpSchema,
    verifyOtpSchema,
} from "../../validation/auth.validation";
import { idempotency } from "../../middleware/idempotency.middleware";

const router: IRouter = Router();

// ============================================================
// REGISTRATION ROUTES
// ============================================================

/**
 * @route   POST /api/auth/register/customer
 * @desc    Register a new customer
 * @access  Public
 */
router.post(
    "/register/customer",
    validate(registerCustomerSchema),
    idempotency,
    (req, res, next) => authController.registerCustomer(req, res).catch(next),
);

/**
 * @route   POST /api/auth/register/worker
 * @desc    Register a new worker
 * @access  Public
 */
router.post(
    "/register/worker",
    validate(registerWorkerSchema),
    idempotency,
    (req, res, next) => authController.registerWorker(req, res).catch(next),
);

/**
 * @route   POST /api/auth/register/owner
 * @desc    Register a new owner
 * @access  Public (Restricted in production)
 */
router.post(
    "/register/owner",
    validate(registerOwnerSchema),
    idempotency,
    (req, res, next) => authController.registerOwner(req, res).catch(next),
);

// ============================================================
// AUTHENTICATION ROUTES
// ============================================================

/**
 * @route   POST /api/auth/login
 * @desc    Login with phone and password
 * @access  Public
 */
router.post(
    "/login",
    validate(loginSchema),
    (req, res, next) => authController.login(req, res).catch(next),
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public (requires refresh token)
 */
router.post("/refresh", (req, res, next) =>
    authController.refreshToken(req, res).catch(next),
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout and clear tokens
 * @access  Public
 */
router.post("/logout", (req, res, next) =>
    authController.logout(req, res).catch(next),
);

// ============================================================
// OTP ROUTES (Passwordless Authentication)
// ============================================================

/**
 * @route   POST /api/auth/request-otp
 * @desc    Request OTP for passwordless login
 * @access  Public
 */
router.post(
    "/request-otp",
    validate(requestOtpSchema),
    (req, res, next) => authController.requestOtp(req, res).catch(next),
);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login
 * @access  Public
 */
router.post(
    "/verify-otp",
    validate(verifyOtpSchema),
    (req, res, next) => authController.verifyOtp(req, res).catch(next),
);

// ============================================================
// PROTECTED ROUTES (Require Authentication)
// ============================================================

/**
 * @route   GET /api/auth/me
 * @desc    Get authenticated user profile
 * @access  Private
 */
router.get("/me", authenticate, (req, res, next) =>
    authController.getProfile(req, res).catch(next),
);

/**
 * @route   PUT /api/auth/password
 * @desc    Change password
 * @access  Private
 */
router.put(
    "/password",
    authenticate,
    validate(changePasswordSchema),
    (req, res, next) => authController.changePassword(req, res).catch(next),
);

export default router;
