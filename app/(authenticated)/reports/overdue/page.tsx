'use client';

import React from 'react';
import Link from 'next/link';
import { useDueReport } from '@/hooks/useReports';
import { formatCurrency } from '@/lib/utils';
import { AlertTriangle, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function OverdueReportPage() {
  const { data: report, isLoading } = useDueReport();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 no-print">
            <Link
              href="/reports"
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs flex items-center font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1 stroke-[2]" /> Back to Reports
            </Link>
          </div>
          <h1 className="page-title flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-500 stroke-[2] shrink-0" />
            Delinquency & Overdue Analytics
          </h1>
          <p className="page-subtitle">
            Days Past Due (DPD) ageing analysis, default risk buckets, and penal charge accruals.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Download className="w-4 h-4 text-slate-600 dark:text-slate-400 stroke-[1.8]" />}
          className="self-start sm:self-auto shrink-0"
        >
          Export Report
        </Button>
      </div>

      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
          DPD Ageing Breakdown & Risk Allocation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-bold block uppercase tracking-wider">
              1-30 Days Past Due
            </span>
            <span className="text-xl font-black text-amber-700 dark:text-amber-200 block mt-1">
              ₹1,85,000
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 block mt-1">Early Stage Calling Squad</span>
          </div>

          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50">
            <span className="text-[11px] text-orange-700 dark:text-orange-300 font-bold block uppercase tracking-wider">
              31-60 Days Past Due
            </span>
            <span className="text-xl font-black text-orange-700 dark:text-orange-200 block mt-1">
              ₹94,200
            </span>
            <span className="text-xs text-orange-600 dark:text-orange-400 block mt-1">Field Squad Assigned</span>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
            <span className="text-[11px] text-rose-700 dark:text-rose-300 font-bold block uppercase tracking-wider">
              61-90 Days Past Due
            </span>
            <span className="text-xl font-black text-rose-700 dark:text-rose-200 block mt-1">
              ₹48,000
            </span>
            <span className="text-xs text-rose-600 dark:text-rose-400 block mt-1">Statutory Pre-Notice</span>
          </div>

          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50">
            <span className="text-[11px] text-purple-700 dark:text-purple-300 font-bold block uppercase tracking-wider">
              90+ Days (NPA / Legal)
            </span>
            <span className="text-xl font-black text-purple-700 dark:text-purple-200 block mt-1">
              ₹32,500
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400 block mt-1">Arbitration / Auction</span>
          </div>
        </div>
      </div>
    </div>
  );
}
