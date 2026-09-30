import React from 'react';

export default function AuthenticatedLoading() {
  return (
    <div className="w-full space-y-5 animate-pulse transition-opacity duration-150">
      {/* Sleek top transition progress line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-brand-500/20 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-brand-600 via-brand-400 to-brand-600 w-1/3 animate-[indeterminate_1.2s_ease-in-out_infinite]" />
      </div>

      {/* Header Placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="h-8 w-56 sm:w-72 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl" />
          <div className="h-4 w-80 max-w-full bg-slate-100 dark:bg-slate-850 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-slate-200/80 dark:bg-slate-800/80 rounded-xl" />
      </div>

      {/* Filter Bar Placeholder */}
      <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="h-11 w-full sm:w-80 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="h-11 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
            <div className="h-11 w-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content Table / Card Placeholder */}
      <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-4">
          <div className="h-5 flex-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
          <div className="h-5 flex-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
          <div className="h-5 flex-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
          <div className="h-5 flex-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 items-center py-3 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0"
            >
              <div className="h-6 flex-1 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
              <div className="h-6 flex-1 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
              <div className="h-6 flex-1 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
              <div className="h-6 flex-1 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
