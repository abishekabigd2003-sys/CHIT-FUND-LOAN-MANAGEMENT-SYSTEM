'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Receipt } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { PaymentListTable } from '@/components/payments/PaymentListTable';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CollectionsLogPage() {
  const { data: payments = [], isLoading } = usePayments({ status: 'PAID' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/payments" className="text-slate-400 hover:text-slate-600 text-xs flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Payments
            </Link>
          </div>
          <h1 className="page-title">
            Collections Receipt Log
          </h1>
          <p className="page-subtitle">
            Audit log of all settled receipts issued across Cash, UPI, and Bank transfer channels.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <TableSkeleton rows={5} cols={8} />
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Collections Logged"
          description="There are currently no recorded collection transactions."
        />
      ) : (
        <PaymentListTable payments={payments} />
      )}
    </div>
  );
}
