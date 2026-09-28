'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Award } from 'lucide-react';
import { useChits } from '@/hooks/useChits';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';

export default function ChitSubscriptionsPage() {
  const [search, setSearch] = useState('');
  const { data: schemes = [], isLoading } = useChits();

  // Flatten all subscriptions across schemes
  const allSubscriptions = schemes.flatMap((s) =>
    (s.members || []).map((m) => ({
      ...m,
      schemeName: s.schemeName,
      schemeCode: s.schemeCode,
      monthlyContribution: s.monthlyContribution,
    }))
  );

  const filteredSubs = search
    ? allSubscriptions.filter(
        (sub) =>
          sub.customerName.toLowerCase().includes(search.toLowerCase()) ||
          sub.customerCode.toLowerCase().includes(search.toLowerCase()) ||
          sub.schemeName.toLowerCase().includes(search.toLowerCase()) ||
          sub.schemeCode.toLowerCase().includes(search.toLowerCase())
      )
    : allSubscriptions;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Chit Subscriptions Master Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Consolidated directory of all enrolled members, active ticket allocations, and prize distributions.
          </p>
        </div>

        <Link href="/chits">
          <Button variant="outline" size="sm" className="text-xs">
            View All Schemes
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by subscriber name, ticket #, customer code, or scheme..."
          startIcon={<Search className="w-4 h-4" />}
          className="h-9 text-xs max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <TableSkeleton rows={5} cols={7} />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscriber</TableHead>
                <TableHead>Scheme</TableHead>
                <TableHead>Ticket #</TableHead>
                <TableHead>Monthly Due</TableHead>
                <TableHead>Total Paid</TableHead>
                <TableHead>Dividends Earned</TableHead>
                <TableHead>Prize Status</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubs.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <Link
                        href={`/customers/${sub.customerId}`}
                        className="font-semibold text-slate-900 hover:text-blue-600 text-xs sm:text-sm"
                      >
                        {sub.customerName}
                      </Link>
                      <p className="text-[11px] text-slate-400 font-mono">{sub.customerCode}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <Link
                        href={`/chits/${sub.chitId}`}
                        className="font-medium text-slate-800 hover:text-blue-600 text-xs"
                      >
                        {sub.schemeName}
                      </Link>
                      <p className="text-[11px] text-slate-400 font-mono">{sub.schemeCode}</p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono font-bold text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      #{sub.ticketNumber}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-semibold text-slate-900 text-xs">
                      {formatCurrency(sub.monthlyContribution)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-slate-900 text-xs">
                      {formatCurrency(sub.totalPaid)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-bold text-emerald-600 text-xs">
                      {formatCurrency(sub.dividendEarned)}
                    </span>
                  </TableCell>

                  <TableCell>
                    {sub.isPrized ? (
                      <div className="flex items-center gap-1 text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded w-max">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Prized (M-{sub.prizedMonth})</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Non-Prized</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant={sub.status === 'ACTIVE' ? 'success' : 'secondary'} dot>
                      {sub.status}
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

