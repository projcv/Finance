import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';
import {
    updateProfileSchema,
    updatePreferencesSchema,
} from '../middleware/validationMiddleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', validateRequest(updateProfileSchema), userController.updateProfile);

/**
 * @route   PUT /api/users/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/preferences', validateRequest(updatePreferencesSchema), userController.updatePreferences);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', userController.deleteAccount);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', userController.getUserStats);

export default router;
