'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useDueReport } from '@/hooks/useReports';
import { reportService } from '@/services/report.service';
import { ReportFilterBar } from '@/components/reports/ReportFilterBar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function DueReportPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');

  const { data: rows = [], isLoading } = useDueReport({
    search: search || undefined,
    status: status === 'ALL' ? undefined : status,
  });

  const totalDueAmount = rows.reduce((acc, r) => acc + r.amountDue, 0);

  const handleExportCSV = () => {
    reportService.exportToCSV(`Dues_Report_${new Date().toISOString().split('T')[0]}`, rows);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 no-print">
            <Link
              href="/reports"
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs flex items-center font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1 stroke-[2]" /> Back to Reports
            </Link>
          </div>
          <h1 className="page-title">
            Dues & Delinquency Aging Report
          </h1>
          <p className="page-subtitle">
            Aging summary of upcoming and delinquent installments for recovery task forces.
          </p>
        </div>

        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 text-left sm:text-right shrink-0">
          <span className="text-[11px] text-rose-800 dark:text-rose-300 uppercase tracking-wider block font-bold">
            Total Outstanding Dues
          </span>
          <span className="text-xl sm:text-2xl font-black text-rose-700 dark:text-rose-400">
            {formatCurrency(totalDueAmount)}
          </span>
        </div>
      </div>

      <ReportFilterBar
        search={search}
        onSearchChange={setSearch}
        onExportCSV={handleExportCSV}
        onPrint={() => window.print()}
      >
        <div className="w-36">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: 'All Dues', value: 'ALL' },
              { label: 'Pending Dues', value: 'PENDING' },
              { label: 'Overdue Dues', value: 'OVERDUE' },
            ]}
            className="h-10 text-xs"
          />
        </div>
      </ReportFilterBar>

      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
          <TableSkeleton rows={5} cols={8} />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Installment</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Overdue Days</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{row.customerName}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-mono">{row.customerCode}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-700 dark:text-slate-300">{row.phone}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.accountType === 'LOAN' ? 'default' : 'info'}>
                      {row.accountType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">{row.referenceCode}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Month #{row.installmentNo}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-700 dark:text-slate-300">{formatDate(row.dueDate)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{formatCurrency(row.amountDue)}</span>
                  </TableCell>
                  <TableCell>
                    {row.overdueDays > 0 ? (
                      <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">{row.overdueDays} Days</span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs">On Schedule</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'OVERDUE' ? 'destructive' : 'warning'} dot>
                      {row.status}
                    </Badge>
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
