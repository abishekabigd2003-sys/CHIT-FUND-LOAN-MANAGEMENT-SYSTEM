'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CreditCard, Receipt } from 'lucide-react';
import { useCustomerPayments } from '@/hooks/useCustomers';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { PaymentRecord } from '@/types/payment';

export default function CustomerPaymentsPage() {
  const params = useParams();
  const customerId = params?.customerId as string;
  const { data: payments = [], isLoading } = useCustomerPayments(customerId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success" dot>Paid</Badge>;
      case 'PARTIALLY_PAID':
        return <Badge variant="warning" dot>Partially Paid</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive" dot>Overdue</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Payment & Collection History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Issued receipts, upcoming collection schedules, and penalty logs.
          </p>
        </div>

        <Button
          href={`/payments?customerId=${customerId}`}
          variant="primary"
          size="sm"
          leftIcon={<Receipt className="w-4 h-4 stroke-[1.8]" />}
        >
          Record Customer Payment
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
          <TableSkeleton rows={4} cols={6} />
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No Payment Records"
          description="There are no payment receipts or dues logged for this customer yet."
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt / Due Date</TableHead>
                <TableHead>Category & Ref</TableHead>
                <TableHead>Installment</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Collected By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(payments as PaymentRecord[]).map((p: PaymentRecord) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {p.receiptNumber}
                      </span>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        {p.paidDate ? formatDate(p.paidDate) : `Due: ${formatDate(p.dueDate)}`}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.category === 'LOAN_EMI' ? 'Loan EMI' : 'Chit Installment'}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-mono">
                        {p.referenceCode}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                      Month #{p.installmentNumber}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {formatCurrency(p.amountPaid)}
                    </span>
                    {p.penaltyPaid ? (
                      <span className="text-[10px] text-rose-500 block">
                        + {formatCurrency(p.penaltyPaid)} Late Fee
                      </span>
                    ) : null}
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {p.paymentMethod || 'PENDING'}
                    </span>
                  </TableCell>

                  <TableCell>{getStatusBadge(p.status)}</TableCell>

                  <TableCell>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{p.collectedBy || '-'}</span>
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
