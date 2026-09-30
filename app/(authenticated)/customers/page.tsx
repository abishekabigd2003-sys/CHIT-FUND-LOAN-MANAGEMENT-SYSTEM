'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Users } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { useDebounce } from '@/hooks/useDebounce';
import { CustomerFilters } from '@/components/customers/CustomerFilters';
import { CustomerListTable } from '@/components/customers/CustomerListTable';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PermissionGuard } from '@/components/permissions/PermissionGuard';

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useCustomers({
    search: debouncedSearch,
    status,
    page,
    limit: 10,
  });

  const handleReset = () => {
    setSearch('');
    setStatus('ALL');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">
            Customer Directory
          </h1>
          <p className="page-subtitle">
            Manage KYC compliance, chit scheme subscriptions, and loan borrower accounts.
          </p>
        </div>

        <PermissionGuard permission="customers.create">
          <Button
            href="/customers/new"
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-4 h-4 stroke-[2]" />}
          >
            Add New Customer
          </Button>
        </PermissionGuard>
      </div>

      {/* Filter Bar */}
      <CustomerFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onReset={handleReset}
      />

      {/* Content */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
          <TableSkeleton rows={6} cols={6} />
        </div>
      ) : !data?.data || data.data.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers found"
          description="Try adjusting your search criteria or register a new customer."
          actionLabel="Register Customer"
          onAction={() => router.push('/customers/new')}
        />
      ) : (
        <div className="space-y-4">
          <CustomerListTable customers={data.data} />

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-medium">
              Showing {data.data.length} of {data.meta.total} customers
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="font-semibold text-slate-800 dark:text-slate-200 px-1">
                Page {data.meta.page} of {data.meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
