'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAssessment } from '@/hooks/useAssessment';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreditScoreGauge } from '@/components/assessments/CreditScoreGauge';
import {
  ArrowLeft,
  User,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ExternalLink,
} from 'lucide-react';

export default function AssessmentDetailPage() {
  const params = useParams();
  const assessmentId = params.assessmentId as string;
  const { data: assessment, isLoading } = useAssessment(assessmentId);

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-r-transparent" />
        <p className="mt-2 text-xs text-slate-500">Loading assessment record...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Assessment not found</p>
        <Link href="/assessments" className="text-xs text-blue-600 mt-2 inline-block">
          Return to Assessments
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
            href="/assessments"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="page-title">
                {assessment.assessmentNumber}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 border border-blue-200 dark:border-blue-800">
                {assessment.status}
              </span>
            </div>
            <p className="page-subtitle">
              Assessed on {formatDate(assessment.createdAt)} by {assessment.assessorName}
            </p>
          </div>
        </div>

        {assessment.status === 'UNDER_REVIEW' && (
          <Link
            href={`/approvals`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            Proceed to Owner Approvals
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Credit & Eligibility */}
        <div className="space-y-6">
          <CreditScoreGauge
            score={assessment.creditDetails.score}
            riskBand={assessment.creditDetails.riskBand}
            provider={assessment.creditDetails.provider}
          />

          {/* Eligibility Metrics Card */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Financial Eligibility Engine
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Monthly Income</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(assessment.eligibility.monthlyIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Total Obligations</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatCurrency(assessment.eligibility.totalMonthlyObligations)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Calculated FOIR</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {assessment.eligibility.foir}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Recommended APR</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {assessment.eligibility.recommendedInterestRate}% p.a.
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500">Max Eligible Amount</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(assessment.eligibility.eligibleLoanAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Application, Collateral, Obligations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Loan Overview */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Application Particulars
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 block">Customer</span>
                <Link
                  href={`/customers/${assessment.customerId}`}
                  className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  {assessment.customerName}
                  <ExternalLink className="w-3 h-3" />
                </Link>
                <span className="text-[11px] text-slate-500">{assessment.customerPhone}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block">Product</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{assessment.loanType}</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block">Requested Amount</span>
                <span className="font-bold text-blue-600 text-sm">
                  {formatCurrency(assessment.requestedAmount)}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block">Tenure</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {assessment.requestedTenureMonths} Months
                </span>
              </div>
            </div>

            {assessment.collateralDetails && (
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Collateral: {assessment.collateralDetails.type}
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {assessment.collateralDetails.description}
                </p>
                <div className="flex gap-4 pt-1 font-semibold text-[11px]">
                  <span>Appraised: {formatCurrency(assessment.collateralDetails.estimatedValue)}</span>
                  <span className="text-emerald-600">LTV: {assessment.collateralDetails.ltvPercentage}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Existing Outside Obligations */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Existing Outstanding Obligations
            </h3>

            {assessment.existingObligations.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No external loan liabilities reported.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px]">
                      <th className="py-2">Institution</th>
                      <th className="py-2">Loan Type</th>
                      <th className="py-2">Outstanding</th>
                      <th className="py-2">Monthly EMI</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {assessment.existingObligations.map((ob) => (
                      <tr key={ob.id}>
                        <td className="py-2.5 font-semibold text-slate-900 dark:text-slate-100">
                          {ob.institutionName}
                        </td>
                        <td className="py-2.5 text-slate-500">{ob.loanType}</td>
                        <td className="py-2.5 font-bold">{formatCurrency(ob.outstandingBalance)}</td>
                        <td className="py-2.5 font-bold">{formatCurrency(ob.monthlyEmi)}</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {ob.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Assessor Remarks & Verification Checklist */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Assessor Appraisal Notes
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200/60 dark:border-slate-800">
              {assessment.assessorRemarks}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
