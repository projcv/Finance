import { PrismaClient } from '@prisma/client';
import {
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    subMonths,
    format,
    eachMonthOfInterval,
    eachDayOfInterval,
    eachWeekOfInterval,
    startOfWeek,
    endOfWeek,
} from 'date-fns';

const prisma = new PrismaClient();

interface DateRange {
    start: Date;
    end: Date;
}

interface CategoryAnalyticsFilters {
    startDate?: Date;
    endDate?: Date;
    type?: 'income' | 'expense';
}

interface CustomReportOptions {
    startDate?: Date;
    endDate?: Date;
    groupBy: 'category' | 'date' | 'paymentMethod';
    includeIncome: boolean;
    includeExpense: boolean;
    categoryIds?: string[];
}

/**
 * Get spending overview
 */
export async function getOverview(userId: string, startDate?: Date, endDate?: Date) {
    const start = startDate || startOfMonth(new Date());
    const end = endDate || endOfMonth(new Date());

    // Get all transactions in the period
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: start,
                lte: end,
            }
        },
        include: {
            category: {
                select: {
                    name: true,
                    icon: true,
                    color: true,
                }
            }
        }
    });

    // Calculate totals
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    // Get transaction counts
    const incomeCount = transactions.filter(t => t.type === 'income').length;
    const expenseCount = transactions.filter(t => t.type === 'expense').length;

    // Calculate averages
    const avgIncome = incomeCount > 0 ? income / incomeCount : 0;
    const avgExpense = expenseCount > 0 ? expenses / expenseCount : 0;

    // Get top spending categories
    const categoryTotals = new Map<string, { name: string; amount: number; count: number; icon: string; color: string }>();

    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            const existing = categoryTotals.get(t.categoryId) || {
                name: t.category.name,
                amount: 0,
                count: 0,
                icon: t.category.icon,
                color: t.category.color,
            };
            existing.amount += t.amount;
            existing.count += 1;
            categoryTotals.set(t.categoryId, existing);
        });

    const topCategories = Array.from(categoryTotals.entries())
        .map(([id, data]) => ({ categoryId: id, ...data }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    // Get previous period for comparison
    const periodLength = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - periodLength);
    const prevEnd = new Date(start.getTime() - 1);

    const prevTransactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: prevStart,
                lte: prevEnd,
            }
        }
    });

    const prevIncome = prevTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const prevExpenses = prevTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    // Calculate changes
    const incomeChange = prevIncome > 0 ? ((income - prevIncome) / prevIncome) * 100 : 0;
    const expenseChange = prevExpenses > 0 ? ((expenses - prevExpenses) / prevExpenses) * 100 : 0;

    return {
        period: {
            start,
            end,
        },
        summary: {
            income,
            expenses,
            balance,
            incomeCount,
            expenseCount,
            totalTransactions: transactions.length,
            avgIncome,
            avgExpense,
        },
        comparison: {
            incomeChange,
            expenseChange,
            previousPeriod: {
                income: prevIncome,
                expenses: prevExpenses,
            }
        },
        topCategories,
    };
}

/**
 * Get monthly analytics
 */
export async function getMonthlyAnalytics(userId: string, year?: number, month?: number) {
    const now = new Date();
    const targetYear = year || now.getFullYear();
    const targetMonth = month !== undefined ? month : now.getMonth();

    const start = new Date(targetYear, targetMonth, 1);
    const end = endOfMonth(start);

    // Get all transactions for the month
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: start,
                lte: end,
            }
        },
        include: {
            category: true,
        },
        orderBy: {
            date: 'asc'
        }
    });

    // Daily breakdown
    const days = eachDayOfInterval({ start, end });
    const dailyData = days.map(day => {
        const dayTransactions = transactions.filter(t => {
            const tDate = new Date(t.date);
            return tDate.getDate() === day.getDate();
        });

        const income = dayTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = dayTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            date: format(day, 'yyyy-MM-dd'),
            income,
            expenses,
            balance: income - expenses,
            transactionCount: dayTransactions.length,
        };
    });

    // Category breakdown
    const categoryMap = new Map<string, any>();
    transactions.forEach(t => {
        if (!categoryMap.has(t.categoryId)) {
            categoryMap.set(t.categoryId, {
                id: t.categoryId,
                name: t.category.name,
                icon: t.category.icon,
                color: t.category.color,
                income: 0,
                expenses: 0,
                count: 0,
            });
        }

        const cat = categoryMap.get(t.categoryId);
        if (t.type === 'income') {
            cat.income += t.amount;
        } else {
            cat.expenses += t.amount;
        }
        cat.count += 1;
    });

    const categories = Array.from(categoryMap.values())
        .sort((a, b) => (b.income + b.expenses) - (a.income + a.expenses));

    // Payment method breakdown
    const paymentMethods = new Map<string, { income: number; expenses: number; count: number }>();
    transactions.forEach(t => {
        const method = t.paymentMethod || 'Unknown';
        if (!paymentMethods.has(method)) {
            paymentMethods.set(method, { income: 0, expenses: 0, count: 0 });
        }

        const pm = paymentMethods.get(method)!;
        if (t.type === 'income') {
            pm.income += t.amount;
        } else {
            pm.expenses += t.amount;
        }
        pm.count += 1;
    });

    const paymentMethodData = Array.from(paymentMethods.entries())
        .map(([method, data]) => ({ method, ...data }))
        .sort((a, b) => (b.income + b.expenses) - (a.income + a.expenses));

    return {
        month: targetMonth + 1,
        year: targetYear,
        period: {
            start,
            end,
        },
        summary: {
            totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
            totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
            transactionCount: transactions.length,
        },
        dailyData,
        categories,
        paymentMethods: paymentMethodData,
    };
}

