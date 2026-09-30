'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { PaymentScheduleCalendar } from '@/components/payments/PaymentScheduleCalendar';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function PaymentSchedulePage() {
  const { data: payments = [], isLoading } = usePayments();

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
            Payment Schedule & Calendar View
          </h1>
          <p className="page-subtitle">
            Visualize installment due dates, overdue flags, and field collection workload by calendar day.
          </p>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton rows={4} cols={7} />
      ) : (
        <PaymentScheduleCalendar payments={payments} />
      )}
    </div>
  );
}
