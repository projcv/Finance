import { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/auth.types';
import * as analyticsService from '../services/analyticsService';
import { createError } from '../middleware/errorHandler';

/**
 * Get spending overview
 */
export async function getOverview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { startDate, endDate } = req.query;

        const overview = await analyticsService.getOverview(
            req.user.userId,
            startDate ? new Date(startDate as string) : undefined,
            endDate ? new Date(endDate as string) : undefined
        );

        res.json({
            success: true,
            data: overview,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get monthly analytics
 */
export async function getMonthlyAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { year, month } = req.query;

        const analytics = await analyticsService.getMonthlyAnalytics(
            req.user.userId,
            year ? parseInt(year as string) : undefined,
            month ? parseInt(month as string) : undefined
        );

        res.json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get category analytics
 */
export async function getCategoryAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { startDate, endDate, type } = req.query;

        const analytics = await analyticsService.getCategoryAnalytics(
            req.user.userId,
            {
                startDate: startDate ? new Date(startDate as string) : undefined,
                endDate: endDate ? new Date(endDate as string) : undefined,
                type: type as 'income' | 'expense' | undefined,
            }
        );

        res.json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get spending trends
 */
export async function getTrends(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { period = 'monthly', limit = '12' } = req.query;

        const trends = await analyticsService.getTrends(
            req.user.userId,
            period as 'daily' | 'weekly' | 'monthly' | 'yearly',
            parseInt(limit as string)
        );

        res.json({
            success: true,
            data: trends,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Compare periods
 */
export async function getComparison(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { period1Start, period1End, period2Start, period2End } = req.query;

        if (!period1Start || !period1End || !period2Start || !period2End) {
            throw createError('Missing required date parameters', 400);
        }

        const comparison = await analyticsService.getComparison(
            req.user.userId,
            {
                start: new Date(period1Start as string),
                end: new Date(period1End as string),
            },
            {
                start: new Date(period2Start as string),
                end: new Date(period2End as string),
            }
        );

        res.json({
            success: true,
            data: comparison,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get spending forecast
 */
export async function getForecast(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { months = '3' } = req.query;

        const forecast = await analyticsService.getForecast(
            req.user.userId,
            parseInt(months as string)
        );

        res.json({
            success: true,
            data: forecast,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Generate custom report
 */
export async function getCustomReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const {
            startDate,
            endDate,
            groupBy = 'category',
            includeIncome = 'true',
            includeExpense = 'true',
            categories,
        } = req.query;

        const report = await analyticsService.getCustomReport(req.user.userId, {
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            groupBy: groupBy as 'category' | 'date' | 'paymentMethod',
            includeIncome: includeIncome === 'true',
            includeExpense: includeExpense === 'true',
            categoryIds: categories ? (categories as string).split(',') : undefined,
        });

        res.json({
            success: true,
            data: report,
        });
    } catch (error) {
        next(error);
    }
}
