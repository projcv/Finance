import express from 'express';
import * as budgetController from '../controllers/budgetController';
import { authenticate } from '../middleware/authMiddleware';
import { body, param, query, validationResult } from 'express-validator';

// Validation middleware
const validateRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/v1/budgets
 * @desc    Get all budgets with optional filters
 * @access  Private
 */
router.get(
    '/',
    [
        query('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']),
        query('categoryId').optional().isString(),
        query('active').optional().isBoolean(),
    ],
    validateRequest,
    budgetController.getBudgets
);

/**
 * @route   GET /api/v1/budgets/insights
 * @desc    Get budget insights and recommendations
 * @access  Private
 */
router.get(
    '/insights',
    budgetController.getBudgetInsights
);

/**
 * @route   GET /api/v1/budgets/:id
 * @desc    Get budget by ID
 * @access  Private
 */
router.get(
    '/:id',
    [
        param('id').isString().notEmpty(),
    ],
    validateRequest,
    budgetController.getBudgetById
);

/**
 * @route   GET /api/v1/budgets/:id/progress
 * @desc    Get budget progress
 * @access  Private
 */
router.get(
    '/:id/progress',
    [
        param('id').isString().notEmpty(),
    ],
    validateRequest,
    budgetController.getBudgetProgress
);

/**
 * @route   POST /api/v1/budgets
 * @desc    Create new budget
 * @access  Private
 */
router.post(
    '/',
    [
        body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
        body('period').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid period'),
        body('startDate').isISO8601().withMessage('Invalid start date'),
        body('endDate').optional().isISO8601().withMessage('Invalid end date'),
        body('categoryId').optional().isString(),
        body('notificationsEnabled').optional().isBoolean(),
    ],
    validateRequest,
    budgetController.createBudget
);

/**
 * @route   PUT /api/v1/budgets/:id
 * @desc    Update budget
 * @access  Private
 */
router.put(
    '/:id',
    [
        param('id').isString().notEmpty(),
        body('amount').optional().isFloat({ min: 0.01 }),
        body('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']),
        body('startDate').optional().isISO8601(),
        body('endDate').optional().isISO8601(),
        body('categoryId').optional().isString(),
        body('notificationsEnabled').optional().isBoolean(),
    ],
    validateRequest,
    budgetController.updateBudget
);

/**
 * @route   DELETE /api/v1/budgets/:id
 * @desc    Delete budget
 * @access  Private
 */
router.delete(
    '/:id',
    [
        param('id').isString().notEmpty(),
    ],
    validateRequest,
    budgetController.deleteBudget
);

export default router;
