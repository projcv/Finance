import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validateRequest } from '../middleware/validationMiddleware';
import {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
} from '../middleware/validationMiddleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRequest(registerSchema), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get tokens
 * @access  Public
 */
router.post('/login', validateRequest(loginSchema), authController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', validateRequest(refreshTokenSchema), authController.refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

/**
 * @route   GET /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.get('/verify-email', authController.verifyEmail);

export default router;
