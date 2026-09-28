'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Landmark, Search } from 'lucide-react';
import { useLoans } from '@/hooks/useLoans';
import { LoanListTable } from '@/components/loans/LoanListTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoanType, LoanStatus } from '@/types/loan';
import { PermissionGuard } from '@/components/permissions/PermissionGuard';

export default function LoansPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<LoanType | 'ALL'>('ALL');
  const [status, setStatus] = useState<LoanStatus | 'ALL'>('ALL');

  const { data: loans = [], isLoading } = useLoans({
    type,
    status,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Loan Accounts & Collaterals
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Manage Gold loans, Two-wheeler vehicle hypothecations, and Personal guarantor credit facilities.
          </p>
        </div>

        <PermissionGuard permission="loans.create">
          <div className="flex items-center gap-2">
            <Button
              href="/loans/new"
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4 stroke-[2]" />}
            >
              Create Loan Account
            </Button>
          </div>
        </PermissionGuard>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search borrower name or loan code (e.g. GL-2024)..."
            startIcon={<Search className="w-4.5 h-4.5 stroke-[1.8]" />}
            className="h-10 text-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="w-full sm:w-40">
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              options={[
                { label: 'All Loan Types', value: 'ALL' },
                { label: 'Gold Loan', value: 'GOLD' },
                { label: 'Bike Loan', value: 'BIKE' },
                { label: 'Guarantor Loan', value: 'GUARANTOR' },
                { label: 'Nominee Loan', value: 'NOMINEE' },
              ]}
              className="h-10 text-sm"
            />
          </div>

          <div className="w-full sm:w-44">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Pending Approval', value: 'PENDING_APPROVAL' },
                { label: 'Closed / Settled', value: 'CLOSED' },
              ]}
              className="h-10 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Loans Table */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
          <TableSkeleton rows={5} cols={8} />
        </div>
      ) : loans.length === 0 ? (
        <EmptyState
          icon={Landmark}
          title="No Loans Found"
          description="Create a loan application or adjust your search filters."
          actionLabel="Create Loan"
          onAction={() => router.push('/loans/new')}
        />
      ) : (
        <LoanListTable loans={loans} />
      )}
    </div>
  );
}
