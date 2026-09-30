'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCustomerReport } from '@/hooks/useReports';
import { reportService } from '@/services/report.service';
import { ReportFilterBar } from '@/components/reports/ReportFilterBar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function CustomerReportPage() {
  const [search, setSearch] = useState('');
  const { data: rows = [], isLoading } = useCustomerReport({ search: search || undefined });

  const handleExportCSV = () => {
    reportService.exportToCSV(`Customer_Portfolio_Report_${new Date().toISOString().split('T')[0]}`, rows);
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
            Customer Financial Portfolio Report
          </h1>
          <p className="page-subtitle">
            Consolidated exposure, total savings contributions, and cumulative loan balances by client.
          </p>
        </div>
      </div>

      <ReportFilterBar
        search={search}
        onSearchChange={setSearch}
        onExportCSV={handleExportCSV}
        onPrint={() => window.print()}
      />

      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
          <TableSkeleton rows={5} cols={8} />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Code</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Contact Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Active Chits</TableHead>
                <TableHead>Active Loans</TableHead>
                <TableHead>Total Invested</TableHead>
                <TableHead>Loan Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                      {row.customerCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{row.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{row.phone}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-700 dark:text-slate-300">{row.city}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{row.activeChits}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{row.activeLoans}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(row.totalPaid)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      {formatCurrency(row.outstandingBalance)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'ACTIVE' ? 'success' : 'secondary'} dot>
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
