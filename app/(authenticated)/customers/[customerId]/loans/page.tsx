'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Landmark, PlusCircle, ArrowRight } from 'lucide-react';
import { useCustomerLoans } from '@/hooks/useCustomers';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loan } from '@/types/loan';

export default function CustomerLoansPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.customerId as string;
  const { data: loans = [], isLoading } = useCustomerLoans(customerId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Active & Settled Loans
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Collateralized Gold loans, Bike vehicle hypothecation, and personal guarantor lines.
          </p>
        </div>

        <Button
          href={`/loans/new?customerId=${customerId}`}
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4 stroke-[2]" />}
        >
          Apply For Loan
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
          <TableSkeleton rows={3} cols={6} />
        </div>
      ) : loans.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title="No Active Loans"
          description="Customer currently does not hold any open or delinquent loan accounts."
          actionLabel="Create Loan"
          onAction={() => router.push(`/loans/new?customerId=${customerId}`)}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan Code</TableHead>
                <TableHead>Collateral Type</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest / Tenure</TableHead>
                <TableHead>Monthly EMI</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(loans as Loan[]).map((loan: Loan) => (
                <TableRow key={loan.id}>
                  <TableCell>
                    <div>
                      <Link
                        href={`/loans/${loan.id}`}
                        className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-xs sm:text-sm font-mono hover:underline"
                      >
                        {loan.loanCode}
                      </Link>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Disbursed: {formatDate(loan.disbursedAt || loan.createdAt)}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="text-xs font-semibold">
                      {loan.loanType} LOAN
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                      {formatCurrency(loan.principalAmount)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span>{loan.interestRateAnnual}% p.a.</span>
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">
                        {loan.tenureMonths} Months
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {formatCurrency(loan.emiAmount)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">
                      {formatCurrency(loan.totalOutstanding)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={loan.status === 'ACTIVE' ? 'success' : loan.status === 'PENDING_APPROVAL' ? 'warning' : 'secondary'}
                      dot
                    >
                      {loan.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      href={`/loans/${loan.id}`}
                      variant="ghost"
                      size="xs"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5 stroke-[2]" />}
                    >
                      Details & Schedule
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
