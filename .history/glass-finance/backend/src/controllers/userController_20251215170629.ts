import { Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createError } from '../middleware/errorHandler';
import type { AuthenticatedRequest, UpdateProfileRequest, UpdatePreferencesRequest } from '../types/auth.types';

/**
 * Get user profile
 */
export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                currency: true,
                language: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw createError('User not found', 404);
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update user profile
 */
export async function updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { username, avatar }: UpdateProfileRequest = req.body;

        // Check if username is already taken
        if (username) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    username,
                    NOT: {
                        id: req.user.userId,
                    },
                },
            });

            if (existingUser) {
                throw createError('Username already taken', 400);
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                ...(username && { username }),
                ...(avatar !== undefined && { avatar }),
            },
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                currency: true,
                language: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update user preferences
 */
export async function updatePreferences(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { currency, language }: UpdatePreferencesRequest = req.body;

        // Update preferences
        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: {
                ...(currency && { currency }),
                ...(language && { language }),
            },
            select: {
                id: true,
                email: true,
                username: true,
                avatar: true,
                currency: true,
                language: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete user account
 */
export async function deleteAccount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        // Delete user (cascade will delete all related data)
        await prisma.user.delete({
            where: { id: req.user.userId },
        });

        res.json({
            success: true,
            message: 'Account deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get user statistics
 */
export async function getUserStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const [
            totalTransactions,
            totalCategories,
            totalBudgets,
            totalGoals,
        ] = await Promise.all([
            prisma.transaction.count({ where: { userId: req.user.userId } }),
            prisma.category.count({ where: { userId: req.user.userId } }),
            prisma.budget.count({ where: { userId: req.user.userId } }),
            prisma.savingsGoal.count({ where: { userId: req.user.userId } }),
        ]);

        res.json({
            success: true,
            data: {
                totalTransactions,
                totalCategories,
                totalBudgets,
                totalGoals,
            },
        });
    } catch (error) {
        next(error);
    }
}
