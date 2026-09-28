'use client';

import React from 'react';
import { useCollectionTasks } from '@/hooks/useCollections';
import { CollectionTaskTable } from '@/components/collections/CollectionTaskTable';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function OverdueCollectionsPage() {
  const { data: tasks = [], isLoading } = useCollectionTasks();
  const overdueTasks = tasks.filter(
    (t) => (t.daysOverdue > 0 || t.status === 'OVERDUE' || t.status === 'ESCALATED') && t.status !== 'COLLECTED'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Overdue Accounts & Delinquency Tracking
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accounts past contractual payment date requiring intense calling, field verification, and recovery intervention.
          </p>
        </div>
      </div>

      <CollectionTaskTable tasks={overdueTasks} isLoading={isLoading} />
    </div>
  );
}
