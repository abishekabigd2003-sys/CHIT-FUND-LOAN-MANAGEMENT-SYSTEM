'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Landmark, CheckCircle } from 'lucide-react';
import { useLoan, useUpdateLoanStatus } from '@/hooks/useLoans';
import { EMIScheduleTable } from '@/components/loans/EMIScheduleTable';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGuard } from '@/components/permissions/PermissionGuard';

export default function LoanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const loanId = params?.loanId as string;
  const { data: loan, isLoading } = useLoan(loanId);
  const updateStatusMutation = useUpdateLoanStatus();
  const { hasPermission } = usePermissions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!loan) {
    return (
      <EmptyState
        icon={Landmark}
        title="Loan Account Not Found"
        description="The requested loan account record could not be found."
        actionLabel="Back to Loans"
        onAction={() => router.push('/loans')}
      />
    );
  }

  const canApprove = hasPermission('loans.approve') && loan.status === 'PENDING_APPROVAL';

  return (
    <div className="space-y-6">
      <Link href="/loans" className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1.5 stroke-[2]" />
        Back to All Loans
      </Link>

      {/* Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-md border border-brand-200 dark:border-brand-900">
                {loan.loanCode}
              </span>
              <Badge variant="default">{loan.loanType} LOAN</Badge>
              <Badge
                variant={
                  loan.status === 'ACTIVE'
                    ? 'success'
                    : loan.status === 'PENDING_APPROVAL'
                    ? 'warning'
                    : 'secondary'
                }
                dot
              >
                {loan.status}
              </Badge>
            </div>
            <h1 className="page-title">
              Borrower: {loan.customerName}
            </h1>
            <p className="page-subtitle">
              Applied on {formatDate(loan.createdAt)} •{' '}
              <Link href={`/customers/${loan.customerId}`} className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
                View Borrower Profile
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-right">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Principal Disbursed</span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">{formatCurrency(loan.principalAmount)}</span>
            </div>

            {canApprove && (
              <Button
                variant="success"
                size="md"
                onClick={() => updateStatusMutation.mutate({ id: loan.id, status: 'ACTIVE' })}
                isLoading={updateStatusMutation.isPending}
                className="shadow-sm"
              >
                <CheckCircle className="w-4 h-4 mr-1.5 stroke-[2]" />
                Approve & Disburse
              </Button>
            )}
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs font-semibold uppercase tracking-wider">Interest Rate</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base mt-0.5 block">{loan.interestRateAnnual}% p.a. (Fixed)</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs font-semibold uppercase tracking-wider">Monthly EMI</span>
            <span className="font-bold text-brand-600 dark:text-brand-400 text-base tabular-nums mt-0.5 block">{formatCurrency(loan.emiAmount)}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs font-semibold uppercase tracking-wider">Total Repayable</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base tabular-nums mt-0.5 block">{formatCurrency(loan.totalRepayable)}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 block text-xs font-semibold uppercase tracking-wider">Outstanding Balance</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 text-base tabular-nums mt-0.5 block">{formatCurrency(loan.totalOutstanding)}</span>
          </div>
        </div>
      </div>

      {/* Collateral Details Card */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-bold">Verified Collateral & Pledge Security</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 text-sm">
          {loan.collateralDetails?.gold && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Gross Weight:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{loan.collateralDetails.gold.grossWeightGrams}g</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Net Weight (Purity):</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                  {loan.collateralDetails.gold.netWeightGrams}g ({loan.collateralDetails.gold.karat} Karat)
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Appraised Valuation:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm tabular-nums mt-0.5 block">
                  {formatCurrency(loan.collateralDetails.gold.appraisedValue)}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Ornaments Description:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{loan.collateralDetails.gold.ornamentDescription}</span>
              </div>
            </div>
          )}

          {loan.collateralDetails?.bike && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Make & Model:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                  {loan.collateralDetails.bike.vehicleMake} {loan.collateralDetails.bike.vehicleModel}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Registration No:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                  {loan.collateralDetails.bike.registrationNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Engine / Chassis:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-xs mt-0.5 block">
                  {loan.collateralDetails.bike.chassisNumber}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Valuation:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm tabular-nums mt-0.5 block">
                  {formatCurrency(loan.collateralDetails.bike.vehicleValuation)}
                </span>
              </div>
            </div>
          )}

          {loan.collateralDetails?.guarantor && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Guarantor Name:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{loan.collateralDetails.guarantor.guarantorName}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Relationship:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{loan.collateralDetails.guarantor.guarantorRelationship}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Contact & Aadhaar:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                  {loan.collateralDetails.guarantor.guarantorPhone}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Declared Income:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm tabular-nums mt-0.5 block">
                  {formatCurrency(loan.collateralDetails.guarantor.guarantorMonthlyIncome)} / mo
                </span>
              </div>
            </div>
          )}

          {loan.collateralDetails?.nominee && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Nominee Name:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">{loan.collateralDetails.nominee.nomineeName}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Relationship:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{loan.collateralDetails.nominee.nomineeRelationship}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-medium">Contact:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">{loan.collateralDetails.nominee.nomineePhone}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Authoritative EMI Schedule Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Authoritative EMI Repayment Schedule
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Server-generated ledger of monthly principal, interest portions, late penalty fines, and receipt references.
            </p>
          </div>

          <Button
            href={`/payments?loanId=${loan.id}`}
            variant="outline"
            size="sm"
            className="text-xs shrink-0 self-start sm:self-auto"
          >
            Record EMI Collection
          </Button>
        </div>

        <EMIScheduleTable schedule={loan.emiSchedule || []} />
      </div>
    </div>
  );
}
