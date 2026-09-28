'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { PaymentListTable } from '@/components/payments/PaymentListTable';
import { RecordPaymentModal } from '@/components/payments/RecordPaymentModal';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PaymentRecord } from '@/types/payment';

export default function OverduePaymentsPage() {
  const { data: payments = [], isLoading } = usePayments({ status: 'OVERDUE' });
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/payments" className="text-slate-400 hover:text-slate-600 text-xs flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Payments
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Overdue Dues & Delinquency Recovery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accounts with missed payment deadlines requiring field recovery visits, reminder calls, and late penalty charges.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <TableSkeleton rows={4} cols={8} />
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={AlertCircle}
          title="Zero Overdue Payments"
          description="Congratulations! All active accounts are currently up to date on installments."
        />
      ) : (
        <PaymentListTable
          payments={payments}
          onRecordPayment={(p) => setSelectedPayment(p)}
        />
      )}

      {selectedPayment && (
        <RecordPaymentModal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          defaultCustomerId={selectedPayment.customerId}
          defaultReferenceId={selectedPayment.referenceCode}
          defaultAmount={selectedPayment.amountDue}
        />
      )}
    </div>
  );
}