/**
 * Get category analytics
 */
export async function getCategoryAnalytics(userId: string, filters: CategoryAnalyticsFilters = {}) {
    const start = filters.startDate || startOfMonth(new Date());
    const end = filters.endDate || endOfMonth(new Date());

    const where: any = {
        userId,
        date: {
            gte: start,
            lte: end,
        }
    };

    if (filters.type) {
        where.type = filters.type;
    }

    const transactions = await prisma.transaction.findMany({
        where,
        include: {
            category: true,
        }
    });

    // Group by category
    const categoryMap = new Map<string, any>();

    transactions.forEach(t => {
        if (!categoryMap.has(t.categoryId)) {
            categoryMap.set(t.categoryId, {
                id: t.categoryId,
                name: t.category.name,
                icon: t.category.icon,
                color: t.category.color,
                type: t.category.type,
                total: 0,
                count: 0,
                avgAmount: 0,
                transactions: [],
            });
        }

        const cat = categoryMap.get(t.categoryId);
        cat.total += t.amount;
        cat.count += 1;
        cat.transactions.push({
            id: t.id,
            amount: t.amount,
            date: t.date,
            description: t.description,
        });
    });

    // Calculate percentages and averages
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    const categories = Array.from(categoryMap.values()).map(cat => ({
        ...cat,
        avgAmount: cat.total / cat.count,
        percentage: total > 0 ? (cat.total / total) * 100 : 0,
        transactions: cat.transactions.sort((a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        ).slice(0, 5), // Only include top 5 recent transactions
    })).sort((a, b) => b.total - a.total);

    return {
        period: {
            start,
            end,
        },
        total,
        transactionCount: transactions.length,
        categoryCount: categories.length,
        categories,
    };
}

/**
 * Get spending trends
 */
export async function getTrends(
    userId: string,
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
    limit: number = 12
) {
    const now = new Date();
    let intervals: Date[] = [];
    let startDate: Date;

    switch (period) {
        case 'daily':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - limit + 1);
            intervals = eachDayOfInterval({ start: startDate, end: now });
            break;
        case 'weekly':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - (limit * 7));
            intervals = eachWeekOfInterval({ start: startDate, end: now }).slice(-limit);
            break;
        case 'monthly':
            startDate = subMonths(now, limit - 1);
            intervals = eachMonthOfInterval({ start: startOfMonth(startDate), end: now });
            break;
        case 'yearly':
            startDate = new Date(now.getFullYear() - limit + 1, 0, 1);
            const years: Date[] = [];
            for (let i = 0; i < limit; i++) {
                years.push(new Date(now.getFullYear() - limit + 1 + i, 0, 1));
            }
            intervals = years;
            break;
    }

    const trends = await Promise.all(intervals.map(async (date) => {
        let periodStart: Date;
        let periodEnd: Date;
        let label: string;

        switch (period) {
            case 'daily':
                periodStart = new Date(date);
                periodStart.setHours(0, 0, 0, 0);
                periodEnd = new Date(date);
                periodEnd.setHours(23, 59, 59, 999);
                label = format(date, 'MMM dd');
                break;
            case 'weekly':
                periodStart = startOfWeek(date);
                periodEnd = endOfWeek(date);
                label = format(periodStart, 'MMM dd');
                break;
            case 'monthly':
                periodStart = startOfMonth(date);
                periodEnd = endOfMonth(date);
                label = format(date, 'MMM yyyy');
                break;
            case 'yearly':
                periodStart = startOfYear(date);
                periodEnd = endOfYear(date);
                label = format(date, 'yyyy');
                break;
            default:
                periodStart = date;
                periodEnd = date;
                label = format(date, 'MMM dd');
        }

        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: periodStart,
                    lte: periodEnd,
                }
            }
        });

        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            period: label,
            date: periodStart,
            income,
            expenses,
            balance: income - expenses,
            transactionCount: transactions.length,
        };
    }));

    // Calculate trend direction
    const recentExpenses = trends.slice(-3).map(t => t.expenses);
    const avgRecent = recentExpenses.reduce((sum, e) => sum + e, 0) / recentExpenses.length;
    const olderExpenses = trends.slice(0, 3).map(t => t.expenses);
    const avgOlder = olderExpenses.reduce((sum, e) => sum + e, 0) / olderExpenses.length;

    const trendDirection = avgRecent > avgOlder ? 'increasing' : avgRecent < avgOlder ? 'decreasing' : 'stable';
    const trendPercentage = avgOlder > 0 ? ((avgRecent - avgOlder) / avgOlder) * 100 : 0;

    return {
        period,
        trends,
        analysis: {
            direction: trendDirection,
            changePercentage: trendPercentage,
            averageIncome: trends.reduce((sum, t) => sum + t.income, 0) / trends.length,
            averageExpenses: trends.reduce((sum, t) => sum + t.expenses, 0) / trends.length,
        }
    };
}

