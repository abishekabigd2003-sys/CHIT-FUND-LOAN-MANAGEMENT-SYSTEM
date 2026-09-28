'use client';

import React from 'react';
import { useCollectionTasks } from '@/hooks/useCollections';
import { CollectionTaskTable } from '@/components/collections/CollectionTaskTable';
import { ShieldAlert, Gavel, Scale, FileText } from 'lucide-react';

export default function RecoveryPipelinePage() {
  const { data: tasks = [], isLoading } = useCollectionTasks();
  const recoveryTasks = tasks.filter((t) => t.status === 'ESCALATED' || t.recoveryStage === 'LEGAL');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Scale className="w-6 h-6 text-rose-600" />
            Recovery & Legal Escalation Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Defaulted accounts transferred to legal counsel for Section 138 / arbitration, collateral repossession, or OTS settlements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase mb-1">
            <Gavel className="w-4 h-4" /> Legal Demand Notices
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Formal 15-day statutory notices dispatched for dishonored cheques or NACH mandates.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase mb-1">
            <ShieldAlert className="w-4 h-4" /> Collateral Auctions
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Gold assay re-evaluations and public auction notices published in newspapers.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase mb-1">
            <FileText className="w-4 h-4" /> Settlement Waivers
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            One-Time Settlements (OTS) submitted to Management / Owner for penal fee waivers.
          </p>
        </div>
      </div>

      <CollectionTaskTable tasks={recoveryTasks} isLoading={isLoading} />
    </div>
  );
}
