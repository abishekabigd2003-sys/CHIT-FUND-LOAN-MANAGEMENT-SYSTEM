import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' | 'info';
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({ className, variant = 'default', dot = false, pulse = false, children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-brand-50/90 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border-brand-200/80 dark:border-brand-800/80',
    secondary: 'bg-slate-100/90 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80',
    success: 'bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-900/60',
    warning: 'bg-amber-50/90 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-900/60',
    destructive: 'bg-rose-50/90 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-900/60',
    info: 'bg-blue-50/90 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-900/60',
    outline: 'text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]',
  };

  const dots = {
    default: 'bg-brand-600 dark:bg-brand-400',
    secondary: 'bg-slate-400',
    success: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    destructive: 'bg-rose-500 dark:bg-rose-400',
    info: 'bg-blue-500 dark:bg-blue-400',
    outline: 'bg-slate-400',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] sm:text-[12.5px] font-semibold tracking-wide border transition-all duration-150 select-none shadow-2xs',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dots[variant],
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </div>
  );
}
