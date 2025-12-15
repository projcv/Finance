import prisma from '../config/database';
import { createError } from '../middleware/errorHandler';

interface TransactionFilters {
    type?: 'income' | 'expense';
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    search?: string;
}

interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: 'date' | 'amount' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

/**
 * Get transactions with filtering and pagination
 */
export async function getTransactions(
    userId: string,
    filters: TransactionFilters,
    pagination: PaginationOptions
) {
    const { page, limit, sortBy = 'date', sortOrder = 'desc' } = pagination;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };

    if (filters.type) {
        where.type = filters.type;
    }

    if (filters.categoryId) {
        where.categoryId = filters.categoryId;
    }

    if (filters.startDate || filters.endDate) {
        where.date = {};
        if (filters.startDate) {
            where.date.gte = filters.startDate;
        }
        if (filters.endDate) {
            where.date.lte = filters.endDate;
        }
    }

    if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
        where.amount = {};
        if (filters.minAmount !== undefined) {
            where.amount.gte = filters.minAmount;
        }
        if (filters.maxAmount !== undefined) {
            where.amount.lte = filters.maxAmount;
        }
    }

    if (filters.search) {
        where.description = {
            contains: filters.search,
        };
    }

    // Get transactions and total count
    const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
            where,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                        color: true,
                        type: true,
                    },
                },
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip,
            take: limit,
        }),
        prisma.transaction.count({ where }),
    ]);

    return {
        transactions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

/**
 * Get transaction by ID
 */
export async function getTransactionById(userId: string, transactionId: string) {
    const transaction = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            userId,
        },
        include: {
            category: true,
        },
    });

    if (!transaction) {
        throw createError('Transaction not found', 404);
    }

    return transaction;
}

/**
 * Create new transaction
 */
export async function createTransaction(userId: string, data: any) {
    // Verify category exists and belongs to user
    const category = await prisma.category.findFirst({
        where: {
            id: data.categoryId,
            userId,
        },
    });

    if (!category) {
        throw createError('Category not found', 404);
    }

    return prisma.transaction.create({
        data: {
            ...data,
            userId,
            date: new Date(data.date),
        },
        include: {
            category: true,
        },
    });
}

/**
 * Update transaction
 */
export async function updateTransaction(userId: string, transactionId: string, data: any) {
    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            userId,
        },
    });

    if (!existingTransaction) {
        throw createError('Transaction not found', 404);
    }

    // If categoryId is being updated, verify it exists
    if (data.categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: data.categoryId,
                userId,
            },
        });

        if (!category) {
            throw createError('Category not found', 404);
        }
    }

    return prisma.transaction.update({
        where: { id: transactionId },
        data: {
            ...data,
            ...(data.date && { date: new Date(data.date) }),
        },
        include: {
            category: true,
        },
    });
}

/**
 * Delete transaction
 */
export async function deleteTransaction(userId: string, transactionId: string) {
    const transaction = await prisma.transaction.findFirst({
        where: {
            id: transactionId,
            userId,
        },
    });

    if (!transaction) {
        throw createError('Transaction not found', 404);
    }

    await prisma.transaction.delete({
        where: { id: transactionId },
    });

    return { message: 'Transaction deleted successfully' };
}

/**
 * Bulk create transactions
 */
export async function bulkCreateTransactions(userId: string, transactions: any[]) {
    // Verify all categories exist
    const categoryIds = [...new Set(transactions.map(t => t.categoryId))];
    const categories = await prisma.category.findMany({
        where: {
            id: { in: categoryIds },
            userId,
        },
    });

    if (categories.length !== categoryIds.length) {
        throw createError('One or more categories not found', 404);
    }

    const created = await prisma.transaction.createMany({
        data: transactions.map(t => ({
            ...t,
            userId,
            date: new Date(t.date),
        })),
    });

    return {
        count: created.count,
        message: `${created.count} transactions created successfully`,
    };
}

/**
 * Bulk delete transactions
 */
export async function bulkDeleteTransactions(userId: string, ids: string[]) {
    const deleted = await prisma.transaction.deleteMany({
        where: {
            id: { in: ids },
            userId,
        },
    });

    return {
        count: deleted.count,
        message: `${deleted.count} transactions deleted successfully`,
    };
}

/**
 * Get transaction statistics
 */
export async function getTransactionStats(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = startDate;
        if (endDate) where.date.lte = endDate;
    }

    const [
        totalIncome,
        totalExpense,
        transactionCount,
        categoryStats,
    ] = await Promise.all([
        // Total income
        prisma.transaction.aggregate({
            where: { ...where, type: 'income' },
            _sum: { amount: true },
        }),
        // Total expense
        prisma.transaction.aggregate({
            where: { ...where, type: 'expense' },
            _sum: { amount: true },
        }),
        // Transaction count
        prisma.transaction.count({ where }),
        // Category breakdown
        prisma.transaction.groupBy({
            by: ['categoryId', 'type'],
            where,
            _sum: { amount: true },
            _count: true,
        }),
    ]);

    // Get category details
    const categoryIds = categoryStats.map((s: any) => s.categoryId);
    const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
        select: { id: true, name: true, icon: true, color: true },
    });

    const categoryMap = new Map(categories.map((c: any) => [c.id, c]));

    const enrichedCategoryStats = categoryStats.map((stat: any) => {
        const category = categoryMap.get(stat.categoryId);
        return {
            categoryId: stat.categoryId,
            categoryName: category?.name || 'Unknown',
            categoryIcon: category?.icon || '❓',
            categoryColor: category?.color || '#gray',
            type: stat.type,
            total: stat._sum.amount || 0,
            count: stat._count,
        };
    });

    return {
        totalIncome: totalIncome._sum.amount || 0,
        totalExpense: totalExpense._sum.amount || 0,
        balance: (totalIncome._sum.amount || 0) - (totalExpense._sum.amount || 0),
        transactionCount,
        categoryStats: enrichedCategoryStats,
    };
}
