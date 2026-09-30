'use client';

import React from 'react';
import Link from 'next/link';
import { ApprovalRequest } from '@/types/approval';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Clock, XCircle, AlertCircle, Eye, ArrowRight, ShieldCheck } from 'lucide-react';

interface ApprovalListTableProps {
  approvals: ApprovalRequest[];
  isLoading?: boolean;
}

export function ApprovalListTable({ approvals, isLoading }: ApprovalListTableProps) {
  const getStatusBadge = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" /> Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
            <Clock className="w-3.5 h-3.5 stroke-[1.8]" /> Awaiting Sign-Off
          </span>
        );
      case 'CHANGES_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
            <AlertCircle className="w-3.5 h-3.5 stroke-[1.8]" /> Changes Requested
          </span>
        );
      case 'REJECTED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
            <XCircle className="w-3.5 h-3.5 stroke-[2]" /> Rejected
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-fintech">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-r-transparent" />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">Loading pending approval queue...</p>
      </div>
    );
  }

  if (approvals.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-fintech">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <ShieldCheck className="w-6 h-6 stroke-[2]" />
        </div>
        <p className="text-base font-bold text-slate-800 dark:text-slate-100">No Approvals Pending</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          All loan assessments and settlement requests have been reviewed and sanctioned.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] shadow-fintech scrollbar-none">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200/90 dark:border-slate-800/80 bg-slate-50/75 dark:bg-[#0d1527]/75 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">
            <th className="py-3 px-3.5 whitespace-nowrap">Request Ref</th>
            <th className="py-3 px-3.5 whitespace-nowrap">Borrower</th>
            <th className="py-3 px-3.5 whitespace-nowrap">Loan / Proposal</th>
            <th className="py-3 px-3.5 whitespace-nowrap">Credit / FOIR</th>
            <th className="py-3 px-3.5 whitespace-nowrap">KYC Risk</th>
            <th className="py-3 px-3.5 whitespace-nowrap">Submitted By</th>
            <th className="py-3 px-3.5 whitespace-nowrap">Status</th>
            <th className="py-3 px-3.5 text-right whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-normal">
          {approvals.map((req) => (
            <tr key={req.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
              <td className="py-3 px-3.5 font-mono font-semibold text-brand-600 dark:text-brand-400 text-sm">
                <Link href={`/approvals/${req.id}`} prefetch={true} className="hover:underline">
                  {req.approvalNumber}
                </Link>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-normal font-sans mt-0.5">
                  {formatDate(req.createdAt)}
                </div>
              </td>

              <td className="py-3 px-3.5">
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{req.customerName}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">{req.customerPhone}</div>
              </td>

              <td className="py-3 px-3.5">
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                  {formatCurrency(req.requestedAmount)}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                  {req.loanType} • {req.tenureMonths} Mos
                </div>
              </td>

              <td className="py-3 px-3.5">
                <div className="font-medium text-slate-800 dark:text-slate-200 text-sm tabular-nums">
                  Score: {req.assessmentSummary.creditScore}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                  FOIR: {req.assessmentSummary.foir}% ({req.assessmentSummary.riskBand})
                </div>
              </td>

              <td className="py-3 px-3.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    req.kycSummary.riskCategory === 'LOW'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
                      : req.kycSummary.riskCategory === 'MEDIUM'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/60'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60'
                  }`}
                >
                  {req.kycSummary.riskCategory} RISK
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                  {req.kycSummary.verifiedDocsCount}/{req.kycSummary.totalDocsCount} Docs Verified
                </div>
              </td>

              <td className="py-3 px-3.5">
                <div className="text-slate-700 dark:text-slate-300 font-medium text-sm">{req.submittedBy.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">{req.submittedBy.role}</div>
              </td>

              <td className="py-3 px-3.5">{getStatusBadge(req.status)}</td>

              <td className="py-3 px-3.5 text-right">
                <Button
                  href={`/approvals/${req.id}`}
                  variant="primary"
                  size="xs"
                  leftIcon={<Eye className="w-3.5 h-3.5 stroke-[1.8]" />}
                  className="font-medium shadow-2xs"
                >
                  Review & Sign
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
