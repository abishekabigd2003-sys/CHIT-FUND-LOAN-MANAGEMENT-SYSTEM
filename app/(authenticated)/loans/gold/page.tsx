'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coins, PlusCircle, ArrowLeft } from 'lucide-react';
import { useLoans } from '@/hooks/useLoans';
import { LoanListTable } from '@/components/loans/LoanListTable';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function GoldLoansPage() {
  const router = useRouter();
  const { data: loans = [], isLoading } = useLoans({ type: 'GOLD' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/loans" prefetch={true} className="text-slate-400 hover:text-slate-600 text-xs sm:text-sm font-medium flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Loans
            </Link>
          </div>
          <h1 className="page-title">
            Gold Loan Portfolio
          </h1>
          <p className="page-subtitle">
            Active gold jewelry pledge agreements, karat purity assays, and market rate appraisal valuations.
          </p>
        </div>

        <Link href="/loans/new" prefetch={true}>
          <Button variant="primary" size="sm" className="gap-1.5 shadow-2xs font-medium">
            <PlusCircle className="w-4 h-4" />
            <span>New Gold Loan</span>
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <TableSkeleton rows={4} cols={8} />
        </div>
      ) : loans.length === 0 ? (
        <EmptyState
          icon={Coins}
          title="No Gold Loans Found"
          description="There are currently no active gold loan pledge contracts."
          actionLabel="Pledge Gold"
          onAction={() => router.push('/loans/new')}
        />
      ) : (
        <LoanListTable loans={loans} />
      )}
    </div>
  );
}
