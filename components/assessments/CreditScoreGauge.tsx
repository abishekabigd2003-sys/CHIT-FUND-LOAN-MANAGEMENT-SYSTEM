import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

interface CreditScoreGaugeProps {
  score: number;
  riskBand: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  provider?: string;
}

export function CreditScoreGauge({ score, riskBand, provider = 'CIBIL' }: CreditScoreGaugeProps) {
  // Score is usually between 300 and 900
  const percentage = Math.min(100, Math.max(0, ((score - 300) / 600) * 100));

  const getTheme = () => {
    switch (riskBand) {
      case 'EXCELLENT':
        return {
          textColor: 'text-emerald-700 dark:text-emerald-400',
          bgBar: 'bg-emerald-500',
          border: 'border-emerald-200 dark:border-emerald-900/60',
          badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
          Icon: ShieldCheck,
        };
      case 'GOOD':
        return {
          textColor: 'text-brand-700 dark:text-brand-300',
          bgBar: 'bg-brand-600',
          border: 'border-brand-200 dark:border-brand-900/60',
          badgeBg: 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300',
          Icon: ShieldCheck,
        };
      case 'FAIR':
        return {
          textColor: 'text-amber-700 dark:text-amber-400',
          bgBar: 'bg-amber-500',
          border: 'border-amber-200 dark:border-amber-900/60',
          badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
          Icon: AlertTriangle,
        };
      case 'POOR':
      default:
        return {
          textColor: 'text-rose-700 dark:text-rose-400',
          bgBar: 'bg-rose-500',
          border: 'border-rose-200 dark:border-rose-900/60',
          badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
          Icon: AlertCircle,
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.Icon;

  return (
    <div className={cn('p-5 rounded-2xl border bg-white dark:bg-slate-900/80 shadow-2xs', theme.border)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
          Credit Assessment ({provider})
        </span>
        <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1', theme.badgeBg)}>
          <Icon className="w-3.5 h-3.5 stroke-[2]" />
          {riskBand}
        </span>
      </div>

      <div className="flex items-baseline gap-2 my-2.5">
        <span className={cn('text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums', theme.textColor)}>
          {score}
        </span>
        <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">/ 900</span>
      </div>

      {/* Progress Bar Gauge */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className={cn('h-3 rounded-full transition-all duration-700', theme.bgBar)}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
        <span>300 (High Risk)</span>
        <span>650</span>
        <span>750</span>
        <span>900 (Prime)</span>
      </div>
    </div>
  );
}
