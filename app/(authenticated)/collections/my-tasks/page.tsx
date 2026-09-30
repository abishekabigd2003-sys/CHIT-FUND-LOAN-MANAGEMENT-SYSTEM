'use client';

import React from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useMyTasks } from '@/hooks/useCollections';
import { CollectionTaskTable } from '@/components/collections/CollectionTaskTable';
import { formatCurrency } from '@/lib/utils';
import { UserCheck, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';

export default function MyTasksPage() {
  const { user } = useAuth();
  const staffId = user?.id || 'usr-staff-1';
  const { data: myTasks = [], isLoading } = useMyTasks(staffId);

  const totalAssignedDue = myTasks.reduce((acc, t) => acc + t.dueAmount, 0);
  const totalCollectedSoFar = myTasks.reduce((acc, t) => acc + t.collectedAmount, 0);
  const followUpsPending = myTasks.filter((t) => t.status === 'FOLLOW_UP').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            My Collection Tasks & Field Itinerary
          </h1>
          <p className="page-subtitle">
            Active portfolio assigned to {user?.name || 'Staff Officer'}. Log doorstep visits and daily remarks.
          </p>
        </div>
      </div>

      {/* Quick Summary KPIs for Staff */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block uppercase">My Target Due</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {formatCurrency(totalAssignedDue)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">{myTasks.length} Assigned Accounts</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-600 block uppercase">Collected Today</span>
          <span className="text-xl font-extrabold text-emerald-600">
            {formatCurrency(totalCollectedSoFar)}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
            Receipts digitally confirmed
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-600 block uppercase">Follow-Ups Set</span>
          <span className="text-xl font-extrabold text-amber-600">{followUpsPending} Accounts</span>
          <span className="text-[11px] text-slate-400 block mt-0.5">Scheduled callbacks & visits</span>
        </div>
      </div>

      {/* Task Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Pending Field Activities ({myTasks.length})
        </h2>
        <CollectionTaskTable tasks={myTasks} isLoading={isLoading} />
      </div>
    </div>
  );
}
