import React from 'react';

import { EMIScheduleItem } from '@/types/loan';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export function EMIScheduleTable({ schedule }: { schedule: EMIScheduleItem[] }) {
  if (!schedule || schedule.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        EMI repayment schedule will be generated automatically once the loan is approved and disbursed by the credit committee.
      </div>
    );
  }

  const getStatusBadge = (status: EMIScheduleItem['status']) => {
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
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Inst #</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>EMI Amount</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Interest</TableHead>
            <TableHead>Outstanding Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Receipt / Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
              <TableCell>
                <span className="font-bold font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700">
                  #{item.installmentNumber}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(item.dueDate)}
                </span>
              </TableCell>

              <TableCell>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                  {formatCurrency(item.emiAmount)}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-sm text-slate-600 dark:text-slate-300 tabular-nums">
                  {formatCurrency(item.principalComponent)}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-sm text-brand-600 dark:text-brand-400 font-semibold tabular-nums">
                  {formatCurrency(item.interestComponent)}
                </span>
              </TableCell>

              <TableCell>
                <span className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                  {formatCurrency(item.outstandingPrincipal)}
                </span>
              </TableCell>

              <TableCell>{getStatusBadge(item.status)}</TableCell>

              <TableCell>
                {item.paidDate ? (
                  <div className="text-sm">
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{formatDate(item.paidDate)}</span>
                    {item.transactionRef && (
                      <span className="text-xs text-slate-400 block font-mono mt-0.5">
                        {item.transactionRef}
                      </span>
                    )}
                  </div>
                ) : item.status === 'OVERDUE' ? (
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Late Fine Applicable</span>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
