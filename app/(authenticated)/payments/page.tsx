'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Receipt, Search, Calendar } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { PaymentListTable } from '@/components/payments/PaymentListTable';
import { RecordPaymentModal } from '@/components/payments/RecordPaymentModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PaymentRecord } from '@/types/payment';

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [category, setCategory] = useState('ALL');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [activePaymentForCollection, setActivePaymentForCollection] = useState<PaymentRecord | null>(null);

  const { data: payments = [], isLoading } = usePayments({
    status: status === 'ALL' ? undefined : (status as any),
    category: category === 'ALL' ? undefined : category,
    search: search || undefined,
  });

  const handleCollect = (payment: PaymentRecord) => {
    setActivePaymentForCollection(payment);
    setIsRecordModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Payment Management & Collections
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Log cash, UPI, and bank collections for Chit Fund subscriptions and Loan EMIs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/payments/schedule" prefetch={true}>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              <span>Calendar View</span>
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setActivePaymentForCollection(null);
              setIsRecordModalOpen(true);
            }}
            className="gap-2 shadow-2xs"
          >
            <Receipt className="w-4 h-4" />
            <span>Record Payment</span>
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, receipt #, or reference code..."
            startIcon={<Search className="w-4 h-4" />}
            className="h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="w-36">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: 'All Statuses', value: 'ALL' },
                { label: 'Paid', value: 'PAID' },
                { label: 'Pending Due', value: 'PENDING' },
                { label: 'Overdue Delinquent', value: 'OVERDUE' },
                { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
              ]}
              className="h-9 text-xs py-1"
            />
          </div>

          <div className="w-40">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { label: 'All Categories', value: 'ALL' },
                { label: 'Loan EMI', value: 'LOAN_EMI' },
                { label: 'Chit Installment', value: 'CHIT_INSTALLMENT' },
              ]}
              className="h-9 text-xs py-1"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <TableSkeleton rows={5} cols={8} />
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Transactions Found"
          description="Record a customer payment receipt or adjust filter parameters."
          actionLabel="Record Payment"
          onAction={() => setIsRecordModalOpen(true)}
        />
      ) : (
        <PaymentListTable payments={payments} onRecordPayment={handleCollect} />
      )}

      {/* Modal */}
      {isRecordModalOpen && (
        <RecordPaymentModal
          isOpen={isRecordModalOpen}
          onClose={() => setIsRecordModalOpen(false)}
          defaultCustomerId={activePaymentForCollection?.customerId}
          defaultReferenceId={activePaymentForCollection?.referenceCode}
          defaultAmount={activePaymentForCollection?.amountDue}
        />
      )}
    </div>
  );
}

