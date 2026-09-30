'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApproval } from '@/hooks/useApprovals';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ApprovalDecisionModal } from '@/components/approvals/ApprovalDecisionModal';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  User,
  ExternalLink,
  History,
  FileCheck,
} from 'lucide-react';
import { PermissionGuard } from '@/components/permissions/PermissionGuard';
import { Button } from '@/components/ui/Button';

export default function ApprovalDetailPage() {
  const params = useParams();
  const approvalId = params.approvalId as string;
  const { data: approval, isLoading } = useApproval(approvalId);

  const [decisionAction, setDecisionAction] = useState<'APPROVE' | 'REJECT' | 'REQUEST_CHANGES' | null>(null);

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-r-transparent" />
        <p className="mt-2 text-xs text-slate-500">Loading approval file...</p>
      </div>
    );
  }

  if (!approval) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Approval file not found</p>
        <Link href="/approvals" className="text-xs text-blue-600 mt-2 inline-block">
          Return to Approvals
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/approvals"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="page-title">
                {approval.approvalNumber}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 border border-amber-200 dark:border-amber-800">
                {approval.status}
              </span>
            </div>
            <p className="page-subtitle">
              Submitted by {approval.submittedBy.name} ({approval.submittedBy.role}) on{' '}
              {formatDate(approval.submittedBy.submittedAt)}
            </p>
          </div>
        </div>

        {approval.status === 'PENDING' && (
          <PermissionGuard anyPermissions={['approvals.approve', 'loans.approve']}>
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDecisionAction('REQUEST_CHANGES')}
                leftIcon={<AlertCircle className="w-4 h-4 text-amber-500 stroke-[1.8]" />}
              >
                Request Changes
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDecisionAction('REJECT')}
                leftIcon={<XCircle className="w-4 h-4 stroke-[1.8]" />}
              >
                Reject
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={() => setDecisionAction('APPROVE')}
                leftIcon={<CheckCircle2 className="w-4 h-4 stroke-[2]" />}
              >
                Sanction & Approve
              </Button>
            </div>
          </PermissionGuard>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Loan Particulars & Credit Risk */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Sanction Proposal Overview
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Borrower</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{approval.customerName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Contact</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{approval.customerPhone}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Product Category</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{approval.loanType}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Requested Principal</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                  {formatCurrency(approval.requestedAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">Tenure</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{approval.tenureMonths} Months</span>
              </div>
            </div>
          </div>

          {/* KYC Summary */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] flex items-center justify-between">
              <span>Customer KYC Verification</span>
              <span className="text-emerald-600 font-bold">{approval.kycSummary.status}</span>
            </h3>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <FileCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                {approval.kycSummary.verifiedDocsCount} of {approval.kycSummary.totalDocsCount} compliance documents
                verified. Risk Band: {approval.kycSummary.riskCategory}
              </span>
            </div>
          </div>

          {/* Executive Decision Record if already signed */}
          {approval.decision && (
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                Owner Decision Record
              </h3>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  {approval.decision.decidedByName}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Decided on {formatDate(approval.decision.decisionDate)}
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-800 p-2.5 rounded border border-slate-200 dark:border-slate-700">
                  &quot;{approval.decision.decisionRemarks}&quot;
                </p>
                {approval.decision.specialConditions && (
                  <div className="pt-2 text-[11px]">
                    <span className="font-bold block text-slate-700 dark:text-slate-300 mb-1">
                      Sanction Stipulations:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400">
                      {approval.decision.specialConditions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Assessment details, staff remarks, audit trail */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assessment & Credit Bureau Summary */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                Credit Appraisal Summary
              </h3>
              <Link
                href={`/assessments/${approval.assessmentSummary.assessmentId}`}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                View Full Credit Assessment <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Bureau CIBIL</span>
                <span className="text-base font-extrabold text-blue-600">
                  {approval.assessmentSummary.creditScore}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {approval.assessmentSummary.riskBand} Band
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">FOIR Burden</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {approval.assessmentSummary.foir}%
                </span>
                <span className="text-[10px] text-slate-400 block">Below 55% ceiling</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Verified Income</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  {formatCurrency(approval.assessmentSummary.monthlyIncome)}
                </span>
                <span className="text-[10px] text-slate-400 block">Per month</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Recommended APR</span>
                <span className="text-base font-extrabold text-emerald-600">
                  {approval.assessmentSummary.recommendedRate}%
                </span>
                <span className="text-[10px] text-slate-400 block">Annual reducing</span>
              </div>
            </div>

            {/* Staff Remarks */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Credit Officer Notes:
              </label>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-850/50 p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
                {approval.staffRemarks}
              </p>
            </div>
          </div>

          {/* Audit History */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
            <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" /> Lifecycle Audit History
            </h3>
            <div className="space-y-2 text-xs">
              {approval.auditHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40"
                >
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                      {item.action}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      By {item.performedBy} {item.notes && `• ${item.notes}`}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {formatDate(item.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ApprovalDecisionModal
        approval={approval}
        action={decisionAction || 'APPROVE'}
        isOpen={!!decisionAction}
        onClose={() => setDecisionAction(null)}
      />
    </div>
  );
}
