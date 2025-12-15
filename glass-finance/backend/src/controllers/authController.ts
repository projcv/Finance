import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/passwordUtils';
import { generateTokens, verifyToken } from '../utils/jwtUtils';
import { createError } from '../middleware/errorHandler';
import type { RegisterRequest, LoginRequest, RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../types/auth.types';

/**
 * Register a new user
 */
export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, username, password, currency, language }: RegisterRequest = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                ],
            },
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw createError('Email already registered', 400);
            }
            throw createError('Username already taken', 400);
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                username,
                passwordHash,
                currency: currency || 'VND',
                language: language || 'vi',
            },
        });

        // Generate tokens
        const tokens = generateTokens({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    currency: user.currency,
                    language: user.language,
                },
                ...tokens,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password }: LoginRequest = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw createError('Invalid email or password', 401);
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            throw createError('Invalid email or password', 401);
        }

        // Generate tokens
        const tokens = generateTokens({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    avatar: user.avatar,
                    currency: user.currency,
                    language: user.language,
                },
                ...tokens,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Refresh access token
 */
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
        const { refreshToken }: RefreshTokenRequest = req.body;

        // Verify refresh token
        const payload = verifyToken(refreshToken);

        // Verify user still exists
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            throw createError('User not found', 404);
        }

        // Generate new tokens
        const tokens = generateTokens({
            userId: user.id,
            email: user.email,
            username: user.username,
        });

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: tokens,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Logout user (client-side token removal)
 */
export async function logout(_req: Request, res: Response) {
    res.json({
        success: true,
        message: 'Logout successful',
    });
}

/**
 * Request password reset
 */
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { email }: ForgotPasswordRequest = req.body;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({
                success: true,
                message: 'If the email exists, a password reset link has been sent',
            });
        }

        // Generate reset token (in production, store this in database with expiry)
        const resetToken = generateTokens({
            userId: user.id,
            email: user.email,
            username: user.username,
        }).accessToken;

        // TODO: Send email with reset link
        console.log(`Password reset token for ${email}: ${resetToken}`);
        console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);

        res.json({
            success: true,
            message: 'If the email exists, a password reset link has been sent',
            // In development, include token
            ...(process.env.NODE_ENV === 'development' && { resetToken }),
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Reset password with token
 */
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const { token, newPassword }: ResetPasswordRequest = req.body;

        // Verify reset token
        const payload = verifyToken(token);

        // Find user
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });

        if (!user) {
            throw createError('Invalid or expired reset token', 400);
        }

        // Hash new password
        const passwordHash = await hashPassword(newPassword);

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash },
        });

        res.json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Verify email (placeholder)
 */
export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            throw createError('Verification token is required', 400);
        }

        // Verify token
        const payload = verifyToken(token);

        // In production, update user's email verification status
        await prisma.user.update({
            where: { id: payload.userId },
            data: { updatedAt: new Date() }, // Placeholder
        });

        res.json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        next(error);
    }
}
