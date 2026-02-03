'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className,
            variant = 'primary',
            size = 'md',
            loading = false,
            leftIcon,
            rightIcon,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = cn(
            'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-start focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary',
            'disabled:pointer-events-none disabled:opacity-50',
            'active:scale-[0.98]'
        );

        const variantStyles = {
            primary: cn(
                'bg-gradient-to-r from-primary-start to-primary-end text-white shadow-glow-cyan',
                'hover:shadow-glow-cyan-lg hover:-translate-y-0.5',
                'active:translate-y-0'
            ),
            secondary: cn(
                'bg-surface-elevated text-white border border-white/10 backdrop-blur-lg',
                'hover:bg-surface-high hover:border-white/20'
            ),
            ghost: cn('bg-transparent text-white/70', 'hover:bg-surface-base hover:text-white'),
        };

        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        };

        // Create motion props properly
        const motionProps: HTMLMotionProps<'button'> = {
            whileHover: variant === 'primary' ? { y: -2 } : undefined,
            whileTap: { scale: 0.98 },
        };

        return (
            <motion.button
                ref={ref}
                {...motionProps}
                className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
                disabled={disabled || loading}
                {...(props as HTMLMotionProps<'button'>)}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
                {children}
                {!loading && rightIcon}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
