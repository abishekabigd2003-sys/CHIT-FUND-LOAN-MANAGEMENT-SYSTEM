'use client';

import React from 'react';
import Link from 'next/link';
import { useCollectionTasks } from '@/hooks/useCollections';
import { CollectionMetricsHeader } from '@/components/collections/CollectionMetricsHeader';
import { CollectionTaskTable } from '@/components/collections/CollectionTaskTable';
import { CreditCard, ListTodo, UserCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function CollectionDashboardPage() {
  const { data: tasks = [], isLoading } = useCollectionTasks();

  return (
    <div className="space-y-6">
      {/* Title & Quick Links */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Collection Automation & Staff Operations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of upcoming dues, automated reminders, staff task allocation, and recovery escalation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/collections/my-tasks"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shadow-xs"
          >
            <UserCheck className="w-4 h-4" />
            My Collection Tasks
          </Link>
          <Link
            href="/collections/tasks"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-semibold"
          >
            <ListTodo className="w-4 h-4" />
            All Tasks
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <CollectionMetricsHeader />

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/collections/upcoming"
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600">
              Upcoming Payments Tracker
            </span>
            <CreditCard className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Automated WhatsApp & SMS payment reminders for the next 7 days.
          </p>
        </Link>

        <Link
          href="/collections/overdue"
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600">
              Overdue Collections & DPD
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Prioritized delinquent accounts requiring doorstep visits.
          </p>
        </Link>

        <Link
          href="/collections/recovery"
          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600">
              Recovery & Legal Escalation
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Pre-auction notices, OTS settlement waivers, and legal enforcement.
          </p>
        </Link>
      </div>

      {/* Active Tasks Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Active Collection Queue
          </h2>
          <span className="text-xs text-slate-500">{tasks.length} total tasks</span>
        </div>
        <CollectionTaskTable tasks={tasks} isLoading={isLoading} />
      </div>
    </div>
  );
}
