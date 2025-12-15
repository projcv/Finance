/**
 * API Response wrapper type
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * User types
 */
export interface User {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Transaction types
 */
export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: TransactionType;
    date: Date;
    categoryId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Category types
 */
export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: TransactionType;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Budget types
 */
export type BudgetPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Budget {
    id: string;
    amount: number;
    period: BudgetPeriod;
    startDate: Date;
    endDate: Date;
    categoryId?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Auth types
 */
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
