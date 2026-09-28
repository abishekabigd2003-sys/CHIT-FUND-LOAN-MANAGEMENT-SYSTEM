'use client';

import React, { useState } from 'react';
import { useAuditLogs } from '@/hooks/useAudit';
import { AuditTable } from '@/components/audit/AuditTable';
import { AuditModule, AuditAction } from '@/types/audit';
import { History, Search, Filter } from 'lucide-react';

export default function AuditTrailPage() {
  const [moduleFilter, setModuleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: logs = [], isLoading } = useAuditLogs({
    module: moduleFilter === 'ALL' ? undefined : (moduleFilter as AuditModule),
    search: searchQuery,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Immutable System Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete compliance event log tracking status mutations, owner sanction actions, staff collection entries, and IP stamps.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search record ID, officer, or event narrative..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-slate-100 font-medium"
          >
            <option value="ALL">All Modules</option>
            <option value="APPROVALS">Approvals</option>
            <option value="COLLECTIONS">Collections</option>
            <option value="ASSESSMENTS">Assessments</option>
            <option value="KYC">KYC & Compliance</option>
            <option value="LOANS">Loans</option>
            <option value="SETTINGS">Settings</option>
            <option value="AUTH">Authentication</option>
          </select>
        </div>
      </div>

      <AuditTable logs={logs} isLoading={isLoading} />
    </div>
  );
}
