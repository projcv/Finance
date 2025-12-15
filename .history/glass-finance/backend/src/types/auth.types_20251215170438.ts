import { Request } from 'express';

export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
    currency?: string;
    language?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface UpdateProfileRequest {
    username?: string;
    avatar?: string;
}

export interface UpdatePreferencesRequest {
    currency?: string;
    language?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface TokenPayload {
    userId: string;
    email: string;
    username: string;
}

export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

export interface UserResponse {
    id: string;
    email: string;
    username: string;
    avatar: string | null;
    currency: string;
    language: string;
    createdAt: Date;
}
