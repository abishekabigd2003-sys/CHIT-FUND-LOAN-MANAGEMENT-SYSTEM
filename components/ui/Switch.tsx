'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  partial?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  size = 'md',
  disabled = false,
  partial = false,
  className,
  ariaLabel,
  onClick,
  ...props
}: SwitchProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (onClick) onClick(e);
    if (onCheckedChange) onCheckedChange(!checked);
  };

  const isGreen = checked;

  const sizeStyles = {
    sm: {
      track: 'h-4 w-7',
      thumb: 'h-3 w-3',
      translateOn: 'translate-x-3',
      translatePartial: 'translate-x-1.5',
      translateOff: 'translate-x-0',
    },
    md: {
      track: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translateOn: 'translate-x-4',
      translatePartial: 'translate-x-2',
      translateOff: 'translate-x-0',
    },
    lg: {
      track: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translateOn: 'translate-x-5',
      translatePartial: 'translate-x-2.5',
      translateOff: 'translate-x-0',
    },
  }[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer rounded-full border transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-1 select-none',
        sizeStyles.track,
        disabled && 'opacity-50 cursor-not-allowed',
        // ON / Active State: Premium Emerald Green
        isGreen &&
          'bg-emerald-600 hover:bg-emerald-500 border-emerald-500/80 shadow-xs shadow-emerald-600/20',
        // Partial State (Master Switches): Deep Green / Dark Teal
        partial &&
          !isGreen &&
          'bg-emerald-800/80 hover:bg-emerald-700/80 border-emerald-600/70',
        // OFF / Inactive State: Subtle Dark Blue / Neutral Blue-Grey
        !isGreen &&
          !partial &&
          'bg-slate-200 border-slate-300 hover:bg-slate-300 dark:bg-[#152033] dark:border-[#23334e] dark:hover:bg-[#1a2840] dark:hover:border-[#2c4061]',
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        style={{
          backgroundColor: isGreen || partial ? '#ffffff' : undefined,
        }}
        className={cn(
          'pointer-events-none inline-block rounded-full shadow-sm ring-0 transition-transform duration-200 ease-in-out',
          sizeStyles.thumb,
          isGreen
            ? sizeStyles.translateOn
            : partial
            ? sizeStyles.translatePartial
            : sizeStyles.translateOff,
          !isGreen && !partial && 'bg-white dark:bg-[#94a3b8]'
        )}
      />
    </button>
  );
}
