import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'icon-xs' | 'icon-sm' | 'icon' | 'icon-lg';

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}) {
  const baseStyles =
    'inline-flex items-center justify-center whitespace-nowrap font-semibold tracking-tight transition-all duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.985] cursor-pointer disabled:cursor-not-allowed';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-b from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 active:from-brand-700 active:to-brand-800 text-white shadow-xs shadow-brand-700/20 hover:shadow-brand border border-brand-500/30',
    secondary:
      'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:bg-slate-200/80 dark:hover:bg-slate-750 active:bg-slate-200 dark:active:bg-slate-700 border border-slate-200/80 dark:border-slate-700/70 shadow-2xs',
    outline:
      'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 active:bg-slate-100 dark:active:bg-slate-800 shadow-2xs',
    ghost:
      'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100 active:bg-slate-200 dark:active:bg-slate-700/60 border border-transparent',
    destructive:
      'bg-gradient-to-b from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:from-rose-700 active:to-rose-800 text-white shadow-xs shadow-rose-700/20 border border-rose-500/30',
    success:
      'bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:from-emerald-700 active:to-emerald-800 text-white shadow-xs shadow-emerald-700/20 border border-emerald-500/30',
    warning:
      'bg-gradient-to-b from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:from-amber-700 active:to-amber-800 text-white shadow-xs shadow-amber-700/20 border border-amber-500/30',
  };

  const sizes: Record<ButtonSize, string> = {
    xs: 'h-8 px-2.5 text-xs font-semibold rounded-lg gap-1.5 min-h-[32px]',
    sm: 'h-9 px-3.5 text-xs font-semibold rounded-xl gap-1.5 min-h-[36px]',
    md: 'h-10 px-4 text-sm font-semibold rounded-xl gap-2 min-h-[40px]',
    lg: 'h-11 px-5 text-sm sm:text-base font-semibold rounded-xl gap-2.5 min-h-[44px]',
    'icon-xs': 'h-7 w-7 p-0 rounded-md shrink-0 flex items-center justify-center',
    'icon-sm': 'h-8 w-8 p-0 rounded-lg shrink-0 flex items-center justify-center',
    icon: 'h-9 w-9 p-0 rounded-xl shrink-0 flex items-center justify-center',
    'icon-lg': 'h-10 w-10 p-0 rounded-xl shrink-0 flex items-center justify-center',
  };

  return cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  href?: string;
  prefetch?: boolean;
  target?: string;
  rel?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      href,
      prefetch = true,
      target,
      rel,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const classes = buttonVariants({ variant, size, fullWidth, className });

    const content = (
      <>
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 stroke-[2.2]" />
        ) : (
          leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
        )}
        {isLoading && loadingText ? (
          <span className="truncate">{loadingText}</span>
        ) : typeof children === 'string' ? (
          <span className="truncate">{children}</span>
        ) : (
          children
        )}
        {!isLoading && rightIcon && (
          <span className="shrink-0 flex items-center">{rightIcon}</span>
        )}
      </>
    );

    if (href && !disabled && !isLoading) {
      return (
        <Link
          href={href}
          prefetch={prefetch}
          target={target}
          rel={rel}
          className={classes}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={classes}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
