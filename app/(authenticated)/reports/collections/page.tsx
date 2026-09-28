'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCollectionReport } from '@/hooks/useReports';
import { reportService } from '@/services/report.service';
import { ReportFilterBar } from '@/components/reports/ReportFilterBar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function CollectionReportPage() {
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('2024-09-01');
  const [endDate, setEndDate] = useState('2024-09-30');

  const { data: rows = [], isLoading } = useCollectionReport({
    search: search || undefined,
    startDate,
    endDate,
  });

  const totalCollected = rows.reduce((acc, r) => acc + r.amount, 0);

  const handleExportCSV = () => {
    reportService.exportToCSV(`Collections_Report_${startDate}_to_${endDate}`, rows);
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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Collections & Recovery Ledger Report
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Audit itemization of all payments collected for Loan EMIs and Chit Fund monthly contributions.
          </p>
        </div>

        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800 text-left sm:text-right shrink-0">
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block font-bold">
            Filtered Total Collections
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-400">
            {formatCurrency(totalCollected)}
          </span>
        </div>
      </div>

      <ReportFilterBar
        search={search}
        onSearchChange={setSearch}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onExportCSV={handleExportCSV}
        onPrint={() => window.print()}
      />

      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
          <TableSkeleton rows={5} cols={7} />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Account Type</TableHead>
                <TableHead>Account Code</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Channel Mode</TableHead>
                <TableHead>Collected By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                      {row.receiptNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{formatDate(row.date)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{row.customerName}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block font-mono">{row.customerCode}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.accountType === 'LOAN' ? 'default' : 'info'}>
                      {row.accountType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {row.referenceCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      {formatCurrency(row.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{row.paymentMode}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{row.collectedBy}</span>
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
