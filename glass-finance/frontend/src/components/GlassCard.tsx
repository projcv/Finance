import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export const GlassCard = ({
    children,
    className,
    hover = true,
    onClick,
    padding = 'md',
}: GlassCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hover ? { scale: 1.02 } : undefined}
            className={clsx(
                'glass-card',
                paddingClasses[padding],
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
