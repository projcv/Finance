'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    variant?: 'light' | 'medium' | 'dark';
    onClick?: () => void;
}

export function GlassCard({
    children,
    className,
    hover = false,
    glow = false,
    variant = 'light',
    onClick,
}: GlassCardProps) {
    const variantClasses = {
        light: 'bg-white/10',
        medium: 'bg-white/15',
        dark: 'bg-black/10',
    };

    return (
        <div
            className={cn(
                'backdrop-blur-lg',
                'border border-white/20',
                'rounded-2xl',
                'shadow-glass',
                'transition-all duration-300',
                variantClasses[variant],
                hover && 'hover:bg-white/15 hover:border-white/30 hover:shadow-glass-lg card-lift',
                glow && 'shadow-glow',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

interface GlassContainerProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassContainer({ children, className }: GlassContainerProps) {
    return (
        <div
            className={cn(
                'backdrop-blur-xl',
                'bg-gradient-to-br from-white/10 to-white/5',
                'border border-white/20',
                'rounded-3xl',
                'shadow-glass-xl',
                'p-6',
                className
            )}
        >
            {children}
        </div>
    );
}

interface GlassPanelProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export function GlassPanel({ children, className, title, subtitle, action }: GlassPanelProps) {
    return (
        <GlassCard className={cn('p-6', className)}>
            {(title || subtitle || action) && (
                <div className="mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            {title && (
                                <h3 className="text-xl font-semibold text-white mb-1">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-sm text-white/70">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {action && <div>{action}</div>}
                    </div>
                </div>
            )}
            {children}
        </GlassCard>
    );
}

interface GlassStatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function GlassStatCard({ label, value, icon, trend, className }: GlassStatCardProps) {
    return (
        <GlassCard className={cn('p-6', className)} hover>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-white/70 mb-2">{label}</p>
                    <p className="text-3xl font-bold text-white mb-2">{value}</p>
                    {trend && (
                        <div className={cn(
                            'flex items-center gap-1 text-sm font-medium',
                            trend.isPositive ? 'text-success-400' : 'text-error-400'
                        )}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="p-3 rounded-xl bg-white/10">
                        {icon}
                    </div>
                )}
            </div>
        </GlassCard>
    );
}

export default GlassCard;