/**
 * Compare two periods
 */
export async function getComparison(userId: string, period1: DateRange, period2: DateRange) {
    const [transactions1, transactions2] = await Promise.all([
        prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: period1.start,
                    lte: period1.end,
                }
            },
            include: {
                category: true,
            }
        }),
        prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: period2.start,
                    lte: period2.end,
                }
            },
            include: {
                category: true,
            }
        })
    ]);

    const calculateStats = (transactions: any[]) => {
        const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

        const categoryMap = new Map<string, number>();
        transactions.filter(t => t.type === 'expense').forEach(t => {
            categoryMap.set(t.category.name, (categoryMap.get(t.category.name) || 0) + t.amount);
        });

        return {
            income,
            expenses,
            balance: income - expenses,
            transactionCount: transactions.length,
            avgTransaction: transactions.length > 0 ?
                transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length : 0,
            topCategory: categoryMap.size > 0 ?
                Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1])[0] : null,
        };
    };

    const stats1 = calculateStats(transactions1);
    const stats2 = calculateStats(transactions2);

    const calculateChange = (val1: number, val2: number) => {
        if (val2 === 0) return 0;
        return ((val1 - val2) / val2) * 100;
    };

    return {
        period1: {
            range: period1,
            stats: stats1,
        },
        period2: {
            range: period2,
            stats: stats2,
        },
        comparison: {
            incomeChange: calculateChange(stats1.income, stats2.income),
            expenseChange: calculateChange(stats1.expenses, stats2.expenses),
            balanceChange: calculateChange(stats1.balance, stats2.balance),
            transactionCountChange: calculateChange(stats1.transactionCount, stats2.transactionCount),
        }
    };
}

/**
 * Forecast future spending
 */
