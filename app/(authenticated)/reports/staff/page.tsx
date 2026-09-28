'use client';

import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Trophy, Download, ArrowLeft } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';

export default function StaffPerformanceReportPage() {
  const staffOfficers = [
    {
      name: 'Karthik Raman',
      role: 'Senior Recovery Specialist',
      branch: 'Anna Nagar West',
      assignedTasks: 28,
      completedVisits: 26,
      targetAmount: 240000,
      collectedAmount: 218500,
      efficiency: 91.0,
      rating: 'Top Performer',
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Branch Credit Officer',
      branch: 'Adyar Branch',
      assignedTasks: 22,
      completedVisits: 20,
      targetAmount: 180000,
      collectedAmount: 165000,
      efficiency: 91.6,
      rating: 'Excellent',
    },
    {
      name: 'R. Vignesh',
      role: 'Junior Field Collector',
      branch: 'T. Nagar Branch',
      assignedTasks: 19,
      completedVisits: 15,
      targetAmount: 135000,
      collectedAmount: 105000,
      efficiency: 77.7,
      rating: 'Satisfactory',
    },
  ];

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
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500 stroke-[2] shrink-0" />
            Field Staff Performance & Recovery Scorecard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Operational efficiency, doorstep interaction completion rates, and recovery quota achievement.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Download className="w-4 h-4 text-slate-600 dark:text-slate-400 stroke-[1.8]" />}
          className="self-start sm:self-auto shrink-0"
        >
          Export Scorecard
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff Officer</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Tasks Visited / Assigned</TableHead>
              <TableHead>Target Due</TableHead>
              <TableHead>Amount Recovered</TableHead>
              <TableHead>Recovery Efficiency</TableHead>
              <TableHead>Audit Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffOfficers.map((s, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{s.name}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">{s.role}</div>
                </TableCell>
                <TableCell>
                  <span className="text-slate-600 dark:text-slate-300">{s.branch}</span>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {s.completedVisits} / {s.assignedTasks} Visits
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatCurrency(s.targetAmount)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(s.collectedAmount)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-brand-600 dark:text-brand-400">{s.efficiency}%</span>
                </TableCell>
                <TableCell>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {s.rating}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
