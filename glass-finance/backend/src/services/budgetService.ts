import { PrismaClient } from '@prisma/client';
import { createError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

interface BudgetFilters {
    period?: string;
    categoryId?: string;
    active?: boolean;
}

interface CreateBudgetData {
    categoryId?: string;
    amount: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: string | Date;
    endDate?: string | Date;
    notificationsEnabled?: boolean;
}

interface UpdateBudgetData {
    categoryId?: string;
    amount?: number;
    period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate?: string | Date;
    endDate?: string | Date;
    notificationsEnabled?: boolean;
}

/**
 * Get all budgets with optional filters
 */
export async function getBudgets(userId: string, filters: BudgetFilters = {}) {
    const where: any = { userId };

    if (filters.period) {
        where.period = filters.period;
    }

    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }

    if (filters.active !== undefined) {
        const now = new Date();
        if (filters.active) {
            where.startDate = { lte: now };
            where.OR = [
                { endDate: null },
                { endDate: { gte: now } }
            ];
        } else {
            where.endDate = { lt: now };
        }
    }

    const budgets = await prisma.budget.findMany({
        where,
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    color: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return budgets;
}

/**
 * Get budget by ID
 */
export async function getBudgetById(userId: string, budgetId: string) {
    const budget = await prisma.budget.findFirst({
        where: {
            id: budgetId,
            userId
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    color: true,
                }
            }
        }
    });

    if (!budget) {
        throw createError('Budget not found', 404);
    }

    return budget;
}

/**
 * Create new budget
 */
export async function createBudget(userId: string, data: CreateBudgetData) {
    // Validate amount
    if (data.amount <= 0) {
        throw createError('Budget amount must be greater than 0', 400);
    }

    // Validate period
    const validPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validPeriods.includes(data.period)) {
        throw createError('Invalid budget period', 400);
    }

    // Check if category exists (if provided)
    if (data.categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: data.categoryId,
                userId
            }
        });

        if (!category) {
            throw createError('Category not found', 404);
        }
    }

    const budget = await prisma.budget.create({
        data: {
            userId,
            categoryId: data.categoryId,
            amount: data.amount,
            period: data.period,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
            notificationsEnabled: data.notificationsEnabled ?? true,
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    color: true,
                }
            }
        }
    });

    return budget;
}

/**
 * Update budget
 */
export async function updateBudget(userId: string, budgetId: string, data: UpdateBudgetData) {
    // Check if budget exists and belongs to user
    const existingBudget = await prisma.budget.findFirst({
        where: {
            id: budgetId,
            userId
        }
    });

    if (!existingBudget) {
        throw createError('Budget not found', 404);
    }

    // Validate amount if provided
    if (data.amount !== undefined && data.amount <= 0) {
        throw createError('Budget amount must be greater than 0', 400);
    }

    // Check if category exists (if provided)
    if (data.categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: data.categoryId,
                userId
            }
        });

        if (!category) {
            throw createError('Category not found', 404);
        }
    }

    const updateData: any = {};
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.period !== undefined) updateData.period = data.period;
    if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    if (data.notificationsEnabled !== undefined) updateData.notificationsEnabled = data.notificationsEnabled;

    const budget = await prisma.budget.update({
        where: { id: budgetId },
        data: updateData,
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    color: true,
                }
            }
        }
    });

    return budget;
}

/**
 * Delete budget
 */
export async function deleteBudget(userId: string, budgetId: string) {
    const budget = await prisma.budget.findFirst({
        where: {
            id: budgetId,
            userId
        }
    });

    if (!budget) {
        throw createError('Budget not found', 404);
    }

    await prisma.budget.delete({
        where: { id: budgetId }
    });

    return { message: 'Budget deleted successfully' };
}

/**
 * Get budget progress
 */
export async function getBudgetProgress(userId: string, budgetId: string) {
    const budget = await getBudgetById(userId, budgetId);

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date(budget.startDate);
    let endDate = budget.endDate ? new Date(budget.endDate) : now;

    // Adjust dates based on period
    switch (budget.period) {
        case 'daily':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            break;
        case 'weekly':
            const dayOfWeek = now.getDay();
            startDate = new Date(now);
            startDate.setDate(now.getDate() - dayOfWeek);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59);
            break;
        case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
            break;
        case 'yearly':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
            break;
    }

    // Get transactions for this budget period
    const where: any = {
        userId,
        type: 'expense',
        date: {
            gte: startDate,
            lte: endDate
        }
    };

    if (budget.categoryId) {
        where.categoryId = budget.categoryId;
    }

    const transactions = await prisma.transaction.findMany({
        where,
        select: {
            amount: true,
            date: true,
        }
    });

    const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;

    // Determine status
    let status: 'safe' | 'warning' | 'exceeded' = 'safe';
    if (percentage >= 100) {
        status = 'exceeded';
    } else if (percentage >= 80) {
        status = 'warning';
    }

    return {
        budget,
        period: {
            start: startDate,
            end: endDate,
        },
        spent,
        remaining,
        percentage: Math.min(percentage, 100),
        status,
        transactionCount: transactions.length,
    };
}

/**
 * Get budget insights and recommendations
 */
export async function getBudgetInsights(userId: string) {
    const budgets = await getBudgets(userId, { active: true });

    const insights = await Promise.all(
        budgets.map(async (budget) => {
            const progress = await getBudgetProgress(userId, budget.id);
            return progress;
        })
    );

    // Calculate overall statistics
    const totalBudget = insights.reduce((sum, i) => sum + i.budget.amount, 0);
    const totalSpent = insights.reduce((sum, i) => sum + i.spent, 0);
    const overBudgetCount = insights.filter(i => i.status === 'exceeded').length;
    const warningCount = insights.filter(i => i.status === 'warning').length;

    // Generate recommendations
    const recommendations: string[] = [];

    if (overBudgetCount > 0) {
        recommendations.push(`You have ${overBudgetCount} budget(s) that have been exceeded. Consider reviewing your spending.`);
    }

    if (warningCount > 0) {
        recommendations.push(`${warningCount} budget(s) are approaching their limit. Try to reduce spending in these categories.`);
    }

    // Find categories with highest spending
    const categorySpending = insights
        .filter(i => i.budget.category)
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 3);

    if (categorySpending.length > 0) {
        const topCategory = categorySpending[0];
        if (topCategory.budget.category) {
            recommendations.push(`Your highest spending is in "${topCategory.budget.category.name}" with ${topCategory.spent.toLocaleString()} spent.`);
        }
    }

    // Suggest budget creation for categories without budgets
    const categoriesWithBudgets = budgets
        .filter(b => b.categoryId)
        .map(b => b.categoryId);

    const categoriesWithoutBudgets = await prisma.category.findMany({
        where: {
            userId,
            type: { in: ['expense', 'both'] },
            id: { notIn: categoriesWithBudgets as string[] }
        },
        take: 3
    });

    if (categoriesWithoutBudgets.length > 0) {
        recommendations.push(`Consider creating budgets for: ${categoriesWithoutBudgets.map(c => c.name).join(', ')}`);
    }

    return {
        summary: {
            totalBudgets: budgets.length,
            totalBudget,
            totalSpent,
            totalRemaining: totalBudget - totalSpent,
            overBudgetCount,
            warningCount,
            safeCount: insights.filter(i => i.status === 'safe').length,
        },
        budgets: insights,
        recommendations,
    };
}