export async function getForecast(userId: string, months: number = 3) {
    // Get historical data (last 6 months)
    const now = new Date();
    const historicalStart = subMonths(now, 6);

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: historicalStart,
                lte: now,
            }
        }
    });

    // Calculate monthly averages
    const monthlyData = new Map<string, { income: number; expenses: number; count: number }>();

    transactions.forEach(t => {
        const monthKey = format(new Date(t.date), 'yyyy-MM');
        if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, { income: 0, expenses: 0, count: 0 });
        }

        const data = monthlyData.get(monthKey)!;
        if (t.type === 'income') {
            data.income += t.amount;
        } else {
            data.expenses += t.amount;
        }
        data.count += 1;
    });

    const monthlyValues = Array.from(monthlyData.values());
    const avgIncome = monthlyValues.reduce((sum, m) => sum + m.income, 0) / monthlyValues.length;
    const avgExpenses = monthlyValues.reduce((sum, m) => sum + m.expenses, 0) / monthlyValues.length;

    // Calculate trend (simple linear regression)
    const expenseValues = monthlyValues.map(m => m.expenses);
    const trend = expenseValues.length > 1 ?
        (expenseValues[expenseValues.length - 1] - expenseValues[0]) / expenseValues.length : 0;

    // Generate forecast
    const forecast: Array<{
        month: string;
        date: Date;
        projectedIncome: number;
        projectedExpenses: number;
        projectedBalance: number;
        confidence: number;
    }> = [];
    for (let i = 1; i <= months; i++) {
        const forecastDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const projectedExpenses = avgExpenses + (trend * i);
        const projectedIncome = avgIncome; // Assume stable income

        forecast.push({
            month: format(forecastDate, 'MMM yyyy'),
            date: forecastDate,
            projectedIncome,
            projectedExpenses,
            projectedBalance: projectedIncome - projectedExpenses,
            confidence: Math.max(0.5, 1 - (i * 0.1)), // Confidence decreases over time
        });
    }

    return {
        historical: {
            months: monthlyValues.length,
            avgIncome,
            avgExpenses,
            trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
        },
        forecast,
    };
}

/**
 * Generate custom report
 */
export async function getCustomReport(userId: string, options: CustomReportOptions) {
    const start = options.startDate || startOfMonth(new Date());
    const end = options.endDate || endOfMonth(new Date());

    const where: any = {
        userId,
        date: {
            gte: start,
            lte: end,
        }
    };

    const types: string[] = [];
    if (options.includeIncome) types.push('income');
    if (options.includeExpense) types.push('expense');

    if (types.length > 0) {
        where.type = { in: types };
    }

    if (options.categoryIds && options.categoryIds.length > 0) {
        where.categoryId = { in: options.categoryIds };
    }

    const transactions = await prisma.transaction.findMany({
        where,
        include: {
            category: true,
        },
        orderBy: {
            date: 'desc'
        }
    });

    let groupedData: any[] = [];

    switch (options.groupBy) {
        case 'category':
            const categoryMap = new Map<string, any>();
            transactions.forEach(t => {
                if (!categoryMap.has(t.categoryId)) {
                    categoryMap.set(t.categoryId, {
                        id: t.categoryId,
                        name: t.category.name,
                        icon: t.category.icon,
                        color: t.category.color,
                        income: 0,
                        expenses: 0,
                        count: 0,
                        transactions: [],
                    });
                }

                const cat = categoryMap.get(t.categoryId);
                if (t.type === 'income') {
                    cat.income += t.amount;
                } else {
                    cat.expenses += t.amount;
                }
                cat.count += 1;
                cat.transactions.push(t);
            });

            groupedData = Array.from(categoryMap.values())
                .sort((a, b) => (b.income + b.expenses) - (a.income + a.expenses));
            break;

        case 'date':
            const dateMap = new Map<string, any>();
            transactions.forEach(t => {
                const dateKey = format(new Date(t.date), 'yyyy-MM-dd');
                if (!dateMap.has(dateKey)) {
                    dateMap.set(dateKey, {
                        date: dateKey,
                        income: 0,
                        expenses: 0,
                        count: 0,
                        transactions: [],
                    });
                }

                const day = dateMap.get(dateKey);
                if (t.type === 'income') {
                    day.income += t.amount;
                } else {
                    day.expenses += t.amount;
                }
                day.count += 1;
                day.transactions.push(t);
            });

            groupedData = Array.from(dateMap.values())
                .sort((a, b) => b.date.localeCompare(a.date));
            break;

        case 'paymentMethod':
            const methodMap = new Map<string, any>();
            transactions.forEach(t => {
                const method = t.paymentMethod || 'Unknown';
                if (!methodMap.has(method)) {
                    methodMap.set(method, {
                        method,
                        income: 0,
                        expenses: 0,
                        count: 0,
                        transactions: [],
                    });
                }

                const pm = methodMap.get(method);
                if (t.type === 'income') {
                    pm.income += t.amount;
                } else {
                    pm.expenses += t.amount;
                }
                pm.count += 1;
                pm.transactions.push(t);
            });

            groupedData = Array.from(methodMap.values())
                .sort((a, b) => (b.income + b.expenses) - (a.income + a.expenses));
            break;
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return {
        period: {
            start,
            end,
        },
        options,
        summary: {
            totalIncome,
            totalExpenses,
            balance: totalIncome - totalExpenses,
            transactionCount: transactions.length,
        },
        data: groupedData,
    };
}
