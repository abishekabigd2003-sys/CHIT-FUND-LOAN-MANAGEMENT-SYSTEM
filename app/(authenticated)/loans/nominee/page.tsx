'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, PlusCircle, ArrowLeft } from 'lucide-react';
import { useLoans } from '@/hooks/useLoans';
import { LoanListTable } from '@/components/loans/LoanListTable';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NomineeLoansPage() {
  const router = useRouter();
  const { data: loans = [], isLoading } = useLoans({ type: 'NOMINEE' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/loans" prefetch={true} className="text-slate-400 hover:text-slate-600 text-sm font-medium flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Loans
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Nominee Co-Applicant Loans
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Credit lines secured with registered nominee co-signers and family beneficiary pledges.
          </p>
        </div>

        <Link href="/loans/new" prefetch={true}>
          <Button variant="primary" size="sm" className="gap-2 shadow-2xs">
            <PlusCircle className="w-4 h-4" />
            <span>New Nominee Loan</span>
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <TableSkeleton rows={4} cols={8} />
        </div>
      ) : loans.length === 0 ? (
        <EmptyState
          icon={User}
          title="No Nominee Loans"
          description="There are currently no active nominee-supported loan contracts."
          actionLabel="Create Nominee Loan"
          onAction={() => router.push('/loans/new')}
        />
      ) : (
        <LoanListTable loans={loans} />
      )}
    </div>
  );
}
