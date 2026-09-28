'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme, Theme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  variant?: 'compact' | 'segmented' | 'dropdown' | 'menu';
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  variant = 'compact',
  className,
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const options: { id: Theme; label: string; icon: typeof Sun; desc: string }[] = [
    {
      id: 'light',
      label: 'Light',
      icon: Sun,
      desc: 'Crisp, high-contrast daytime interface',
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: Moon,
      desc: 'Sleek, eye-friendly midnight interface',
    },
    {
      id: 'system',
      label: 'System',
      icon: Monitor,
      desc: 'Synchronize automatically with OS settings',
    },
  ];

  // 1. MENU VARIANT (for Profile dropdown / User Menu)
  if (variant === 'menu') {
    return (
      <div className={cn('px-1.5 py-1.5', className)}>
        <div className="flex items-center justify-between mb-2 px-1 text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
            {resolvedTheme === 'dark' ? (
              <Moon className="w-3.5 h-3.5 text-brand-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
            Theme
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 capitalize">
            {theme === 'system' ? 'System' : resolvedTheme}
          </span>
        </div>
        <div
          className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60"
          role="radiogroup"
          aria-label="Theme selector"
        >
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setTheme(opt.id)}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer',
                  isSelected
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
                title={opt.desc}
              >
                <Icon
                  className={cn(
                    'w-3.5 h-3.5',
                    isSelected &&
                      (opt.id === 'light'
                        ? 'text-amber-500'
                        : opt.id === 'dark'
                        ? 'text-brand-400'
                        : 'text-brand-500')
                  )}
                />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. SEGMENTED VARIANT (for Settings page or large toolbars)
  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80',
          className
        )}
        role="radiogroup"
        aria-label="Theme selector"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(opt.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150',
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. DROPDOWN VARIANT
  if (variant === 'dropdown') {
    const ActiveIcon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun;

    return (
      <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-medium transition-all shadow-2xs"
          aria-expanded={isOpen}
          aria-haspopup="true"
          title="Change theme preference"
        >
          <ActiveIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          {showLabel && (
            <span className="capitalize">{theme === 'system' ? 'System' : resolvedTheme}</span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 animate-in fade-in-0 zoom-in-95">
            <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Appearance
            </div>
            {options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors',
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 3. COMPACT VARIANT (Quick toggle with animated transition)
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={cn('relative inline-flex items-center', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleTheme}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className={cn(
          'relative p-2 rounded-lg border border-slate-200/90 dark:border-slate-700/80',
          'bg-slate-50/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200',
          'hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition-all duration-200 shadow-2xs group'
        )}
        aria-label={`Current theme: ${theme}. Click to switch to ${isDark ? 'light' : 'dark'} mode. Right click for more options.`}
        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode (Right-click or hold for System options)`}
      >
        <div className="relative w-4 h-4 overflow-hidden flex items-center justify-center">
          <Sun
            className={cn(
              'w-4 h-4 text-amber-500 transition-all duration-300 transform absolute',
              isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
            )}
          />
          <Moon
            className={cn(
              'w-4 h-4 text-brand-400 transition-all duration-300 transform absolute',
              isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            )}
          />
        </div>

        {theme === 'system' && (
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-slate-900"
            title="Syncing with OS theme"
          />
        )}
      </button>

      {/* Tiny trigger for dropdown if user wants exact control */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 -ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-r-md transition-colors"
        aria-label="Open theme options menu"
        title="More theme options"
      >
        <span className="sr-only">Theme Options</span>
        <svg
          className={cn('w-2.5 h-2.5 transition-transform duration-200', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 animate-in fade-in-0 zoom-in-95">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Select Theme
          </div>
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors',
                  isSelected
                    ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
