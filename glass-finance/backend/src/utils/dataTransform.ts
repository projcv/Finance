/**
 * Format currency value
 */
export function formatCurrency(amount: number, currency: string = 'VND'): string {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
}

/**
 * Round to 2 decimal places
 */
export function roundToTwo(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Map<any, T[]> {
    return array.reduce((map, item) => {
        const groupKey = item[key];
        const group = map.get(groupKey) || [];
        group.push(item);
        map.set(groupKey, group);
        return map;
    }, new Map<any, T[]>());
}

/**
 * Calculate sum of array
 */
export function sum(array: number[]): number {
    return array.reduce((total, value) => total + value, 0);
}

/**
 * Calculate average of array
 */
export function average(array: number[]): number {
    if (array.length === 0) return 0;
    return sum(array) / array.length;
}

/**
 * Calculate median of array
 */
export function median(array: number[]): number {
    if (array.length === 0) return 0;

    const sorted = [...array].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }

    return sorted[mid];
}

/**
 * Get date range for period
 */
export function getDateRangeForPeriod(period: 'daily' | 'weekly' | 'monthly' | 'yearly', date: Date = new Date()): { start: Date; end: Date } {
    const start = new Date(date);
    const end = new Date(date);

    switch (period) {
        case 'daily':
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'weekly':
            const dayOfWeek = start.getDay();
            start.setDate(start.getDate() - dayOfWeek);
            start.setHours(0, 0, 0, 0);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            break;
        case 'monthly':
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(end.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case 'yearly':
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);
            end.setMonth(11, 31);
            end.setHours(23, 59, 59, 999);
            break;
    }

    return { start, end };
}

/**
 * Format date range
 */
export function formatDateRange(start: Date, end: Date): string {
    const startStr = start.toLocaleDateString('vi-VN');
    const endStr = end.toLocaleDateString('vi-VN');
    return `${startStr} - ${endStr}`;
}

/**
 * Simple moving average
 */
export function simpleMovingAverage(data: number[], period: number): number[] {
    const result: number[] = [];

    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push(0);
        } else {
            const slice = data.slice(i - period + 1, i + 1);
            result.push(average(slice));
        }
    }

    return result;
}

/**
 * Linear regression for trend analysis
 */
export function linearRegression(data: number[]): { slope: number; intercept: number; predict: (x: number) => number } {
    const n = data.length;

    if (n === 0) {
        return {
            slope: 0,
            intercept: 0,
            predict: () => 0,
        };
    }

    const xValues = Array.from({ length: n }, (_, i) => i);
    const yValues = data;

    const sumX = sum(xValues);
    const sumY = sum(yValues);
    const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
    const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
        slope,
        intercept,
        predict: (x: number) => slope * x + intercept,
    };
}

/**
 * Sanitize data for CSV export
 */
export function sanitizeForCSV(value: any): string {
    if (value === null || value === undefined) return '';

    const str = String(value);

    // Escape quotes and wrap in quotes if contains comma, newline, or quote
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
    }

    return str;
}

/**
 * Convert object to CSV row
 */
export function objectToCSVRow(obj: Record<string, any>, headers: string[]): string {
    return headers.map(header => sanitizeForCSV(obj[header])).join(',');
}

/**
 * Convert array of objects to CSV
 */
export function arrayToCSV(data: Record<string, any>[], headers?: string[]): string {
    if (data.length === 0) return '';

    const csvHeaders = headers || Object.keys(data[0]);
    const headerRow = csvHeaders.join(',');
    const dataRows = data.map(obj => objectToCSVRow(obj, csvHeaders));

    return [headerRow, ...dataRows].join('\n');
}

/**
 * Parse date safely
 */
export function parseDate(dateString: string | Date): Date {
    if (dateString instanceof Date) return dateString;

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date: ${dateString}`);
    }

    return date;
}

/**
 * Get fiscal quarter
 */
export function getFiscalQuarter(date: Date): number {
    const month = date.getMonth();
    return Math.floor(month / 3) + 1;
}

/**
 * Format number with abbreviation (K, M, B)
 */
export function formatNumberAbbreviation(num: number): string {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}
