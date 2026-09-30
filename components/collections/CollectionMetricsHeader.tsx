'use client';

import React from 'react';
import { useCollectionMetrics } from '@/hooks/useCollections';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

export function CollectionMetricsHeader() {
  const { data: metrics, isLoading } = useCollectionMetrics();

  if (isLoading || !metrics) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
      <div className="group relative p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] shadow-fintech hover:-translate-y-0.5 hover:shadow-fintech-hover transition-all duration-200 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/40 to-transparent group-hover:via-brand-500/80 transition-colors" />
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Due</span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-900/40 shadow-2xs">
            <CreditCard className="w-4 h-4 stroke-[1.8]" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
          {formatCurrency(metrics.totalDue)}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{metrics.activeTasksCount} active tasks</p>
      </div>

      <div className="group relative p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] shadow-fintech hover:-translate-y-0.5 hover:shadow-fintech-hover transition-all duration-200 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent group-hover:via-emerald-500/80 transition-colors" />
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Collected</span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 stroke-[1.8]" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
          {formatCurrency(metrics.totalCollected)}
        </div>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
          {metrics.collectionEfficiency}% recovery rate
        </p>
      </div>

      <div className="group relative p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] shadow-fintech hover:-translate-y-0.5 hover:shadow-fintech-hover transition-all duration-200 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent group-hover:via-amber-500/80 transition-colors" />
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Overdue Dues</span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 shadow-2xs">
            <AlertTriangle className="w-4 h-4 stroke-[1.8]" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
          {metrics.overdueTasksCount} Tasks
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Requires staff follow-up</p>
      </div>

      <div className="group relative p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] shadow-fintech hover:-translate-y-0.5 hover:shadow-fintech-hover transition-all duration-200 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500/40 to-transparent group-hover:via-rose-500/80 transition-colors" />
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 mb-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Escalated Legal</span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 shadow-2xs">
            <ShieldAlert className="w-4 h-4 stroke-[1.8]" />
          </div>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 tabular-nums">
          {metrics.escalatedCount} Cases
        </div>
        <p className="text-xs text-rose-500 dark:text-rose-400 font-semibold mt-1">Recovery pipeline</p>
      </div>
    </div>
  );
}
