import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type {
    RegisterCustomerInput,
    RegisterWorkerInput,
    RegisterOwnerInput,
    LoginInput,
} from "../validation/auth.validation";
import { UserRole, type AuthenticatedUser } from "../types/types";
import { AppError } from "../middleware/error.middleware";
import { prisma } from "../lib/prisma";

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-change-in-production";
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");

/**
 * Authentication Service
 * Handles user registration, login, token management, and password operations
 */

interface TokenPayload {
    userId: string;
    role: UserRole;
    email: string;
}

interface AuthResponse {
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        role: UserRole;
    };
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    /**
     * Hash password using bcrypt
     */
    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    }

    /**
     * Compare password with hash
     */
    private async comparePassword(
        password: string,
        hash: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    /**
     * Generate JWT access token
     */
    private generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_ACCESS_EXPIRY as jwt.SignOptions["expiresIn"],
            issuer: "decision-ai",
            audience: "decision-ai-api",
        });
    }

    /**
     * Generate JWT refresh token
     */
    private generateRefreshToken(payload: TokenPayload): string {
        return jwt.sign(payload, JWT_REFRESH_SECRET, {
            expiresIn: JWT_REFRESH_EXPIRY as jwt.SignOptions["expiresIn"],
            issuer: "decision-ai",
            audience: "decision-ai-api",
        });
    }

    /**
     * Verify JWT access token
     */
    verifyAccessToken(token: string): TokenPayload {
        try {
            const payload = jwt.verify(token, JWT_SECRET, {
                issuer: "decision-ai",
                audience: "decision-ai-api",
            }) as TokenPayload;
            return payload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError(401, "Access token expired");
            }
            throw new AppError(401, "Invalid access token");
        }
    }

    /**
     * Verify JWT refresh token
     */
    private verifyRefreshToken(token: string): TokenPayload {
        try {
            const payload = jwt.verify(token, JWT_REFRESH_SECRET, {
                issuer: "decision-ai",
                audience: "decision-ai-api",
            }) as TokenPayload;
            return payload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new AppError(401, "Refresh token expired");
            }
            throw new AppError(401, "Invalid refresh token");
        }
    }

    /**
     * Register a new customer
     */
    async registerCustomer(
        data: RegisterCustomerInput,
    ): Promise<AuthResponse> {
        console.log("Registering customer:", { email: data.email, name: data.name });

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new AppError(409, "Email already registered");
        }

        // Hash password if provided, otherwise generate a random one
        const passwordHash = data.password
            ? await this.hashPassword(data.password)
            : await this.hashPassword(Math.random().toString(36).substring(7));

        // Create user and customer in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    phone: data.phone,
                    name: data.name,
                    role: UserRole.CUSTOMER,
                    passwordHash,
                    skills: [],
                    isActive: true,
                },
            });

            // Create customer profile
            await tx.customer.create({
                data: {
                    userId: user.id,
                    email: data.email,
                    phone: data.phone,
                    name: data.name,
                    address: data.address,
                },
            });

            return user;
        });

        const tokenPayload: TokenPayload = {
            userId: result.id,
            role: result.role as UserRole,
            email: result.email,
        };

        return {
            user: {
                id: result.id,
                email: result.email,
                phone: result.phone || undefined,
                name: result.name,
                role: result.role as UserRole,
            },
            accessToken: this.generateAccessToken(tokenPayload),
            refreshToken: this.generateRefreshToken(tokenPayload),
        };
    }

    /**
     * Register a new worker
     */
    async registerWorker(data: RegisterWorkerInput): Promise<AuthResponse> {
        console.log("Registering worker:", { email: data.email, name: data.name });

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new AppError(409, "Email already registered");
        }

        // Hash password
        const passwordHash = await this.hashPassword(data.password);

        // Create user and worker in a transaction
        const result = await prisma.$transaction(async (tx: any) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    phone: data.phone,
                    name: data.name,
                    role: UserRole.WORKER,
                    passwordHash,
                    skills: data.skills || [],
                    isActive: true,
                },
            });

            // Create worker profile
            await tx.worker.create({
                data: {
                    userId: user.id,
                    email: data.email,
                    phone: data.phone,
                    name: data.name,
                    skills: data.skills || [],
                },
            });

            return user;
        });

        const tokenPayload: TokenPayload = {
            userId: result.id,
            role: result.role as UserRole,
            email: result.email,
        };

        return {
            user: {
                id: result.id,
                email: result.email,
                phone: result.phone || undefined,
                name: result.name,
                role: result.role as UserRole,
            },
            accessToken: this.generateAccessToken(tokenPayload),
            refreshToken: this.generateRefreshToken(tokenPayload),
        };
    }

    /**
     * Register a new owner
     */
    async registerOwner(data: RegisterOwnerInput): Promise<AuthResponse> {
        console.log("Registering owner:", { email: data.email, name: data.name });

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            throw new AppError(409, "Email already registered");
        }

        // Hash password
        const passwordHash = await this.hashPassword(data.password);

        // Create user and owner in a transaction
        const result = await prisma.$transaction(async (tx: any) => {
            // Create user
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    phone: data.phone,
                    name: data.name,
                    role: UserRole.OWNER,
                    passwordHash,
                    skills: [],
                    isActive: true,
                },
            });

            // Create owner profile
            await tx.owner.create({
                data: {
                    userId: user.id,
                    email: data.email,
                    phone: data.phone,
                    name: data.name,
                },
            });

            return user;
        });

        const tokenPayload: TokenPayload = {
            userId: result.id,
            role: result.role as UserRole,
            email: result.email,
        };

        return {
            user: {
                id: result.id,
                email: result.email,
                phone: result.phone || undefined,
                name: result.name,
                role: result.role as UserRole,
            },
            accessToken: this.generateAccessToken(tokenPayload),
            refreshToken: this.generateRefreshToken(tokenPayload),
        };
    }

    /**
   * Login user with email and password
   */
    async login(credentials: LoginInput): Promise<AuthResponse> {
        console.log("Login attempt for:", credentials.email);

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: credentials.email },
        });

        if (!user) {
            throw new AppError(401, "Invalid credentials");
        }

        if (!user.isActive) {
            throw new AppError(403, "Account is deactivated");
        }

        // Verify password
        const isPasswordValid = await this.comparePassword(
            credentials.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new AppError(401, "Invalid credentials");
        }

        const tokenPayload: TokenPayload = {
            userId: user.id,
            role: user.role as UserRole,
            email: user.email,
        };

        return {
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone || undefined,
                name: user.name,
                role: user.role as UserRole,
            },
            accessToken: this.generateAccessToken(tokenPayload),
            refreshToken: this.generateRefreshToken(tokenPayload),
        };
    };

    /**
     * Refresh access token
     */
    async refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        const payload = this.verifyRefreshToken(refreshToken);

        const tokenPayload: TokenPayload = {
            userId: payload.userId,
            role: payload.role,
            email: payload.email,
        };

        return {
            accessToken: this.generateAccessToken(tokenPayload),
            refreshToken: this.generateRefreshToken(tokenPayload),
        };
    }

    /**
     * Change user password
     */
    async changePassword(
        userId: string,
        _oldPassword: string,
        _newPassword: string,
    ): Promise<void> {
        console.log("Changing password for user:", userId);

        // TODO: Integrate with Prisma
        // const user = await prisma.user.findUnique({
        //   where: { id: userId },
        // });
        //
        // if (!user) {
        //   throw new AppError(404, "User not found");
        // }
        //
        // const isPasswordValid = await this.comparePassword(
        //   _oldPassword,
        //   user.passwordHash,
        // );
        //
        // if (!isPasswordValid) {
        //   throw new AppError(401, "Invalid current password");
        // }
        //
        // const newPasswordHash = await this.hashPassword(_newPassword);
        //
        // await prisma.user.update({
        //   where: { id: userId },
        //   data: { passwordHash: newPasswordHash },
        // });
    }

    /**
     * Get user profile by ID
     */
    async getUserById(userId: string): Promise<AuthenticatedUser | null> {
        console.log("Fetching user:", userId);

        // TODO: Integrate with Prisma
        // const user = await prisma.user.findUnique({
        //   where: { id: userId },
        //   select: {
        //     id: true,
        //     name: true,
        //     phone: true,
        //     role: true,
        //   },
        // });
        //
        // return user;

        // Keep methods in scope for future use
        void this.comparePassword;
        void this.hashPassword;

        return null;
    }
}

export const authService = new AuthService();
