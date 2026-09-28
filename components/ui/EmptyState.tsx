import React from 'react';
import { type LucideIcon, Inbox } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12 sm:py-16 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0f172a]/50 my-2 transition-colors group',
        className
      )}
    >
      {/* Icon Container — soft jewel glow ring */}
      <div className="relative flex items-center justify-center w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/20 via-brand-500/10 to-transparent blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-xs">
          <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />
        </div>
      </div>

      <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 mb-1 tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mb-4">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
