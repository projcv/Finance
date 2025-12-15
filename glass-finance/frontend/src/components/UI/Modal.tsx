'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { IconButton } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        full: 'max-w-full mx-4',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-overlay animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={cn(
                    'relative w-full',
                    'modal-content',
                    'animate-slide-in',
                    sizeClasses[size]
                )}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between mb-4">
                        {title && (
                            <h2 className="text-xl font-semibold text-white">{title}</h2>
                        )}
                        {showCloseButton && (
                            <IconButton
                                icon={<X size={20} />}
                                variant="glass"
                                size="sm"
                                onClick={onClose}
                                className="ml-auto"
                            />
                        )}
                    </div>
                )}

                {/* Body */}
                <div>{children}</div>
            </div>
        </div>
    );
}

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    position?: 'left' | 'right' | 'top' | 'bottom';
    size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Drawer({
    isOpen,
    onClose,
    title,
    children,
    position = 'right',
    size = 'md',
}: DrawerProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: position === 'left' || position === 'right' ? 'w-80' : 'h-80',
        md: position === 'left' || position === 'right' ? 'w-96' : 'h-96',
        lg: position === 'left' || position === 'right' ? 'w-[32rem]' : 'h-[32rem]',
        full: position === 'left' || position === 'right' ? 'w-full' : 'h-full',
    };

    const positionClasses = {
        left: 'left-0 top-0 bottom-0',
        right: 'right-0 top-0 bottom-0',
        top: 'top-0 left-0 right-0',
        bottom: 'bottom-0 left-0 right-0',
    };

    const animationClasses = {
        left: isOpen ? 'translate-x-0' : '-translate-x-full',
        right: isOpen ? 'translate-x-0' : 'translate-x-full',
        top: isOpen ? 'translate-y-0' : '-translate-y-full',
        bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 backdrop-overlay animate-fade-in"
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div
                className={cn(
                    'fixed',
                    'backdrop-blur-xl bg-white/10',
                    'border',
                    position === 'left' && 'border-r',
                    position === 'right' && 'border-l',
                    position === 'top' && 'border-b',
                    position === 'bottom' && 'border-t',
                    'border-white/20',
                    'shadow-glass-xl',
                    'transition-transform duration-300',
                    positionClasses[position],
                    sizeClasses[size],
                    animationClasses[position]
                )}
            >
                <div className="h-full flex flex-col p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        {title && (
                            <h2 className="text-xl font-semibold text-white">{title}</h2>
                        )}
                        <IconButton
                            icon={<X size={20} />}
                            variant="glass"
                            size="sm"
                            onClick={onClose}
                            className="ml-auto"
                        />
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    fullScreen?: boolean;
}

export function Loading({ size = 'md', text, fullScreen = false }: LoadingProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const spinner = (
        <div className="flex flex-col items-center gap-4">
            <div
                className={cn(
                    'rounded-full border-4 border-white/20 border-t-primary-500',
                    'animate-spin',
                    sizeClasses[size]
                )}
            />
            {text && (
                <p className="text-white/70 text-sm font-medium">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
                {spinner}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            {spinner}
        </div>
    );
}

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className,
    variant = 'rectangular',
    width,
    height,
}: SkeletonProps) {
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    return (
        <div
            className={cn(
                'skeleton',
                variantClasses[variant],
                className
            )}
            style={{ width, height }}
        />
    );
}

export default Modal;
