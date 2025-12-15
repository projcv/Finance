import { Router } from 'express';
import * as transactionController from '../controllers/transactionController';
import { authenticate } from '../middleware/authMiddleware';
import { validateRequest, validateQuery } from '../middleware/validationMiddleware';
import {
    createTransactionSchema,
    updateTransactionSchema,
    transactionFiltersSchema,
    bulkTransactionSchema,
    bulkDeleteSchema,
} from '../middleware/transactionValidation';

const router = Router();

// All transaction routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions with filtering and pagination
 * @access  Private
 */
router.get(
    '/',
    validateQuery(transactionFiltersSchema),
    transactionController.getTransactions
);

/**
 * @route   GET /api/transactions/stats
 * @desc    Get transaction statistics
 * @access  Private
 */
router.get('/stats', transactionController.getTransactionStats);

/**
 * @route   GET /api/transactions/export
 * @desc    Export transactions to CSV
 * @access  Private
 */
router.get('/export', transactionController.exportTransactions);

/**
 * @route   POST /api/transactions/import
 * @desc    Import transactions from CSV
 * @access  Private
 */
router.post('/import', transactionController.importTransactions);

/**
 * @route   POST /api/transactions/bulk
 * @desc    Create multiple transactions
 * @access  Private
 */
router.post(
    '/bulk',
    validateRequest(bulkTransactionSchema),
    transactionController.bulkCreateTransactions
);

/**
 * @route   DELETE /api/transactions/bulk
 * @desc    Delete multiple transactions
 * @access  Private
 */
router.delete(
    '/bulk',
    validateRequest(bulkDeleteSchema),
    transactionController.bulkDeleteTransactions
);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get transaction by ID
 * @access  Private
 */
router.get('/:id', transactionController.getTransactionById);

/**
 * @route   POST /api/transactions
 * @desc    Create new transaction
 * @access  Private
 */
router.post(
    '/',
    validateRequest(createTransactionSchema),
    transactionController.createTransaction
);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update transaction
 * @access  Private
 */
router.put(
    '/:id',
    validateRequest(updateTransactionSchema),
    transactionController.updateTransaction
);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete transaction
 * @access  Private
 */
router.delete('/:id', transactionController.deleteTransaction);

export default router;
