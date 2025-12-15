import { z } from 'zod';

/**
 * Transaction validation schemas
 */
export const createTransactionSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    categoryId: z.string().min(1, 'Category is required'),
    description: z.string().optional(),
    date: z.string().datetime().or(z.date()),
    type: z.enum(['income', 'expense']),
    paymentMethod: z.string().optional(),
    location: z.string().optional(),
    attachments: z.string().optional(),
});

export const updateTransactionSchema = z.object({
    amount: z.number().positive('Amount must be positive').optional(),
    categoryId: z.string().min(1).optional(),
    description: z.string().optional(),
    date: z.string().datetime().or(z.date()).optional(),
    type: z.enum(['income', 'expense']).optional(),
    paymentMethod: z.string().optional(),
    location: z.string().optional(),
    attachments: z.string().optional(),
});

export const transactionFiltersSchema = z.object({
    type: z.enum(['income', 'expense']).optional(),
    categoryId: z.string().optional(),
    startDate: z.string().datetime().or(z.date()).optional(),
    endDate: z.string().datetime().or(z.date()).optional(),
    minAmount: z.number().optional(),
    maxAmount: z.number().optional(),
    search: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.enum(['date', 'amount', 'createdAt']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const bulkTransactionSchema = z.object({
    transactions: z.array(createTransactionSchema).min(1, 'At least one transaction is required'),
});

export const bulkDeleteSchema = z.object({
    ids: z.array(z.string()).min(1, 'At least one ID is required'),
});

/**
 * Category validation schemas
 */
export const createCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters'),
    icon: z.string().min(1, 'Icon is required'),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
    type: z.enum(['income', 'expense', 'both']),
    parentId: z.string().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1).max(50).optional(),
    icon: z.string().min(1).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    type: z.enum(['income', 'expense', 'both']).optional(),
    parentId: z.string().optional(),
});

export const reorderCategoriesSchema = z.object({
    categories: z.array(z.object({
        id: z.string(),
        order: z.number(),
    })).min(1),
});
