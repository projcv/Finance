import jwt from 'jsonwebtoken';
import { TokenPayload, AuthTokens } from '../types/auth.types';
import { config } from '../config';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate access and refresh tokens
 */
export function generateTokens(payload: TokenPayload): AuthTokens {
    const accessToken = jwt.sign(payload, config.jwtSecret, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    const refreshToken = jwt.sign(payload, config.jwtSecret, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    return { accessToken, refreshToken };
}

/**
 * Generate only access token
 */
export function generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
}

/**
 * Verify and decode a token
 */
export function verifyToken(token: string): TokenPayload {
    try {
        return jwt.verify(token, config.jwtSecret) as TokenPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token has expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw new Error('Token verification failed');
    }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): TokenPayload | null {
    try {
        return jwt.decode(token) as TokenPayload;
    } catch {
        return null;
    }
}
