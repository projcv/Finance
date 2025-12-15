'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export function Button({
    children,
    className,
    variant = 'glass',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    ...props
}: ButtonProps) {
    const baseClasses = cn(
        'inline-flex items-center justify-center',
        'font-medium',
        'rounded-xl',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95',
        fullWidth && 'w-full'
    );

    const variantClasses = {
        primary: cn(
            'bg-gradient-to-r from-primary-500 to-primary-600',
            'text-white',
            'hover:from-primary-600 hover:to-primary-700',
            'shadow-lg shadow-primary-500/30',
            'focus:ring-primary-500'
        ),
        secondary: cn(
            'bg-gradient-to-r from-secondary-500 to-secondary-600',
            'text-white',
            'hover:from-secondary-600 hover:to-secondary-700',
            'shadow-lg shadow-secondary-500/30',
            'focus:ring-secondary-500'
        ),
        success: cn(
            'bg-gradient-to-r from-success-500 to-success-600',
            'text-white',
            'hover:from-success-600 hover:to-success-700',
            'shadow-lg shadow-success-500/30',
            'focus:ring-success-500'
        ),
        error: cn(
            'bg-gradient-to-r from-error-500 to-error-600',
            'text-white',
            'hover:from-error-600 hover:to-error-700',
            'shadow-lg shadow-error-500/30',
            'focus:ring-error-500'
        ),
        ghost: cn(
            'bg-transparent',
            'text-white',
            'hover:bg-white/10',
            'focus:ring-white/50'
        ),
        glass: cn(
            'backdrop-blur-md',
            'bg-white/10',
            'border border-white/20',
            'text-white',
            'hover:bg-white/20',
            'hover:border-white/30',
            'hover:shadow-glow',
            'focus:ring-white/50'
        ),
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-4 py-2.5 text-base gap-2',
        lg: 'px-6 py-3 text-lg gap-2.5',
        xl: 'px-8 py-4 text-xl gap-3',
    };

    return (
        <button
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
            ) : leftIcon ? (
                <span className="flex-shrink-0">{leftIcon}</span>
            ) : null}

            {children}

            {!isLoading && rightIcon && (
                <span className="flex-shrink-0">{rightIcon}</span>
            )}
        </button>
    );
}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'error' | 'ghost' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function IconButton({
    icon,
    className,
    variant = 'glass',
    size = 'md',
    isLoading = false,
    disabled,
    ...props
}: IconButtonProps) {
    const baseClasses = cn(
        'inline-flex items-center justify-center',
        'rounded-xl',
        'transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-95'
    );

    const variantClasses = {
        primary: cn(
            'bg-gradient-to-r from-primary-500 to-primary-600',
            'text-white',
            'hover:from-primary-600 hover:to-primary-700',
            'shadow-lg shadow-primary-500/30',
            'focus:ring-primary-500'
        ),
        secondary: cn(
            'bg-gradient-to-r from-secondary-500 to-secondary-600',
            'text-white',
            'hover:from-secondary-600 hover:to-secondary-700',
            'shadow-lg shadow-secondary-500/30',
            'focus:ring-secondary-500'
        ),
        success: cn(
            'bg-gradient-to-r from-success-500 to-success-600',
            'text-white',
            'hover:from-success-600 hover:to-success-700',
            'shadow-lg shadow-success-500/30',
            'focus:ring-success-500'
        ),
        error: cn(
            'bg-gradient-to-r from-error-500 to-error-600',
            'text-white',
            'hover:from-error-600 hover:to-error-700',
            'shadow-lg shadow-error-500/30',
            'focus:ring-error-500'
        ),
        ghost: cn(
            'bg-transparent',
            'text-white',
            'hover:bg-white/10',
            'focus:ring-white/50'
        ),
        glass: cn(
            'backdrop-blur-md',
            'bg-white/10',
            'border border-white/20',
            'text-white',
            'hover:bg-white/20',
            'hover:border-white/30',
            'hover:shadow-glow',
            'focus:ring-white/50'
        ),
    };

    const sizeClasses = {
        sm: 'p-2',
        md: 'p-2.5',
        lg: 'p-3',
    };

    return (
        <button
            className={cn(
                baseClasses,
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />
            ) : (
                icon
            )}
        </button>
    );
}

export default Button;
