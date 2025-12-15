import { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../types/auth.types';
import * as transactionService from '../services/transactionService';
import { createError } from '../middleware/errorHandler';

/**
 * Get all transactions with filtering and pagination
 */
export async function getTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const {
            type,
            categoryId,
            startDate,
            endDate,
            minAmount,
            maxAmount,
            search,
            page = '1',
            limit = '20',
            sortBy = 'date',
            sortOrder = 'desc',
        } = req.query;

        const filters = {
            type: type as 'income' | 'expense' | undefined,
            categoryId: categoryId as string | undefined,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
            minAmount: minAmount ? parseFloat(minAmount as string) : undefined,
            maxAmount: maxAmount ? parseFloat(maxAmount as string) : undefined,
            search: search as string | undefined,
        };

        const pagination = {
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
            sortBy: sortBy as 'date' | 'amount' | 'createdAt',
            sortOrder: sortOrder as 'asc' | 'desc',
        };

        const result = await transactionService.getTransactions(req.user.userId, filters, pagination);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get transaction by ID
 */
export async function getTransactionById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const transaction = await transactionService.getTransactionById(req.user.userId, req.params.id);

        res.json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Create new transaction
 */
export async function createTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const transaction = await transactionService.createTransaction(req.user.userId, req.body);

        res.status(201).json({
            success: true,
            message: 'Transaction created successfully',
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Update transaction
 */
export async function updateTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const transaction = await transactionService.updateTransaction(
            req.user.userId,
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            message: 'Transaction updated successfully',
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Delete transaction
 */
export async function deleteTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const result = await transactionService.deleteTransaction(req.user.userId, req.params.id);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Bulk create transactions
 */
export async function bulkCreateTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const result = await transactionService.bulkCreateTransactions(
            req.user.userId,
            req.body.transactions
        );

        res.status(201).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Bulk delete transactions
 */
export async function bulkDeleteTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const result = await transactionService.bulkDeleteTransactions(req.user.userId, req.body.ids);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Get transaction statistics
 */
export async function getTransactionStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { startDate, endDate } = req.query;

        const stats = await transactionService.getTransactionStats(
            req.user.userId,
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

/**
 * Export transactions to CSV
 */
export async function exportTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        const { startDate, endDate, type } = req.query;

        const filters = {
            type: type as 'income' | 'expense' | undefined,
            startDate: startDate ? new Date(startDate as string) : undefined,
            endDate: endDate ? new Date(endDate as string) : undefined,
        };

        const result = await transactionService.getTransactions(
            req.user.userId,
            filters,
            { page: 1, limit: 10000 } // Get all transactions
        );

        // Convert to CSV
        const csvHeader = 'Date,Type,Category,Amount,Description,Payment Method,Location\n';
        const csvRows = result.transactions.map((t: any) => {
            const date = new Date(t.date).toISOString().split('T')[0];
            const description = (t.description || '').replace(/,/g, ';');
            const paymentMethod = (t.paymentMethod || '').replace(/,/g, ';');
            const location = (t.location || '').replace(/,/g, ';');

            return `${date},${t.type},${t.category.name},${t.amount},"${description}","${paymentMethod}","${location}"`;
        }).join('\n');

        const csv = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
        res.send(csv);
    } catch (error) {
        next(error);
    }
}

/**
 * Import transactions from CSV (placeholder)
 */
export async function importTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        if (!req.user) {
            throw createError('Unauthorized', 401);
        }

        // TODO: Implement CSV parsing and validation
        // This would require multer for file upload

        res.json({
            success: true,
            message: 'Import feature coming soon',
        });
    } catch (error) {
        next(error);
    }
}
