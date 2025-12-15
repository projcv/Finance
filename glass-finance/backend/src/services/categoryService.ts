import prisma from '../config/database';
import { createError } from '../middleware/errorHandler';

/**
 * Get all categories for a user
 */
export async function getCategories(userId: string, type?: 'income' | 'expense' | 'both') {
    const where: any = { userId };

    if (type) {
        where.type = type;
    }

    const categories = await prisma.category.findMany({
        where,
        include: {
            parent: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                },
            },
            children: {
                select: {
                    id: true,
                    name: true,
                    icon: true,
                    color: true,
                    type: true,
                },
            },
            _count: {
                select: {
                    transactions: true,
                },
            },
        },
        orderBy: {
            name: 'asc',
        },
    });

    return categories;
}

/**
 * Get category by ID
 */
export async function getCategoryById(userId: string, categoryId: string) {
    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
        include: {
            parent: true,
            children: true,
            _count: {
                select: {
                    transactions: true,
                },
            },
        },
    });

    if (!category) {
        throw createError('Category not found', 404);
    }

    return category;
}

/**
 * Create new category
 */
export async function createCategory(userId: string, data: any) {
    // Check if category name already exists for this user
    const existing = await prisma.category.findFirst({
        where: {
            userId,
            name: data.name,
        },
    });

    if (existing) {
        throw createError('Category with this name already exists', 400);
    }

    // If parentId is provided, verify it exists
    if (data.parentId) {
        const parent = await prisma.category.findFirst({
            where: {
                id: data.parentId,
                userId,
            },
        });

        if (!parent) {
            throw createError('Parent category not found', 404);
        }
    }

    return prisma.category.create({
        data: {
            ...data,
            userId,
        },
        include: {
            parent: true,
            children: true,
        },
    });
}

/**
 * Update category
 */
export async function updateCategory(userId: string, categoryId: string, data: any) {
    // Check if category exists and belongs to user
    const existing = await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
    });

    if (!existing) {
        throw createError('Category not found', 404);
    }

    // If name is being updated, check for duplicates
    if (data.name && data.name !== existing.name) {
        const duplicate = await prisma.category.findFirst({
            where: {
                userId,
                name: data.name,
                NOT: {
                    id: categoryId,
                },
            },
        });

        if (duplicate) {
            throw createError('Category with this name already exists', 400);
        }
    }

    // If parentId is being updated, verify it exists and prevent circular reference
    if (data.parentId) {
        if (data.parentId === categoryId) {
            throw createError('Category cannot be its own parent', 400);
        }

        const parent = await prisma.category.findFirst({
            where: {
                id: data.parentId,
                userId,
            },
        });

        if (!parent) {
            throw createError('Parent category not found', 404);
        }

        // Check if the parent is a child of this category (prevent circular reference)
        if (parent.parentId === categoryId) {
            throw createError('Circular reference detected', 400);
        }
    }

    return prisma.category.update({
        where: { id: categoryId },
        data,
        include: {
            parent: true,
            children: true,
        },
    });
}

/**
 * Delete category
 */
export async function deleteCategory(userId: string, categoryId: string) {
    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
        include: {
            _count: {
                select: {
                    transactions: true,
                    children: true,
                },
            },
        },
    });

    if (!category) {
        throw createError('Category not found', 404);
    }

    // Check if category has transactions
    if (category._count.transactions > 0) {
        throw createError(
            `Cannot delete category with ${category._count.transactions} transactions. Please reassign or delete them first.`,
            400
        );
    }

    // Check if category has children
    if (category._count.children > 0) {
        throw createError(
            `Cannot delete category with ${category._count.children} subcategories. Please delete them first.`,
            400
        );
    }

    await prisma.category.delete({
        where: { id: categoryId },
    });

    return { message: 'Category deleted successfully' };
}

/**
 * Get category statistics
 */
export async function getCategoryStats(userId: string, categoryId: string, startDate?: Date, endDate?: Date) {
    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
    });

    if (!category) {
        throw createError('Category not found', 404);
    }

    const where: any = {
        categoryId,
        userId,
    };

    if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = startDate;
        if (endDate) where.date.lte = endDate;
    }

    const [totalAmount, transactionCount, recentTransactions] = await Promise.all([
        prisma.transaction.aggregate({
            where,
            _sum: { amount: true },
        }),
        prisma.transaction.count({ where }),
        prisma.transaction.findMany({
            where,
            orderBy: { date: 'desc' },
            take: 10,
            select: {
                id: true,
                amount: true,
                description: true,
                date: true,
                type: true,
            },
        }),
    ]);

    return {
        category,
        totalAmount: totalAmount._sum.amount || 0,
        transactionCount,
        recentTransactions,
    };
}
