// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
    },
    TRANSACTIONS: {
        LIST: '/transactions',
        CREATE: '/transactions',
        UPDATE: (id: string) => `/transactions/${id}`,
        DELETE: (id: string) => `/transactions/${id}`,
        STATS: '/transactions/stats',
    },
    CATEGORIES: {
        LIST: '/categories',
        CREATE: '/categories',
        UPDATE: (id: string) => `/categories/${id}`,
        DELETE: (id: string) => `/categories/${id}`,
    },
    BUDGETS: {
        LIST: '/budgets',
        CREATE: '/budgets',
        UPDATE: (id: string) => `/budgets/${id}`,
        DELETE: (id: string) => `/budgets/${id}`,
    },
    USERS: {
        PROFILE: '/users/profile',
        UPDATE: '/users/profile',
    },
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
} as const;

// Budget Periods
export const BUDGET_PERIODS = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
} as const;

// Chart Colors
export const CHART_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308',
    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
];

// Default Category Icons
export const DEFAULT_ICONS = {
    INCOME: ['💰', '💵', '💸', '💳', '🏦', '📈', '💼'],
    EXPENSE: ['🛒', '🍔', '🚗', '🏠', '💡', '🎮', '📱', '✈️', '🏥', '📚'],
};

// Date Formats
export const DATE_FORMATS = {
    SHORT: 'MMM dd, yyyy',
    LONG: 'MMMM dd, yyyy',
    FULL: 'EEEE, MMMM dd, yyyy',
    TIME: 'HH:mm',
    DATETIME: 'MMM dd, yyyy HH:mm',
} as const;

// Pagination
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language',
} as const;

// Validation Rules
export const VALIDATION = {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_MIN_LENGTH: 6,
    NAME_MIN_LENGTH: 2,
    AMOUNT_MIN: 0.01,
    AMOUNT_MAX: 999999999,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
    INVALID_AMOUNT: 'Please enter a valid amount',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    SERVER_ERROR: 'Something went wrong. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
    TRANSACTION_CREATED: 'Transaction created successfully',
    TRANSACTION_UPDATED: 'Transaction updated successfully',
    TRANSACTION_DELETED: 'Transaction deleted successfully',
    CATEGORY_CREATED: 'Category created successfully',
    CATEGORY_UPDATED: 'Category updated successfully',
    CATEGORY_DELETED: 'Category deleted successfully',
    BUDGET_CREATED: 'Budget created successfully',
    BUDGET_UPDATED: 'Budget updated successfully',
    BUDGET_DELETED: 'Budget deleted successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
} as const;

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    TRANSACTIONS: '/transactions',
    CATEGORIES: '/categories',
    BUDGETS: '/budgets',
    PROFILE: '/profile',
    SETTINGS: '/settings',
} as const;
