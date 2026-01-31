import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import type {
    RegisterCustomerInput,
    RegisterWorkerInput,
    RegisterOwnerInput,
    LoginInput,
    ChangePasswordInput,
} from "../validation/auth.validation";
import type { SuccessResponse } from "../types/types";

/**
 * Authentication Controller
 * Handles all authentication-related HTTP requests
 */

export class AuthController {
    /**
     * POST /api/auth/register/customer
     * Register a new customer
     */
    async registerCustomer(req: Request, res: Response): Promise<void> {
        const data = req.body as RegisterCustomerInput;

        const result = await authService.registerCustomer(data);

        // Set refresh token as httpOnly cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            user: result.user,
            accessToken: result.accessToken,
        });
    }

    /**
     * POST /api/auth/register/worker
     * Register a new worker
     */
    async registerWorker(req: Request, res: Response): Promise<void> {
        const data = req.body as RegisterWorkerInput;

        const result = await authService.registerWorker(data);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            user: result.user,
            accessToken: result.accessToken,
        });
    }

    /**
     * POST /api/auth/register/owner
     * Register a new owner
     */
    async registerOwner(req: Request, res: Response): Promise<void> {
        const data = req.body as RegisterOwnerInput;

        const result = await authService.registerOwner(data);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            user: result.user,
            accessToken: result.accessToken,
        });
    }

    /**
     * POST /api/auth/login
     * Login with phone and password
     */
    async login(req: Request, res: Response): Promise<void> {
        const credentials = req.body as LoginInput;

        const result = await authService.login(credentials);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            user: result.user,
            accessToken: result.accessToken,
        });
    }

    /**
     * POST /api/auth/refresh
     * Refresh access token using refresh token
     */
    async refreshToken(req: Request, res: Response): Promise<void> {
        const refreshToken =
            req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Refresh token is required",
            });
            return;
        }

        const tokens = await authService.refreshTokens(refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            accessToken: tokens.accessToken,
        });
    }

    /**
     * POST /api/auth/logout
     * Logout and clear refresh token
     */
    async logout(_req: Request, res: Response): Promise<void> {
        res.clearCookie("refreshToken");

        const response: SuccessResponse = {
            success: true,
            message: "Logged out successfully",
        };

        res.status(200).json(response);
    }

    /**
     * PUT /api/auth/password
     * Change password for authenticated user
     */
    async changePassword(req: Request, res: Response): Promise<void> {
        const userId = req.user!.id;
        const { oldPassword, newPassword } = req.body as ChangePasswordInput;

        await authService.changePassword(userId, oldPassword, newPassword);

        const response: SuccessResponse = {
            success: true,
            message: "Password changed successfully",
        };

        res.status(200).json(response);
    }

    /**
     * GET /api/auth/me
     * Get authenticated user profile
     */
    async getProfile(req: Request, res: Response): Promise<void> {
        const user = req.user!;

        // Fetch full user details
        const userDetails = await authService.getUserById(user.id);

        if (!userDetails) {
            res.status(404).json({
                error: "Not Found",
                message: "User not found",
            });
            return;
        }

        res.status(200).json({
            user: userDetails,
        });
    }

    /**
     * POST /api/auth/request-otp
     * Request OTP for passwordless login (future implementation)
     */
    async requestOtp(req: Request, res: Response): Promise<void> {
        const { phone } = req.body;

        console.log("OTP requested for:", phone);

        // TODO: Implement OTP generation and SMS sending
        // const otp = generateOTP();
        // await smsService.send(phone, `Your OTP is: ${otp}`);
        // await cacheService.set(`otp:${phone}`, otp, 300); // 5 minutes

        const response: SuccessResponse = {
            success: true,
            message: "OTP sent successfully",
        };

        res.status(200).json(response);
    }

    /**
     * POST /api/auth/verify-otp
     * Verify OTP and login (future implementation)
     */
    async verifyOtp(req: Request, res: Response): Promise<void> {
        const { phone, otp } = req.body;

        console.log("OTP verification for:", phone, otp);

        // TODO: Implement OTP verification
        // const cachedOtp = await cacheService.get(`otp:${phone}`);
        // if (cachedOtp !== otp) {
        //   throw new AppError(401, "Invalid OTP");
        // }
        // await cacheService.delete(`otp:${phone}`);
        //
        // const user = await prisma.user.findUnique({
        //   where: { phone },
        // });
        //
        // Generate tokens and return

        const response: SuccessResponse = {
            success: true,
            message: "OTP verified successfully",
        };

        res.status(200).json(response);
    }
}

export const authController = new AuthController();
