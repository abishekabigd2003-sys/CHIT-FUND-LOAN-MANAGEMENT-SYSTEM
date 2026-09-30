import React from 'react';
import Link from 'next/link';
import { Eye, ChevronRight } from 'lucide-react';
import { Loan, LoanType } from '@/types/loan';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

interface LoanListTableProps {
  loans: Loan[];
}

export function LoanListTable({ loans }: LoanListTableProps) {
  const getLoanTypeBadge = (type: LoanType) => {
    switch (type) {
      case 'GOLD':
        return <Badge variant="warning">Gold Loan</Badge>;
      case 'BIKE':
        return <Badge variant="default">Bike Loan</Badge>;
      case 'GUARANTOR':
        return <Badge variant="success">Guarantor Loan</Badge>;
      case 'NOMINEE':
        return <Badge variant="info">Nominee Loan</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: Loan['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="success" dot pulse>Active</Badge>;
      case 'PENDING_APPROVAL':
        return <Badge variant="warning" dot>Pending Approval</Badge>;
      case 'DISBURSED':
        return <Badge variant="default" dot>Disbursed</Badge>;
      case 'CLOSED':
        return <Badge variant="secondary">Closed</Badge>;
      case 'DEFAULTED':
        return <Badge variant="destructive" dot>Defaulted</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] overflow-hidden shadow-fintech">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loan Code</TableHead>
            <TableHead>Borrower</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Principal Amount</TableHead>
            <TableHead>Monthly EMI</TableHead>
            <TableHead>Outstanding Balance</TableHead>
            <TableHead>Next Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>
                <div>
                  <Link
                    href={`/loans/${loan.id}`}
                    prefetch={true}
                    className="font-mono font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-sm hover:underline"
                  >
                    {loan.loanCode}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                    {formatDate(loan.disbursedAt || loan.createdAt)}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div>
                  <Link
                    href={`/customers/${loan.customerId}`}
                    prefetch={true}
                    className="font-semibold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 text-sm hover:underline"
                  >
                    {loan.customerName}
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">{loan.customerPhone || loan.customerCode}</p>
                </div>
              </TableCell>

              <TableCell>{getLoanTypeBadge(loan.loanType)}</TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                  {formatCurrency(loan.principalAmount)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5 font-normal">
                  {loan.interestRateAnnual}% p.a. • {loan.tenureMonths}M
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm tabular-nums">
                  {formatCurrency(loan.emiAmount)}
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="font-semibold text-rose-600 dark:text-rose-400 text-sm tabular-nums">
                  {formatCurrency(loan.totalOutstanding)}
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap">
                <span className="text-sm font-normal text-slate-700 dark:text-slate-300">
                  {loan.nextDueDate ? formatDate(loan.nextDueDate) : '-'}
                </span>
              </TableCell>

              <TableCell className="whitespace-nowrap">{getStatusBadge(loan.status)}</TableCell>

              <TableCell className="text-right whitespace-nowrap">
                <Button
                  href={`/loans/${loan.id}`}
                  variant="outline"
                  size="xs"
                  leftIcon={<Eye className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />}
                  rightIcon={<ChevronRight className="w-3 h-3 opacity-60 stroke-[2]" />}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
