'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, fullWidth, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);
        const isPassword = type === 'password';
        const inputType = isPassword && showPassword ? 'text' : type;

        return (
            <div className={cn('space-y-2', fullWidth && 'w-full')}>
                {label && (
                    <label className="block text-sm font-medium text-white/90">
                        {label}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        className={cn(
                            'glass-input w-full',
                            leftIcon && 'pl-10',
                            (rightIcon || isPassword) && 'pr-10',
                            error && 'border-error-500 focus:ring-error-500',
                            className
                        )}
                        {...props}
                    />

                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}

                    {rightIcon && !isPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-error-400">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, fullWidth, ...props }, ref) => {
        return (
            <div className={cn('space-y-2', fullWidth && 'w-full')}>
                {label && (
                    <label className="block text-sm font-medium text-white/90">
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    className={cn(
                        'glass-input w-full min-h-[100px] resize-y',
                        error && 'border-error-500 focus:ring-error-500',
                        className
                    )}
                    {...props}
                />

                {error && (
                    <p className="text-sm text-error-400">{error}</p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
    fullWidth?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, fullWidth, ...props }, ref) => {
        return (
            <div className={cn('space-y-2', fullWidth && 'w-full')}>
                {label && (
                    <label className="block text-sm font-medium text-white/90">
                        {label}
                    </label>
                )}

                <select
                    ref={ref}
                    className={cn(
                        'glass-input w-full',
                        error && 'border-error-500 focus:ring-error-500',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-900">
                            {option.label}
                        </option>
                    ))}
                </select>

                {error && (
                    <p className="text-sm text-error-400">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
    const variantClasses = {
        default: 'bg-white/10 border-white/20 text-white',
        primary: 'bg-primary-500/20 border-primary-500/30 text-primary-400',
        success: 'bg-success-500/20 border-success-500/30 text-success-400',
        warning: 'bg-warning-500/20 border-warning-500/30 text-warning-400',
        error: 'bg-error-500/20 border-error-500/30 text-error-400',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    };

    return (
        <span
            className={cn(
                'badge',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
        >
            {children}
        </span>
    );
}

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
}

export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
    return (
        <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only"
                />
                <div
                    className={cn(
                        'w-11 h-6 rounded-full transition-colors',
                        checked ? 'bg-primary-500' : 'bg-white/20',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <div
                        className={cn(
                            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform',
                            checked && 'translate-x-5'
                        )}
                    />
                </div>
            </div>
            {label && (
                <span className="text-sm text-white/90">{label}</span>
            )}
        </label>
    );
}

export default Input;
