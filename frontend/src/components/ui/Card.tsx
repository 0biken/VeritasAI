'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
    glowOnHover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ children, className, hoverable = false, glowOnHover = false, ...props }, ref) => {
        const cardVariants = {
            rest: { y: 0 },
            hover: hoverable ? { y: -4 } : { y: 0 },
        };

        return (
            <motion.div
                ref={ref}
                initial="rest"
                whileHover="hover"
                variants={cardVariants}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className={cn(
                    'rounded-lg p-6 backdrop-blur-lg border transition-all duration-300',
                    'bg-surface-elevated border-white/8',
                    hoverable && 'cursor-pointer hover:border-primary-start/40 hover:shadow-elevation-md',
                    glowOnHover && 'relative overflow-hidden',
                    className
                )}
                {...(props as HTMLMotionProps<'div'>)}
            >
                {glowOnHover && (
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-[-1px] rounded-lg bg-gradient-to-r from-primary-start to-primary-end blur-sm" />
                    </div>
                )}
                <div className="relative z-10">{children}</div>
            </motion.div>
        );
    }
);

Card.displayName = 'Card';

export { Card };
