import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning' | 'soft';
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
    'inline-flex items-center justify-center whitespace-nowrap font-medium tracking-tight transition-colors duration-150 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.985] cursor-pointer disabled:cursor-not-allowed';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-medium border border-brand-600 hover:border-brand-700 active:border-brand-800 shadow-2xs shadow-brand-700/20',
    secondary:
      'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-brand-200 dark:border-brand-800/80 hover:bg-brand-50/60 dark:hover:bg-brand-950/40 hover:text-brand-700 dark:hover:text-brand-300 hover:border-brand-300 dark:hover:border-brand-700 active:bg-brand-100 dark:active:bg-brand-900/60 shadow-2xs',
    outline:
      'border border-brand-200/90 dark:border-brand-800/70 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-brand-50/70 dark:hover:bg-brand-950/50 hover:text-brand-700 dark:hover:text-brand-300 hover:border-brand-400 dark:hover:border-brand-500 active:bg-brand-100 dark:active:bg-brand-900/60 shadow-2xs',
    soft:
      'bg-brand-50 hover:bg-brand-100 active:bg-brand-200 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:active:bg-brand-900 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 shadow-2xs',
    ghost:
      'text-slate-600 dark:text-slate-400 hover:bg-brand-50/60 dark:hover:bg-brand-950/40 hover:text-brand-700 dark:hover:text-brand-300 active:bg-brand-100 dark:active:bg-brand-900/50 border border-transparent',
    destructive:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white border border-rose-600 hover:border-rose-700 active:border-rose-800 shadow-2xs shadow-rose-700/20',
    success:
      'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white border border-emerald-600 hover:border-emerald-700 active:border-emerald-800 shadow-2xs shadow-emerald-700/20',
    warning:
      'bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white border border-brand-600 hover:border-brand-700 active:border-brand-800 shadow-2xs shadow-brand-700/20',
  };

  const sizes: Record<ButtonSize, string> = {
    xs: 'h-8 px-2.5 text-[13px] font-semibold rounded-lg gap-1.5 min-h-[32px]',
    sm: 'h-9 px-3.5 text-[14px] font-semibold rounded-xl gap-1.5 min-h-[36px]',
    md: 'h-10 px-4 text-[14.5px] font-semibold rounded-xl gap-2 min-h-[40px]',
    lg: 'h-11 px-5 text-[15px] font-semibold rounded-xl gap-2.5 min-h-[44px]',
    'icon-xs': 'h-8 w-8 p-0 rounded-lg shrink-0 flex items-center justify-center',
    'icon-sm': 'h-9 w-9 p-0 rounded-xl shrink-0 flex items-center justify-center',
    icon: 'h-10 w-10 p-0 rounded-xl shrink-0 flex items-center justify-center',
    'icon-lg': 'h-11 w-11 p-0 rounded-xl shrink-0 flex items-center justify-center',
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
