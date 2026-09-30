import React from 'react';
import Link from 'next/link';
import { Landmark, Users, Calendar, ArrowRight } from 'lucide-react';
import { ChitScheme } from '@/types/chit';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

export function ChitSchemeCard({ scheme }: { scheme: ChitScheme }) {
  const enrollmentPct = Math.round((scheme.enrolledMembersCount / scheme.totalMembers) * 100);
  const tenurePct = scheme.durationMonths > 0 ? Math.round((scheme.currentMonth / scheme.durationMonths) * 100) : 0;

  const getStatusBadge = () => {
    switch (scheme.status) {
      case 'ACTIVE':
        return <Badge variant="success" dot pulse>Active Group</Badge>;
      case 'UPCOMING':
        return <Badge variant="info" dot>Enrolling Now</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Settled</Badge>;
      default:
        return <Badge variant="destructive">{scheme.status}</Badge>;
    }
  };

  return (
    <Card className="hover:-translate-y-0.5 hover:shadow-fintech-hover transition-all duration-200 border-slate-200/90 dark:border-slate-800/80 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/80 px-2 py-0.5 rounded-md border border-brand-200/80 dark:border-brand-800/80">
                {scheme.schemeCode}
              </span>
              {getStatusBadge()}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug">
              {scheme.schemeName}
            </h3>
          </div>

          <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-800/60 flex items-center justify-center shrink-0 shadow-2xs">
            <Landmark className="w-4.5 h-4.5 stroke-[1.8]" />
          </div>
        </div>

        {/* Financial Highlights */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold block uppercase tracking-wider">Chit Value</span>
              <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5 block">
                {formatCurrency(scheme.totalValue)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold block uppercase tracking-wider">Monthly Due</span>
              <span className="text-lg sm:text-xl font-bold text-brand-600 dark:text-brand-400 tabular-nums mt-0.5 block">
                {formatCurrency(scheme.monthlyContribution)}
              </span>
            </div>
          </div>

          {/* Members Enrollment Progress */}
          <div className="space-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-200 font-medium">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" />
                <span>Members Enrolled</span>
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {scheme.enrolledMembersCount} / {scheme.totalMembers} ({enrollmentPct}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${enrollmentPct >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-brand-600 to-brand-500'}`}
                style={{ width: `${Math.min(enrollmentPct, 100)}%` }}
              />
            </div>
          </div>

          {/* Auction Progress */}
          {scheme.status === 'ACTIVE' && (
            <div className="space-y-1.5 text-xs sm:text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-200 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" />
                  <span>Cycle Progress</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  Month {scheme.currentMonth} of {scheme.durationMonths}
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(tenurePct, 100)}%` }}
                />
              </div>
            </div>
          )}

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 font-medium">
            <span>Duration: {scheme.durationMonths} Months</span>
            <span>Foreman: {scheme.foremanCommissionPct}% Fee</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0d1527]/50 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Starts: {formatDate(scheme.startDate, 'dd MMM yyyy')}
        </span>

        <Button
          href={`/chits/${scheme.id}`}
          variant="outline"
          size="sm"
          className="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
        >
          <span>Manage Scheme</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 stroke-[2]" />
        </Button>
      </div>
    </Card>
  );
}
