'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Coins, ArrowRight } from 'lucide-react';
import { useCustomerChits } from '@/hooks/useCustomers';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ChitScheme } from '@/types/chit';

export default function CustomerChitsPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.customerId as string;
  const { data: schemes = [], isLoading } = useCustomerChits(customerId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Chit Fund Scheme Subscriptions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Active and matured chit memberships, prize auction awards, and dividend receipts.
          </p>
        </div>

        <Button
          href="/chits"
          variant="outline"
          size="sm"
        >
          Browse All Schemes
        </Button>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4">
          <TableSkeleton rows={3} cols={6} />
        </div>
      ) : schemes.length === 0 ? (
        <EmptyState
          icon={Coins}
          title="No Chit Subscriptions"
          description="This customer is not enrolled in any chit fund schemes yet."
          actionLabel="Enroll in Chit Scheme"
          onAction={() => router.push('/chits')}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scheme Details</TableHead>
                <TableHead>Ticket #</TableHead>
                <TableHead>Monthly Dues</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Prize Status</TableHead>
                <TableHead>Dividends Earned</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(schemes as ChitScheme[]).map((scheme: ChitScheme) => {
                const sub = scheme.members?.find((m) => m.customerId === customerId);
                return (
                  <TableRow key={scheme.id}>
                    <TableCell>
                      <div>
                        <Link
                          href={`/chits/${scheme.id}`}
                          className="font-semibold text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 text-xs sm:text-sm hover:underline"
                        >
                          {scheme.schemeName}
                        </Link>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                          {scheme.schemeCode} • {formatCurrency(scheme.totalValue)}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        #{sub?.ticketNumber || 1}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                        {formatCurrency(scheme.monthlyContribution)}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="text-xs">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          Month {scheme.currentMonth} of {scheme.durationMonths}
                        </span>
                        <div className="w-24 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-brand-600 h-full rounded-full"
                            style={{
                              width: `${(scheme.currentMonth / scheme.durationMonths) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      {sub?.isPrized ? (
                        <div className="space-y-0.5">
                          <Badge variant="success" dot>Prized (M-{sub.prizedMonth})</Badge>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                            Bid: {formatCurrency(sub.prizedAmount || 0)}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="secondary">Non-Prized</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                        {formatCurrency(sub?.dividendEarned || 0)}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        href={`/chits/${scheme.id}`}
                        variant="ghost"
                        size="xs"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5 stroke-[2]" />}
                      >
                        View Scheme
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
