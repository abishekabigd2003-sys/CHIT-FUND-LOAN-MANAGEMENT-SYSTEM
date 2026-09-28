import React from 'react';
import { Calendar, Landmark, Coins, AlertCircle, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface UpcomingPayment {
  id: string;
  customerName: string;
  accountCode: string;
  type: 'LOAN' | 'CHIT';
  dueDate: string;
  amount: number;
  status: 'PENDING' | 'OVERDUE' | 'PARTIALLY_PAID';
}

export function UpcomingPaymentsList({ payments }: { payments: UpcomingPayment[] }) {
  const getStatusChip = (status: UpcomingPayment['status']) => {
    switch (status) {
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60">
            <AlertCircle className="w-3 h-3 stroke-[2.2]" />
            Overdue
          </span>
        );
      case 'PARTIALLY_PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60">
            <Clock className="w-3 h-3 stroke-[2.2]" />
            Partially Paid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Clock className="w-3 h-3 stroke-[1.8]" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
      {payments.map((p) => {
        const isLoan = p.type === 'LOAN';
        return (
          <div
            key={p.id}
            className="group py-3.5 px-2 -mx-2 rounded-xl flex items-center justify-between gap-3 text-sm transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-850/50"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-105 shadow-2xs',
                  isLoan
                    ? 'bg-brand-50/80 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border-brand-100 dark:border-brand-900/40'
                    : 'bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                )}
              >
                {isLoan ? (
                  <Landmark className="w-4.5 h-4.5 stroke-[1.8]" />
                ) : (
                  <Coins className="w-4.5 h-4.5 stroke-[1.8]" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate">
                    {p.customerName}
                  </p>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {p.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] mt-0.5">
                  <span className="font-mono text-slate-600 dark:text-slate-400">{p.accountCode}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Due {formatDate(p.dueDate, 'dd MMM yyyy')}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                {formatCurrency(p.amount)}
              </p>
              <div className="mt-1 flex justify-end">
                {getStatusChip(p.status)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
