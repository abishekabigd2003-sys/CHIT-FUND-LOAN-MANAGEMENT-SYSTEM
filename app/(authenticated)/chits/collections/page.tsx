'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useChits } from '@/hooks/useChits';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function ChitCollectionsPage() {
  const { data: schemes = [], isLoading } = useChits();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Chit Collections Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
            Monitor cumulative capital collections, dividend deductions, and foreman fee earnings.
          </p>
        </div>

        <Link href="/payments" prefetch={true}>
          <Button variant="primary" size="sm" className="font-semibold shadow-2xs">
            Open Payment Terminal
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <TableSkeleton rows={4} cols={7} />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scheme Details</TableHead>
                <TableHead>Current Cycle</TableHead>
                <TableHead>Monthly Target</TableHead>
                <TableHead>Gross Pool</TableHead>
                <TableHead>Foreman Earned</TableHead>
                <TableHead>Scheme Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schemes.map((scheme) => {
                const targetMonthly = scheme.monthlyContribution * scheme.totalMembers;
                const grossValue = scheme.totalValue;
                const foremanFee = (scheme.totalValue * scheme.foremanCommissionPct) / 100;

                return (
                  <TableRow key={scheme.id}>
                    <TableCell>
                      <div>
                        <Link
                          href={`/chits/${scheme.id}`}
                          className="font-semibold text-slate-900 hover:text-blue-600 text-xs sm:text-sm"
                        >
                          {scheme.schemeName}
                        </Link>
                        <p className="text-[11px] text-slate-400 font-mono">{scheme.schemeCode}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-slate-800 text-xs">
                        Month {scheme.currentMonth} / {scheme.durationMonths}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-slate-900 text-xs">
                        {formatCurrency(targetMonthly)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-blue-600 text-xs">
                        {formatCurrency(grossValue)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-bold text-emerald-600 text-xs">
                        {formatCurrency(foremanFee)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Badge variant={scheme.status === 'ACTIVE' ? 'success' : 'secondary'} dot>
                        {scheme.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        href={`/chits/${scheme.id}`}
                        variant="outline"
                        size="xs"
                        rightIcon={<ArrowUpRight className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
