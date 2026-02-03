'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'verified' | 'processing' | 'error' | 'warning' | 'info';
    icon?: React.ReactNode;
    pulse?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
    ({ children, className, variant = 'verified', icon, pulse = false, ...props }, ref) => {
        const variantStyles = {
            verified: 'bg-validation/15 text-validation border-validation/30',
            processing: 'bg-primary-start/15 text-primary-start border-primary-start/30',
            error: 'bg-red-500/15 text-red-400 border-red-500/30',
            warning: 'bg-accent/15 text-accent border-accent/30',
            info: 'bg-primary-start/15 text-primary-start border-primary-start/30',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-semibold border',
                    variantStyles[variant],
                    pulse && 'animate-pulse-glow',
                    className
                )}
                {...props}
            >
                {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
                {children}
            </div>
        );
    }
);

Badge.displayName = 'Badge';

export { Badge };
