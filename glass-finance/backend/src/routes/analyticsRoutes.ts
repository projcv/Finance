import express from 'express';
import * as analyticsController from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';
import { query, validationResult } from 'express-validator';

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
 * @route   GET /api/v1/analytics/overview
 * @desc    Get spending overview
 * @access  Private
 */
router.get(
    '/overview',
    [
        query('startDate').optional().isISO8601(),
        query('endDate').optional().isISO8601(),
    ],
    validateRequest,
    analyticsController.getOverview
);

/**
 * @route   GET /api/v1/analytics/monthly
 * @desc    Get monthly analytics
 * @access  Private
 */
router.get(
    '/monthly',
    [
        query('year').optional().isInt({ min: 2000, max: 2100 }),
        query('month').optional().isInt({ min: 0, max: 11 }),
    ],
    validateRequest,
    analyticsController.getMonthlyAnalytics
);

/**
 * @route   GET /api/v1/analytics/category
 * @desc    Get category analytics
 * @access  Private
 */
router.get(
    '/category',
    [
        query('startDate').optional().isISO8601(),
        query('endDate').optional().isISO8601(),
        query('type').optional().isIn(['income', 'expense']),
    ],
    validateRequest,
    analyticsController.getCategoryAnalytics
);

/**
 * @route   GET /api/v1/analytics/trends
 * @desc    Get spending trends
 * @access  Private
 */
router.get(
    '/trends',
    [
        query('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']),
        query('limit').optional().isInt({ min: 1, max: 365 }),
    ],
    validateRequest,
    analyticsController.getTrends
);

/**
 * @route   GET /api/v1/analytics/comparison
 * @desc    Compare two periods
 * @access  Private
 */
router.get(
    '/comparison',
    [
        query('period1Start').isISO8601().withMessage('Period 1 start date is required'),
        query('period1End').isISO8601().withMessage('Period 1 end date is required'),
        query('period2Start').isISO8601().withMessage('Period 2 start date is required'),
        query('period2End').isISO8601().withMessage('Period 2 end date is required'),
    ],
    validateRequest,
    analyticsController.getComparison
);

/**
 * @route   GET /api/v1/analytics/forecast
 * @desc    Get spending forecast
 * @access  Private
 */
router.get(
    '/forecast',
    [
        query('months').optional().isInt({ min: 1, max: 12 }),
    ],
    validateRequest,
    analyticsController.getForecast
);

/**
 * @route   GET /api/v1/analytics/reports
 * @desc    Generate custom report
 * @access  Private
 */
router.get(
    '/reports',
    [
        query('startDate').optional().isISO8601(),
        query('endDate').optional().isISO8601(),
        query('groupBy').optional().isIn(['category', 'date', 'paymentMethod']),
        query('includeIncome').optional().isBoolean(),
        query('includeExpense').optional().isBoolean(),
        query('categories').optional().isString(),
    ],
    validateRequest,
    analyticsController.getCustomReport
);

export default router;
