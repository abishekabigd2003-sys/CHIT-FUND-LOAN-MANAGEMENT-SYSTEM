import React from 'react';
import { CreditCard, User, Landmark, Coins, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  category: 'PAYMENT' | 'CUSTOMER' | 'LOAN' | 'CHIT' | 'SECURITY';
}

export function RecentActivitiesList({ activities }: { activities: ActivityItem[] }) {
  const getIcon = (category: ActivityItem['category']) => {
    switch (category) {
      case 'PAYMENT':
        return <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[1.8]" />;
      case 'CUSTOMER':
        return <User className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />;
      case 'CHIT':
        return <Coins className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />;
      case 'LOAN':
        return <Landmark className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 stroke-[1.8]" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 stroke-[1.8]" />;
    }
  };

  const getBg = (category: ActivityItem['category']) => {
    switch (category) {
      case 'PAYMENT':
        return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/50 dark:border-emerald-800/50';
      case 'CUSTOMER':
        return 'bg-brand-50 dark:bg-brand-950/60 border-brand-200/50 dark:border-brand-800/50';
      case 'CHIT':
        return 'bg-brand-50 dark:bg-brand-950/60 border-brand-200/50 dark:border-brand-800/50';
      case 'LOAN':
        return 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/50 dark:border-indigo-800/50';
      default:
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-200/50 dark:border-amber-800/50';
    }
  };

  return (
    <div className="relative space-y-3.5 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-[1px] before:bg-slate-200 dark:before:bg-slate-800">
      {activities.map((act) => (
        <div
          key={act.id}
          className="relative flex items-start gap-3.5 p-2 rounded-xl transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-850/50"
        >
          <div
            className={cn(
              'relative z-10 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs mt-0.5',
              getBg(act.category)
            )}
          >
            {getIcon(act.category)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-bold text-slate-850 dark:text-slate-150 text-sm truncate">
                {act.action}
              </p>
              <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                {act.time}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-[13px] truncate mt-0.5 font-medium">
              {act.target}
            </p>

            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {act.user}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {act.category}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
