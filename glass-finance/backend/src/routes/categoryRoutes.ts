import { Router } from 'express';
import * as categoryController from '../controllers/categoryController';
import { authenticate } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import {
    createCategorySchema,
    updateCategorySchema,
} from '../middleware/transactionValidation';

const router = Router();

// All category routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Private
 */
router.get('/', categoryController.getCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Private
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @route   GET /api/categories/:id/stats
 * @desc    Get category statistics
 * @access  Private
 */
router.get('/:id/stats', categoryController.getCategoryStats);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private
 */
router.post(
    '/',
    validateRequest(createCategorySchema),
    categoryController.createCategory
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private
 */
router.put(
    '/:id',
    validateRequest(updateCategorySchema),
    categoryController.updateCategory
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private
 */
router.delete('/:id', categoryController.deleteCategory);

export default router;
