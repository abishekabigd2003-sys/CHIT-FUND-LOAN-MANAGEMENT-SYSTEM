'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  Users,
  Coins,
  IndianRupee,
  Clock,
  AlertTriangle,
  PlusCircle,
  FilePlus,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  ClipboardCheck,
  Shield,
  Settings,
  History,
  UserPlus,
} from 'lucide-react';
import { useDashboardSummary } from '@/hooks/useReports';
import { useApprovals } from '@/hooks/useApprovals';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { UpcomingPaymentsList } from '@/components/dashboard/UpcomingPaymentsList';
import { RecentActivitiesList } from '@/components/dashboard/RecentActivitiesList';
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

export default function AdminDashboardPage() {
  const { data, isLoading } = useDashboardSummary();
  const { user } = useAuth();
  const { data: approvals = [] } = useApprovals('PENDING');

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

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[2]" />
              Executive Command Center
            </span>
            <span className="text-xs text-slate-400 font-medium">• Root Administrative Authority</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Executive Owner Dashboard
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
            <span>
              Officer: <strong className="text-slate-700 dark:text-slate-200">{user?.name}</strong> ({user?.email})
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              Branch: <strong className="text-slate-700 dark:text-slate-200">{user?.branch || 'Corporate HQ'}</strong>
            </span>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
              Settlement Engine Active
            </span>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {approvals.length > 0 && (
            <Button
              href="/approvals"
              variant="primary"
              size="sm"
              leftIcon={<ShieldCheck className="w-3.5 h-3.5 stroke-[2]" />}
            >
              Sanctions Queue ({approvals.length})
            </Button>
          )}

          <Button
            href="/settings/users"
            variant="outline"
            size="sm"
            leftIcon={<UserPlus className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />}
          >
            Provision User
          </Button>

          <Button
            href="/loans/new"
            variant="outline"
            size="sm"
            leftIcon={<FilePlus className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />}
          >
            Disburse Loan
          </Button>

          <Button
            href="/settings/roles"
            variant="outline"
            size="sm"
            leftIcon={<Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 stroke-[1.8]" />}
          >
            RBAC Matrix
          </Button>
        </div>
      </div>

      {/* Owner Approvals Alert Banner */}
      {approvals.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-500/10 via-brand-500/5 to-transparent border border-brand-200 dark:border-brand-800/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-600/25">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping shrink-0" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                  {approvals.length} Loan Assessments Require Executive Owner Sanction
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Appraisal officers have verified customer eligibility, collateral valuation, and FOIR metrics.
              </p>
            </div>
          </div>

          <Button
            href="/approvals"
            variant="primary"
            size="sm"
            className="shrink-0 self-start sm:self-auto font-semibold"
          >
            Review Sanctions →
          </Button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3.5">
        <MetricCard
          title="Total Customers"
          value={metrics.totalCustomers.toLocaleString('en-IN')}
          change={metrics.totalCustomersChange}
          icon={Users}
          iconColor="text-brand-600 dark:text-brand-400"
          iconBg="bg-brand-50/80 dark:bg-brand-950/60"
        />

        <MetricCard
          title="Active Loans"
          value={metrics.activeLoans}
          change={metrics.activeLoansChange}
          icon={Coins}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50/80 dark:bg-emerald-950/60"
        />

        <MetricCard
          title="Pending Approvals"
          value={approvals.length}
          subtitle="Owner sign-off"
          icon={ShieldCheck}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50/80 dark:bg-amber-950/60"
          highlight={approvals.length > 0 ? 'warning' : undefined}
        />

        <MetricCard
          title="Today's Collections"
          value={formatCurrency(metrics.todayCollections)}
          change={metrics.todayCollectionsChange}
          icon={IndianRupee}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50/80 dark:bg-emerald-950/60"
          highlight="success"
        />

        <MetricCard
          title="Pending Payments"
          value={formatCurrency(metrics.pendingPaymentsAmount)}
          subtitle={`${metrics.pendingPaymentsCount} accounts due`}
          icon={Clock}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50/80 dark:bg-amber-950/60"
          highlight="warning"
        />

        <MetricCard
          title="Overdue Dues"
          value={formatCurrency(metrics.overduePaymentsAmount)}
          subtitle={`${metrics.overduePaymentsCount} delinquent`}
          icon={AlertTriangle}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-50/80 dark:bg-rose-950/60"
          highlight="destructive"
        />
      </div>

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <CardTitle className="text-base font-bold">Monthly Collections & Recovery</CardTitle>
              <CardDescription className="text-xs">
                Consolidated chit pool installments and loan EMI receipts (6-month comparative trend)
              </CardDescription>
            </div>
            <Button
              href="/reports/collections"
              variant="ghost"
              size="xs"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold"
            >
              Full Analytics
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <MonthlyCollectionChart data={data.monthlyCollections} />
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <CardTitle className="text-base font-bold">Asset Portfolio Mix</CardTitle>
            <CardDescription className="text-xs">
              Exposure distribution across Gold, Bike, Business, and Personal categories
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <LoanDistributionChart data={data.loanTypeDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Operational Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <CardTitle className="text-base font-bold">Upcoming Collection Schedule</CardTitle>
              <CardDescription className="text-xs">
                Scheduled borrower installments and reminders due this week
              </CardDescription>
            </div>
            <Button
              href="/collections/upcoming"
              variant="ghost"
              size="xs"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold"
            >
              Automate Reminders
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <UpcomingPaymentsList payments={data.upcomingPaymentSchedule} />
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 dark:border-slate-800 shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <CardTitle className="text-base font-bold">System Audit Ledger</CardTitle>
              <CardDescription className="text-xs">Real-time immutable event log</CardDescription>
            </div>
            <Button
              href="/audit"
              variant="ghost"
              size="xs"
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
              className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="pt-3">
            <RecentActivitiesList activities={data.recentActivities} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
