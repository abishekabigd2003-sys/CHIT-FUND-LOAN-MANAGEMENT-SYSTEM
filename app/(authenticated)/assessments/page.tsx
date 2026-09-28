'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAssessments } from '@/hooks/useAssessment';
import { AssessmentListTable } from '@/components/assessments/AssessmentListTable';
import { Plus, Filter, ClipboardCheck, ArrowUpRight } from 'lucide-react';
import { PermissionGuard } from '@/components/permissions/PermissionGuard';

export default function AssessmentsPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);

  const { data: assessments = [], isLoading } = useAssessments(
    selectedStatus === 'ALL' ? undefined : selectedStatus
  );

  const statusTabs = [
    { label: 'All Assessments', value: 'ALL' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Requires More Info', value: 'REQUIRES_MORE_INFO' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Loan Credit Assessments
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Conduct borrower credit appraisals, bureau inquiries, FOIR ratios, and submit for Owner Approval.
          </p>
        </div>

        <PermissionGuard permission="assessments.create">
          <Link
            href="/assessments/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20"
          >
            <Plus className="w-4 h-4" />
            New Loan Assessment
          </Link>
        </PermissionGuard>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {statusTabs.map((tab) => (
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

      {/* Assessments List Table */}
      <AssessmentListTable assessments={assessments} isLoading={isLoading} />
    </div>
  );
}
