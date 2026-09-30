'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLoanPerformanceReport } from '@/hooks/useReports';
import { reportService } from '@/services/report.service';
import { ReportFilterBar } from '@/components/reports/ReportFilterBar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function LoanPerformanceReportPage() {
  const [search, setSearch] = useState('');
  const { data: rows = [], isLoading } = useLoanPerformanceReport();

  const filtered = search
    ? rows.filter(
        (r) =>
          r.loanCode.toLowerCase().includes(search.toLowerCase()) ||
          r.customerName.toLowerCase().includes(search.toLowerCase()) ||
          r.loanType.toLowerCase().includes(search.toLowerCase())
      )
    : rows;

  const handleExportCSV = () => {
    reportService.exportToCSV(`Loan_Performance_Report_${new Date().toISOString().split('T')[0]}`, filtered);
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
            Loan Portfolio Health & Recovery Analysis
          </h1>
          <p className="page-subtitle">
            Asset classification, principal repayment percentages, overdue installment counters, and risk health.
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
          <TableSkeleton rows={4} cols={8} />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan Code</TableHead>
                <TableHead>Borrower</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Principal Disbursed</TableHead>
                <TableHead>Disbursement Date</TableHead>
                <TableHead>Total Repaid</TableHead>
                <TableHead>Outstanding Balance</TableHead>
                <TableHead>Overdue EMIs</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                      {row.loanCode}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">{row.customerName}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.loanType} LOAN</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                      {formatCurrency(row.principalAmount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{formatDate(row.disbursedDate)}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      {formatCurrency(row.totalCollected)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">
                      {formatCurrency(row.outstandingAmount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.overdueInstallments > 0 ? (
                      <span className="font-bold text-rose-600 dark:text-rose-400 text-xs">
                        {row.overdueInstallments} Installments
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Nil</span>
                    )}
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
