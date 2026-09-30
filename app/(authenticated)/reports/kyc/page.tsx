'use client';

import React from 'react';
import Link from 'next/link';
import { useKycProfiles } from '@/hooks/useKyc';
import { ShieldCheck, Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function KycComplianceReportPage() {
  const { data: profiles = [], isLoading } = useKycProfiles();

  const total = profiles.length;
  const verified = profiles.filter((p) => p.status === 'VERIFIED').length;
  const underReview = profiles.filter((p) => p.status === 'UNDER_REVIEW').length;
  const resubmit = profiles.filter((p) => p.status === 'REQUIRES_RESUBMISSION').length;

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
            <ShieldCheck className="w-6 h-6 text-brand-600 dark:text-brand-400 stroke-[2] shrink-0" />
            KYC & Document Verification Audit Report
          </h1>
          <p className="page-subtitle">
            Regulatory verification rates, document expiry tracking, and customer risk profiling metrics.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Download className="w-4 h-4 text-slate-600 dark:text-slate-400 stroke-[1.8]" />}
          className="self-start sm:self-auto shrink-0"
        >
          Export Compliance Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <span className="text-[11px] text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider">
            Total Portfolios
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
            {total}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">Registered Customers</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block uppercase font-bold tracking-wider">
            100% Verified
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {verified}
          </span>
          <span className="text-xs text-emerald-600/80 dark:text-emerald-400/80 block mt-1">
            Compliant for Disbursement
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <span className="text-[11px] text-brand-600 dark:text-brand-400 block uppercase font-bold tracking-wider">
            Under Review
          </span>
          <span className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1 block">
            {underReview}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1">
            Desk verification in progress
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block uppercase font-bold tracking-wider">
            Deficiencies
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {resubmit}
          </span>
          <span className="text-xs text-amber-600/80 dark:text-amber-400/80 block mt-1">
            Resubmission pending
          </span>
        </div>
      </div>
    </div>
  );
}
