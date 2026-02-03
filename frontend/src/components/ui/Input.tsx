'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-white/90 mb-2">{label}</label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full px-4 py-3 rounded-lg text-base transition-all duration-200',
                        'bg-surface-base border border-white/10 text-white placeholder:text-white/30',
                        'focus:outline-none focus:border-primary-start focus:ring-4 focus:ring-primary-start/10',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                {helperText && !error && <p className="mt-2 text-sm text-white/50">{helperText}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
