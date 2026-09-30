'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, PlusCircle, ArrowLeft } from 'lucide-react';
import { useLoans } from '@/hooks/useLoans';
import { LoanListTable } from '@/components/loans/LoanListTable';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function GuarantorLoansPage() {
  const router = useRouter();
  const { data: loans = [], isLoading } = useLoans({ type: 'GUARANTOR' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/loans" prefetch={true} className="text-slate-400 hover:text-slate-600 text-sm font-medium flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Loans
            </Link>
          </div>
          <h1 className="page-title">
            Guarantor Backed Loans
          </h1>
          <p className="page-subtitle">
            Credit facilities secured by third-party personal guarantors and co-obligation agreements.
          </p>
        </div>

        <Link href="/loans/new" prefetch={true}>
          <Button variant="primary" size="sm" className="gap-2 shadow-2xs">
            <PlusCircle className="w-4 h-4" />
            <span>New Guarantor Loan</span>
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <TableSkeleton rows={4} cols={8} />
        </div>
      ) : loans.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No Guarantor Loans"
          description="There are currently no active guarantor loan agreements."
          actionLabel="Create Guarantor Loan"
          onAction={() => router.push('/loans/new')}
        />
      ) : (
        <LoanListTable loans={loans} />
      )}
    </div>
  );
}
