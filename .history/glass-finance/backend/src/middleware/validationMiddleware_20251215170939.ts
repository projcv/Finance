import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

/**
 * Validation schemas
 */
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be at most 30 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    currency: z.string().optional(),
    language: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateProfileSchema = z.object({
    username: z.string().min(3).max(30).optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
});

export const updatePreferencesSchema = z.object({
    currency: z.string().optional(),
    language: z.string().optional(),
});

/**
 * Middleware to validate request body against a Zod schema
 */
export function validateRequest(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: error.errors.map((err: z.ZodIssue) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            next(error);
        }
    };
}

/**
 * Middleware to validate query parameters
 */
export function validateQuery(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: error.errors.map((err: z.ZodIssue) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            next(error);
        }
    };
}
