'use client';

import React from 'react';
import { Search, Download, Printer } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ReportFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  startDate?: string;
  onStartDateChange?: (val: string) => void;
  endDate?: string;
  onEndDateChange?: (val: string) => void;
  onExportCSV?: () => void;
  onPrint?: () => void;
  children?: React.ReactNode;
}

export function ReportFilterBar({
  search,
  onSearchChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onExportCSV,
  onPrint,
  children,
}: ReportFilterBarProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 no-print">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex-1 w-full lg:max-w-md">
          <Input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search report entries..."
            startIcon={<Search className="w-4 h-4 stroke-[1.8]" />}
            className="h-10 text-sm"
          />
        </div>

        {/* Date Ranges & Custom Selects */}
        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
          {onStartDateChange && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              <span>From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          )}

          {onEndDateChange && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              <span>To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          )}

          {children}

          {/* Action Export Buttons */}
          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
            {onExportCSV && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExportCSV}
                leftIcon={<Download className="w-4 h-4 text-slate-600 dark:text-slate-400 stroke-[1.8]" />}
                title="Export as CSV spreadsheet"
              >
                <span>Export CSV</span>
              </Button>
            )}

            {onPrint && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrint}
                leftIcon={<Printer className="w-4 h-4 text-slate-600 dark:text-slate-400 stroke-[1.8]" />}
                title="Print ledger report"
              >
                <span>Print</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
