import React from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-x-auto scrollbar-none">
      <table className={cn('w-full caption-bottom text-[14px] sm:text-[14.5px] border-collapse', className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('border-b border-slate-200/90 dark:border-slate-800/80 bg-slate-50/75 dark:bg-[#0d1527]/75 backdrop-blur-xs', className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn('[&_tr:last-child]:border-0 divide-y divide-slate-100 dark:divide-slate-800/60', className)}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-b border-slate-100/90 dark:border-slate-800/60 transition-colors duration-150 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 data-[state=selected]:bg-slate-100/80 dark:data-[state=selected]:bg-slate-800/60',
        className
      )}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-10 px-3.5 sm:px-4 text-left align-middle text-xs sm:text-[12.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none whitespace-nowrap [&:has([role=checkbox])]:pr-0',
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn('p-3 sm:p-3.5 align-middle text-[14px] sm:text-[14.5px] text-slate-700 dark:text-slate-200 leading-normal [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  );
}
