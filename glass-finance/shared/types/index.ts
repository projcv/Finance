// Shared types between frontend and backend

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    type: 'income' | 'expense';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Transaction {
    id: string;
    amount: number;
    description?: string;
    type: 'income' | 'expense';
    date: Date;
    categoryId: string;
    category?: Category;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Budget {
    id: string;
    amount: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;
    categoryId?: string;
    category?: Category;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// API Request/Response types
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

export interface CreateTransactionRequest {
    amount: number;
    description?: string;
    type: 'income' | 'expense';
    date: Date;
    categoryId: string;
}

export interface UpdateTransactionRequest extends Partial<CreateTransactionRequest> {
    id: string;
}

export interface CreateCategoryRequest {
    name: string;
    icon: string;
    color: string;
    type: 'income' | 'expense';
}

export interface CreateBudgetRequest {
    amount: number;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;
    categoryId?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Statistics types
export interface TransactionStats {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
}

export interface CategoryStats {
    categoryId: string;
    categoryName: string;
    total: number;
    percentage: number;
    transactionCount: number;
}

export interface MonthlyStats {
    month: string;
    income: number;
    expense: number;
    balance: number;
}
