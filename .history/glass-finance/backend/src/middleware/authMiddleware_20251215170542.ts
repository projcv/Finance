import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { verifyToken } from '../utils/jwtUtils';
import { createError } from './errorHandler';

/**
 * Middleware to authenticate requests using JWT
 */
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError('No token provided', 401);
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const payload = verifyToken(token);

        // Attach user info to request
        req.user = payload;

        next();
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Token has expired') {
                return res.status(401).json({
                    success: false,
                    error: 'Token has expired',
                    code: 'TOKEN_EXPIRED',
                });
            }
            if (error.message === 'Invalid token') {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid token',
                    code: 'INVALID_TOKEN',
                });
            }
        }

        next(error);
    }
}

/**
 * Optional authentication - doesn't fail if no token provided
 */
export function optionalAuthenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = verifyToken(token);
            req.user = payload;
        }

        next();
    } catch {
        // Silently fail for optional auth
        next();
    }
}
