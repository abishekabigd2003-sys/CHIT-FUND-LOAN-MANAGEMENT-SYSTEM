'use client';

import React from 'react';
import Link from 'next/link';
import { LoanAssessment } from '@/types/assessment';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Eye, AlertCircle, CheckCircle2, Clock, XCircle, FileSpreadsheet } from 'lucide-react';

interface AssessmentListTableProps {
  assessments: LoanAssessment[];
  isLoading?: boolean;
}

export function AssessmentListTable({ assessments, isLoading }: AssessmentListTableProps) {
  const getStatusBadge = (status: LoanAssessment['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            <CheckCircle2 className="w-3 h-3 stroke-[2]" /> Approved
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
            <Clock className="w-3 h-3 stroke-[1.8]" /> Under Review
          </span>
        );
      case 'REQUIRES_MORE_INFO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
            <AlertCircle className="w-3 h-3 stroke-[1.8]" /> More Info
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
            <XCircle className="w-3 h-3 stroke-[2]" /> Rejected
          </span>
        );
      case 'DRAFT':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Draft
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-fintech">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-r-transparent" />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">Loading loan assessments...</p>
      </div>
    );
  }

  if (assessments.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-fintech">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <FileSpreadsheet className="w-6 h-6 stroke-[1.8]" />
        </div>
        <p className="text-base font-bold text-slate-800 dark:text-slate-100">No Loan Assessments Found</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Start a new credit eligibility assessment for a prospective customer.
        </p>
        <div className="mt-4">
          <Button href="/assessments/new" variant="primary" size="sm" className="font-semibold shadow-xs">
            Create Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] shadow-fintech scrollbar-none">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200/90 dark:border-slate-800/80 bg-slate-50/75 dark:bg-[#0d1527]/75 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4 whitespace-nowrap">Assessment ID</th>
            <th className="py-3.5 px-4 whitespace-nowrap">Customer</th>
            <th className="py-3.5 px-4 whitespace-nowrap">Loan Type</th>
            <th className="py-3.5 px-4 whitespace-nowrap">Requested Amt</th>
            <th className="py-3.5 px-4 whitespace-nowrap">CIBIL / FOIR</th>
            <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
            <th className="py-3.5 px-4 whitespace-nowrap">Assessor</th>
            <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
          {assessments.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
              <td className="py-3.5 px-4 whitespace-nowrap">
                <Link href={`/assessments/${a.id}`} className="font-bold text-brand-600 dark:text-brand-400 hover:underline font-mono">
                  {a.assessmentNumber}
                </Link>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-0.5">{formatDate(a.createdAt)}</div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-bold text-slate-900 dark:text-slate-100">{a.customerName}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 whitespace-nowrap">{a.customerPhone}</div>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                <Badge variant="outline" className="font-semibold text-[11px]">
                  {a.loanType}
                </Badge>
              </td>
              <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                <span className="tabular-nums font-mono">{formatCurrency(a.requestedAmount)}</span>
                <div className="text-[10px] font-normal text-slate-400 dark:text-slate-500 mt-0.5">{a.requestedTenureMonths} Mos Tenure</div>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{a.creditDetails.score}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">({a.creditDetails.riskBand})</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">FOIR: {a.eligibility.foir}%</div>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(a.status)}</td>
              <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                <div className="truncate max-w-[140px] font-medium">{a.assessorName}</div>
              </td>
              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                <Button
                  href={`/assessments/${a.id}`}
                  variant="ghost"
                  size="xs"
                  leftIcon={<Eye className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />}
                  className="font-semibold"
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
