'use client';

import React from 'react';
import Link from 'next/link';
import { useCollectionTasks } from '@/hooks/useCollections';
import { CollectionMetricsHeader } from '@/components/collections/CollectionMetricsHeader';
import { CollectionTaskTable } from '@/components/collections/CollectionTaskTable';
import { CreditCard, ListTodo, UserCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CollectionDashboardPage() {
  const { data: tasks = [], isLoading } = useCollectionTasks();

  return (
    <div className="space-y-6">
      {/* Title & Quick Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Collection Automation & Staff Operations
          </h1>
          <p className="page-subtitle">
            Real-time tracking of upcoming dues, automated reminders, staff task allocation, and recovery escalation.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <Button
            href="/collections/my-tasks"
            variant="primary"
            size="sm"
            leftIcon={<UserCheck className="w-4 h-4 stroke-[1.8]" />}
          >
            My Collection Tasks
          </Button>
          <Button
            href="/collections/tasks"
            variant="outline"
            size="sm"
            leftIcon={<ListTodo className="w-4 h-4 stroke-[1.8]" />}
          >
            All Tasks
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <CollectionMetricsHeader />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/collections/upcoming"
          prefetch={true}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 transition-colors group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
              Upcoming Payments Tracker
            </span>
            <CreditCard className="w-4.5 h-4.5 text-blue-500" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed">
            Automated WhatsApp & SMS payment reminders for the next 7 days.
          </p>
        </Link>

        <Link
          href="/collections/overdue"
          prefetch={true}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/50 transition-colors group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600">
              Overdue Collections & DPD
            </span>
            <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed">
            Prioritized delinquent accounts requiring doorstep visits.
          </p>
        </Link>

        <Link
          href="/collections/recovery"
          prefetch={true}
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-500/50 transition-colors group shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600">
              Recovery & Legal Escalation
            </span>
            <ShieldAlert className="w-4.5 h-4.5 text-rose-500" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed">
            Pre-auction notices, OTS settlement waivers, and legal enforcement.
          </p>
        </Link>
      </div>

      {/* Active Tasks Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Active Collection Queue
          </h2>
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">{tasks.length} total tasks</span>
        </div>
        <CollectionTaskTable tasks={tasks} isLoading={isLoading} />
      </div>
    </div>
  );
}
