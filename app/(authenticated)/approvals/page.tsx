'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApprovals } from '@/hooks/useApprovals';
import { ApprovalListTable } from '@/components/approvals/ApprovalListTable';
import { CheckCircle2, ShieldCheck, Clock, XCircle, AlertCircle } from 'lucide-react';

export default function ApprovalsPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);

  const { data: approvals = [], isLoading } = useApprovals(
    selectedStatus === 'ALL' ? undefined : selectedStatus
  );

  const pendingCount = approvals.filter((a) => a.status === 'PENDING').length;

  const tabs = [
    { label: 'All Requests', value: 'ALL' },
    { label: 'Pending Approvals', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Changes Requested', value: 'CHANGES_REQUESTED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Executive Owner Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Management sign-off gate for high-value loan sanctions, interest rate adjustments, and settlement waivers.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === tab.value
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ApprovalListTable approvals={approvals} isLoading={isLoading} />
    </div>
  );
}
