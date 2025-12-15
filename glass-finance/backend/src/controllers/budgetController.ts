import { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/auth.types';
import * as budgetService from '../services/budgetService';
import { createError } from '../middleware/errorHandler';

/**
 * Get all budgets for the authenticated user
 */
export async function getBudgets(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { period, categoryId, active } = req.query;

        const filters = {
            period: period as string | undefined,
            categoryId: categoryId as string | undefined,
            active: active === 'true' ? true : active === 'false' ? false : undefined,
        };

        const budgets = await budgetService.getBudgets(req.user.userId, filters);

        res.json({
            success: true,
            data: budgets,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get budget by ID
 */
export async function getBudgetById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const budget = await budgetService.getBudgetById(req.user.userId, req.params.id);

        res.json({
            success: true,
            data: budget,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Create new budget
 */
export async function createBudget(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const budget = await budgetService.createBudget(req.user.userId, req.body);

        res.status(201).json({
            success: true,
            message: 'Budget created successfully',
            data: budget,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update budget
 */
export async function updateBudget(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const budget = await budgetService.updateBudget(
            req.user.userId,
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            message: 'Budget updated successfully',
            data: budget,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete budget
 */
export async function deleteBudget(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        await budgetService.deleteBudget(req.user.userId, req.params.id);

        res.json({
            success: true,
            message: 'Budget deleted successfully',
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get budget progress
 */
export async function getBudgetProgress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const progress = await budgetService.getBudgetProgress(req.user.userId, req.params.id);

        res.json({
            success: true,
            data: progress,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get budget insights and recommendations
 */
export async function getBudgetInsights(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const insights = await budgetService.getBudgetInsights(req.user.userId);

        res.json({
            success: true,
            data: insights,
        });
    } catch (error) {
        next(error);
    }
}
