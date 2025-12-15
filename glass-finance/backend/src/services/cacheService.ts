/**
 * Simple in-memory cache implementation
 * In production, this should be replaced with Redis
 */

interface CacheEntry {
    value: any;
    expiresAt: number;
}

class CacheService {
    private cache: Map<string, CacheEntry>;
    private cleanupInterval: NodeJS.Timeout | null;

    constructor() {
        this.cache = new Map();
        this.cleanupInterval = null;
        this.startCleanup();
    }

    /**
     * Start automatic cleanup of expired entries
     */
    private startCleanup() {
        // Clean up expired entries every minute
        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, 60000);
    }

    /**
     * Clean up expired entries
     */
    private cleanup() {
        const now = Date.now();
        const keysToDelete: string[] = [];

        this.cache.forEach((entry, key) => {
            if (entry.expiresAt < now) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.cache.delete(key));

        if (keysToDelete.length > 0) {
            console.log(`[Cache] Cleaned up ${keysToDelete.length} expired entries`);
        }
    }

    /**
     * Set a value in cache
     */
    set(key: string, value: any, ttlSeconds: number = 300): void {
        const expiresAt = Date.now() + (ttlSeconds * 1000);
        this.cache.set(key, { value, expiresAt });
    }

    /**
     * Get a value from cache
     */
    get<T = any>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        // Check if expired
        if (entry.expiresAt < Date.now()) {
            this.cache.delete(key);
            return null;
        }

        return entry.value as T;
    }

    /**
     * Delete a value from cache
     */
    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    /**
     * Delete all keys matching a pattern
     */
    deletePattern(pattern: string): number {
        const regex = new RegExp(pattern.replace('*', '.*'));
        const keysToDelete: string[] = [];

        this.cache.forEach((_, key) => {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.cache.delete(key));
        return keysToDelete.length;
    }

    /**
     * Check if key exists
     */
    has(key: string): boolean {
        const entry = this.cache.get(key);

        if (!entry) {
            return false;
        }

        // Check if expired
        if (entry.expiresAt < Date.now()) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache size
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * Get or set pattern - get from cache or compute and cache
     */
    async getOrSet<T>(
        key: string,
        factory: () => Promise<T>,
        ttlSeconds: number = 300
    ): Promise<T> {
        const cached = this.get<T>(key);

        if (cached !== null) {
            return cached;
        }

        const value = await factory();
        this.set(key, value, ttlSeconds);
        return value;
    }

    /**
     * Increment a numeric value
     */
    increment(key: string, amount: number = 1): number {
        const current = this.get<number>(key) || 0;
        const newValue = current + amount;
        this.set(key, newValue);
        return newValue;
    }

    /**
     * Decrement a numeric value
     */
    decrement(key: string, amount: number = 1): number {
        return this.increment(key, -amount);
    }

    /**
     * Stop cleanup interval
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
        this.clear();
    }
}

// Export singleton instance
export const cache = new CacheService();

/**
 * Cache key generators
 */
export const CacheKeys = {
    // Budget cache keys
    budgets: (userId: string) => `budgets:${userId}`,
    budget: (userId: string, budgetId: string) => `budget:${userId}:${budgetId}`,
    budgetProgress: (userId: string, budgetId: string) => `budget:progress:${userId}:${budgetId}`,
    budgetInsights: (userId: string) => `budget:insights:${userId}`,

    // Analytics cache keys
    analyticsOverview: (userId: string, start: string, end: string) =>
        `analytics:overview:${userId}:${start}:${end}`,
    analyticsMonthly: (userId: string, year: number, month: number) =>
        `analytics:monthly:${userId}:${year}:${month}`,
    analyticsCategory: (userId: string, start: string, end: string, type?: string) =>
        `analytics:category:${userId}:${start}:${end}:${type || 'all'}`,
    analyticsTrends: (userId: string, period: string, limit: number) =>
        `analytics:trends:${userId}:${period}:${limit}`,
    analyticsForecast: (userId: string, months: number) =>
        `analytics:forecast:${userId}:${months}`,

    // Transaction cache keys
    transactions: (userId: string) => `transactions:${userId}`,
    transactionStats: (userId: string, start?: string, end?: string) =>
        `transaction:stats:${userId}:${start || 'all'}:${end || 'all'}`,

    // User pattern - invalidate all user caches
    userPattern: (userId: string) => `*:${userId}:*`,
};

/**
 * Cache TTL constants (in seconds)
 */
export const CacheTTL = {
    SHORT: 60,           // 1 minute
    MEDIUM: 300,         // 5 minutes
    LONG: 1800,          // 30 minutes
    VERY_LONG: 3600,     // 1 hour
    DAY: 86400,          // 24 hours
};

export default cache;
