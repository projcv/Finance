import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import clsx from 'clsx';

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, 'children'> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

const variantClasses = {
    primary: 'glass-btn-primary',
    secondary: 'glass-btn',
    ghost: 'bg-transparent hover:bg-white/10 border-transparent',
};

const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

export const GlassButton = ({
    children,
    variant = 'secondary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className,
    disabled,
    ...props
}: GlassButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
            className={clsx(
                'rounded-xl font-medium transition-all duration-300',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2',
                variantClasses[variant],
                sizeClasses[size],
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Loading...
                </>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default GlassButton;
