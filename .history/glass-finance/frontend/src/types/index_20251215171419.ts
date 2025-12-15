// Re-export shared types
export * from './shared';

// Frontend-specific types
export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface TransactionFilters {
    type?: 'income' | 'expense';
    categoryId?: string;
    startDate?: Date;
    endDate?: Date;
    minAmount?: number;
    maxAmount?: number;
}

export interface DashboardStats {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
    categoryStats: CategoryStats[];
    monthlyStats: MonthlyStats[];
}

import type { User, CategoryStats, MonthlyStats } from './shared';
