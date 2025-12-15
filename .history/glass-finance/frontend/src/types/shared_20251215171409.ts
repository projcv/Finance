// User types
export interface User {
    id: string;
    email: string;
    username: string;
    avatar: string | null;
    currency: string;
    language: string;
    createdAt: Date;
    updatedAt: Date;
}

// Transaction types
export interface Transaction {
    id: string;
    userId: string;
    amount: number;
    categoryId: string;
    description: string | null;
    date: Date;
    type: 'income' | 'expense';
    paymentMethod: string | null;
    location: string | null;
    attachments: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Category types
export interface Category {
    id: string;
    userId: string;
    name: string;
    icon: string;
    color: string;
    type: 'income' | 'expense' | 'both';
    parentId: string | null;
}

// Budget types
export interface Budget {
    id: string;
    userId: string;
    categoryId: string | null;
    amount: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date | null;
    notificationsEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Stats types
export interface CategoryStats {
    categoryId: string;
    categoryName: string;
    total: number;
    count: number;
    percentage: number;
}

export interface MonthlyStats {
    month: string;
    income: number;
    expense: number;
    balance: number;
}

// API Response type
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Auth types
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}
