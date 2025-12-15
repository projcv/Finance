import { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/auth.types';
import * as categoryService from '../services/categoryService';
import { createError } from '../middleware/errorHandler';

/**
 * Get all categories
 */
export async function getCategories(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { type } = req.query;

        const categories = await categoryService.getCategories(
            req.user.userId,
            type as 'income' | 'expense' | 'both' | undefined
        );

        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get category by ID
 */
export async function getCategoryById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const category = await categoryService.getCategoryById(req.user.userId, req.params.id);

        res.json({
            success: true,
            data: category,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Create new category
 */
export async function createCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const category = await categoryService.createCategory(req.user.userId, req.body);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update category
 */
export async function updateCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const category = await categoryService.updateCategory(
            req.user.userId,
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete category
 */
export async function deleteCategory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const result = await categoryService.deleteCategory(req.user.userId, req.params.id);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get category statistics
 */
export async function getCategoryStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { startDate, endDate } = req.query;

        const stats = await categoryService.getCategoryStats(
            req.user.userId,
            req.params.id,
            startDate ? new Date(startDate as string) : undefined,
            endDate ? new Date(endDate as string) : undefined
        );

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        next(error);
    }
}
