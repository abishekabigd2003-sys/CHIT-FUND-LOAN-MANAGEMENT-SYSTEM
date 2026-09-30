import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, placeholder, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 tracking-tight">
            {label}
            {props.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-2xs">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'block w-full h-9 sm:h-10 appearance-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-3.5 py-2 pr-10 text-sm text-slate-900 dark:text-slate-100',
              'transition-all duration-150',
              'hover:border-slate-300 dark:hover:border-slate-700',
              'focus:border-brand-500 dark:focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:focus:ring-brand-400/25',
              'disabled:bg-slate-50 dark:disabled:bg-slate-900/50 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:border-slate-200 dark:disabled:border-slate-800 disabled:cursor-not-allowed',
              error && 'border-rose-400/90 dark:border-rose-500/90 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/10 dark:bg-rose-950/10',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="dark:bg-slate-900 dark:text-slate-400">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="dark:bg-slate-900 dark:text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 dark:text-slate-500">
            <ChevronDown className="w-4 h-4 stroke-[2]" />
          </div>
        </div>
        {error ? (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 stroke-[2]" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
