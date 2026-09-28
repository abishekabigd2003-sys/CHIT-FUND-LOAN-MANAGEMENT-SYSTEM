import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function AuthenticatedLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* Filter / Action Bar Skeleton */}
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <Skeleton className="h-10 w-full sm:w-80 rounded-xl" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Data Table / Content Grid Skeleton */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-4">
          <Skeleton className="h-5 flex-1 rounded-md" />
          <Skeleton className="h-5 flex-1 rounded-md" />
          <Skeleton className="h-5 flex-1 rounded-md" />
          <Skeleton className="h-5 flex-1 rounded-md" />
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-4 items-center py-2.5 border-b border-slate-100/60 dark:border-slate-800/60 last:border-0"
            >
              <Skeleton className="h-6 flex-1 rounded-md" />
              <Skeleton className="h-6 flex-1 rounded-md" />
              <Skeleton className="h-6 flex-1 rounded-md" />
              <Skeleton className="h-6 flex-1 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
