import React from 'react';
import Link from 'next/link';
import { Receipt, CheckCircle2 } from 'lucide-react';
import { PaymentRecord } from '@/types/payment';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PaymentListTableProps {
  payments: PaymentRecord[];
  onRecordPayment?: (payment: PaymentRecord) => void;
}

export function PaymentListTable({ payments, onRecordPayment }: PaymentListTableProps) {
  const getStatusBadge = (status: PaymentRecord['status']) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="success" dot>Paid</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive" dot>Overdue</Badge>;
      case 'PARTIALLY_PAID':
        return <Badge variant="warning" dot>Partially Paid</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt / Due Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Category & Ref</TableHead>
            <TableHead>Installment</TableHead>
            <TableHead>Amount Due</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Mode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {p.receiptNumber}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {p.paidDate ? `Paid: ${formatDate(p.paidDate)}` : `Due: ${formatDate(p.dueDate)}`}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <Link
                    href={`/customers/${p.customerId}`}
                    className="font-semibold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 text-sm"
                  >
                    {p.customerName}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.customerPhone}</p>
                </div>
              </TableCell>

              <TableCell>
                <div className="text-sm">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {p.category === 'LOAN_EMI' ? 'Loan EMI' : 'Chit Installment'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block font-mono mt-0.5">
                    {p.referenceCode}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                  Month #{p.installmentNumber}
                </span>
              </TableCell>

              <TableCell>
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                  {formatCurrency(p.amountDue)}
                </span>
              </TableCell>

              <TableCell>
                <span className={`font-bold text-sm tabular-nums ${p.amountPaid > 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {formatCurrency(p.amountPaid)}
                </span>
                {p.penaltyPaid ? (
                  <span className="text-xs text-rose-500 font-semibold block mt-0.5">
                    + {formatCurrency(p.penaltyPaid)} Late Fee
                  </span>
                ) : null}
              </TableCell>

              <TableCell>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {p.paymentMethod || 'PENDING'}
                </span>
              </TableCell>

              <TableCell>{getStatusBadge(p.status)}</TableCell>

              <TableCell className="text-right">
                {p.status !== 'PAID' && onRecordPayment ? (
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => onRecordPayment(p)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />}
                  >
                    Collect
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => window.print()}
                    leftIcon={<Receipt className="w-3.5 h-3.5 stroke-[1.8]" />}
                    title="Print Receipt"
                  >
                    Receipt
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
