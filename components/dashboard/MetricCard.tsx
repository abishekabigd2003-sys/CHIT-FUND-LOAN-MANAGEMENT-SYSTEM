import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changePeriod?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  subtitle?: string;
  highlight?: 'default' | 'warning' | 'destructive' | 'success';
}

export function MetricCard({
  title,
  value,
  change,
  changePeriod = 'vs last month',
  icon: Icon,
  iconColor = 'text-brand-600 dark:text-brand-400',
  iconBg = 'bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-900/40',
  subtitle,
  highlight = 'default',
}: MetricCardProps) {
  const isPositive = change !== undefined ? change >= 0 : null;

  const highlightStyles = {
    default:
      'border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] shadow-fintech hover:border-slate-300 dark:hover:border-slate-700',
    warning:
      'border-amber-200/90 dark:border-amber-900/60 bg-gradient-to-b from-amber-50/30 via-white to-white dark:from-amber-950/20 dark:via-[#0f172a] dark:to-[#0f172a] shadow-fintech hover:border-amber-300 dark:hover:border-amber-700',
    destructive:
      'border-rose-200/90 dark:border-rose-900/60 bg-gradient-to-b from-rose-50/30 via-white to-white dark:from-rose-950/20 dark:via-[#0f172a] dark:to-[#0f172a] shadow-fintech hover:border-rose-300 dark:hover:border-rose-700',
    success:
      'border-emerald-200/90 dark:border-emerald-900/60 bg-gradient-to-b from-emerald-50/30 via-white to-white dark:from-emerald-950/20 dark:via-[#0f172a] dark:to-[#0f172a] shadow-fintech hover:border-emerald-300 dark:hover:border-emerald-700',
  };

  return (
    <div
      className={cn(
        'group relative rounded-2xl border p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-fintech-hover flex flex-col justify-between overflow-hidden',
        highlightStyles[highlight]
      )}
    >
      {/* Subtle top sheen accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/40 dark:via-slate-700/50 to-transparent group-hover:via-brand-500/60 transition-colors" />

      <div>
        {/* Title row: full-width title + icon */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-snug flex-1 min-w-0 pr-1">
            {title}
          </p>
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs',
              iconBg,
              iconColor
            )}
          >
            <Icon className="w-4 h-4 stroke-[1.8]" />
          </div>
        </div>

        <div className="mt-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums leading-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5 truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] shadow-2xs',
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3 stroke-[2.2]" />
            ) : (
              <TrendingDown className="w-3 h-3 stroke-[2.2]" />
            )}
            <span>{Math.abs(change as number)}%</span>
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate">
            {changePeriod}
          </span>
        </div>
      )}
    </div>
  );
}
