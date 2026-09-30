'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Briefcase,
  TrendingUp,
  Percent,
  AlertTriangle,
  Building2,
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Coins,
  IndianRupee,
  Users,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useDashboardSummary } from '@/hooks/useReports';
import { useApprovals } from '@/hooks/useApprovals';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';

const MonthlyCollectionChart = dynamic(
  () => import('@/components/dashboard/MonthlyCollectionChart').then((mod) => mod.MonthlyCollectionChart),
  {
    ssr: false,
    loading: () => <div className="h-72 w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />,
  }
);

const LoanDistributionChart = dynamic(
  () => import('@/components/dashboard/LoanDistributionChart').then((mod) => mod.LoanDistributionChart),
  {
    ssr: false,
    loading: () => <div className="h-72 w-full animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />,
  }
);

export default function ManagementDashboardPage() {
  const { data, isLoading } = useDashboardSummary();
  const { user } = useAuth();
  const { data: pendingApprovals = [] } = useApprovals('PENDING');

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const { metrics } = data;

  const branches = [
    { name: 'Corporate HQ Branch', manager: 'R. Senthil', target: 5000000, collected: 4850000, efficiency: 97 },
    { name: 'Anna Nagar Retail Branch', manager: 'Anand Sundar', target: 3500000, collected: 3220000, efficiency: 92 },
    { name: 'Tambaram West Branch', manager: 'P. Geetha', target: 2800000, collected: 2688000, efficiency: 96 },
    { name: 'T. Nagar Hub', manager: 'K. Balaji', target: 4000000, collected: 3560000, efficiency: 89 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <Briefcase className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 stroke-[2]" />
              Executive Management Oversight
            </span>
            <span className="text-xs text-slate-400 font-medium">• Portfolio Governance & Reporting</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Management Operations Overview
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
            <span>
              Executive: <strong className="text-slate-700 dark:text-slate-200">{user?.name}</strong> ({user?.email})
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              Office: <strong className="text-slate-700 dark:text-slate-200">{user?.branch || 'Executive Directorate'}</strong>
            </span>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
              All Branches Reporting Active
            </span>
          </div>
        </div>

        {/* Executive Report Launchers */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            href="/reports/loans"
            variant="outline"
            size="sm"
            leftIcon={<BarChart3 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />}
          >
            Loan Analytics
          </Button>

          <Button
            href="/reports/collections"
            variant="outline"
            size="sm"
            leftIcon={<TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[1.8]" />}
          >
            Collections Report
          </Button>

          <Button
            href="/reports/overdue"
            variant="outline"
            size="sm"
            leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-rose-500 stroke-[1.8]" />}
          >
            NPA & Delinquency
          </Button>

          <Button
            href="/approvals"
            variant="primary"
            size="sm"
            leftIcon={<ShieldCheck className="w-3.5 h-3.5 stroke-[2]" />}
            className="bg-purple-600 hover:bg-purple-500 shadow-sm"
          >
            Approvals Oversight ({pendingApprovals.length})
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3.5">
        <MetricCard
          title="Portfolio Capital"
          value={formatCurrency(metrics.activeLoans * 450000)}
          change={metrics.activeLoansChange}
          icon={Coins}
          iconColor="text-brand-600 dark:text-brand-400"
          iconBg="bg-brand-50/80 dark:bg-brand-950/60"
        />

        <MetricCard
          title="Collection Rate"
          value="94.6%"
          change={2.3}
          icon={Percent}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50/80 dark:bg-emerald-950/60"
          highlight="success"
        />

        <MetricCard
          title="Monthly Receipts"
          value={formatCurrency(metrics.todayCollections * 26)}
          subtitle="Estimated run-rate"
          icon={IndianRupee}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50/80 dark:bg-emerald-950/60"
        />

        <MetricCard
          title="Active Borrowers"
          value={metrics.totalCustomers.toLocaleString('en-IN')}
          change={metrics.totalCustomersChange}
          icon={Users}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-50/80 dark:bg-purple-950/60"
        />

        <MetricCard
          title="Portfolio At Risk"
          value={formatCurrency(metrics.overduePaymentsAmount)}
          subtitle="PAR 30+ Delinquent"
          icon={AlertTriangle}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50/80 dark:bg-rose-950/60"
          highlight="destructive"
        />

        <MetricCard
          title="Sanction Queue"
          value={pendingApprovals.length}
          subtitle="Pending sanction"
          icon={ShieldCheck}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50/80 dark:bg-amber-950/60"
          highlight={pendingApprovals.length > 0 ? 'warning' : undefined}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <CardTitle className="text-base font-bold">Collections vs Projected Recovery</CardTitle>
              <CardDescription className="text-xs">
                Semi-annual tracking of EMI cash flow and auction dividend returns
              </CardDescription>
            </div>
            <Button
              href="/reports/collections"
              variant="ghost"
              size="xs"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold"
            >
              Detailed Breakdown
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <MonthlyCollectionChart data={data.monthlyCollections} />
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <CardTitle className="text-base font-bold">Collateral Risk Distribution</CardTitle>
            <CardDescription className="text-xs">
              Asset classification of secured vs personal loan portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <LoanDistributionChart data={data.loanTypeDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Branch Performance Matrix */}
      <Card className="border-slate-200/90 dark:border-slate-800 shadow-2xs">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <CardTitle className="text-base font-bold">Retail Branch Efficiency & Collection Targets</CardTitle>
            <CardDescription className="text-xs">Monthly recovery scorecard across operational territories</CardDescription>
          </div>
          <Button
            href="/reports/staff"
            variant="ghost"
            size="xs"
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold"
          >
            View Staff Breakdown
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {branches.map((b) => (
              <div
                key={b.name}
                className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/50 space-y-3.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                      <Building2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{b.name}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.efficiency >= 95
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {b.efficiency}% Target
                  </span>
                </div>

                <div className="text-xs space-y-1.5 pt-1">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Monthly Target:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      {formatCurrency(b.target)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Realized Inflow:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatCurrency(b.collected)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 dark:text-slate-500 text-[11px] pt-0.5 border-t border-slate-200/60 dark:border-slate-800">
                    <span>Branch Head:</span>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{b.manager}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-600 dark:bg-brand-400 h-full rounded-full transition-all"
                    style={{ width: `${b.efficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
