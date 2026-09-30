'use client';

import React from 'react';
import Link from 'next/link';
import {
  UserCheck,
  ClipboardCheck,
  PlusCircle,
  CreditCard,
  IndianRupee,
  AlertTriangle,
  Phone,
  Calendar,
  FileText,
  ArrowRight,
  Target,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useDashboardSummary } from '@/hooks/useReports';
import { useMyTasks } from '@/hooks/useCollections';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';

export default function StaffDashboardPage() {
  const { data, isLoading } = useDashboardSummary();
  const { user } = useAuth();
  const staffId = user?.id || 'usr-staff-1';
  const { data: myTasks = [] } = useMyTasks(staffId);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
          <div className="h-96 bg-slate-100 dark:bg-slate-800/60 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const criticalTasks = myTasks.filter((t) => t.priority === 'CRITICAL');
  const pendingTasks = myTasks.filter((t) => t.status !== 'COLLECTED');

  return (
    <div className="space-y-6">
      {/* Top Banner & Header: Field Officer Workspace */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-white via-slate-50/50 to-emerald-50/20 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/10 p-5 sm:p-6 shadow-xs backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <UserCheck className="w-3.5 h-3.5" />
                Field Operations Workspace
              </span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">• Daily Recovery & Assessment Hub</span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-feature-settings">
                Field Officer Dashboard
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Active Officer: <span className="font-semibold text-slate-800 dark:text-slate-200">{user?.name}</span>{' '}
              <span className="text-slate-400 dark:text-slate-500">({user?.email})</span> •{' '}
              <span className="font-medium text-brand-700 dark:text-brand-300">{user?.branch || 'Retail Branch'}</span>
            </p>
          </div>

          {/* Quick Operational Launchers */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <Button
              href="/collections/my-tasks"
              variant="primary"
              size="sm"
              leftIcon={<UserCheck className="w-3.5 h-3.5 stroke-[1.8]" />}
            >
              <span>My Tasks ({myTasks.length})</span>
            </Button>
            <Button
              href="/assessments/new"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold shadow-2xs border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>New Assessment</span>
            </Button>
            <Button
              href="/customers/new"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold shadow-2xs border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Register Borrower</span>
            </Button>
            <Button
              href="/collections"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs font-semibold shadow-2xs border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs"
            >
              <CreditCard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Record Payment</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Staff Daily KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Assigned Tasks Today"
          value={myTasks.length}
          subtitle={`${pendingTasks.length} remaining visits / calls`}
          icon={Calendar}
          iconColor="text-brand-600 dark:text-brand-400"
          iconBg="bg-brand-500/10"
        />

        <MetricCard
          title="Today's Collections"
          value={formatCurrency(42500)}
          subtitle="Target: ₹60,000 (71% achieved)"
          icon={IndianRupee}
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-500/10"
          highlight="success"
        />

        <MetricCard
          title="Critical Overdue Visits"
          value={criticalTasks.length}
          subtitle="Immediate doorstep action required"
          icon={AlertTriangle}
          iconColor="text-rose-600 dark:text-rose-400"
          iconBg="bg-rose-500/10"
          highlight={criticalTasks.length > 0 ? 'destructive' : undefined}
        />

        <MetricCard
          title="Pending Assessments"
          value="3"
          subtitle="Awaiting field credit screening"
          icon={ClipboardCheck}
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-500/10"
          highlight="warning"
        />
      </div>

      {/* Main Field Tasks Worklist & Operational Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Field Worklist Card */}
        <Card className="lg:col-span-2 border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Today&apos;s Field Collection Worklist
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {myTasks.length} Assigned
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Scheduled doorstep recovery visits & telephone follow-ups allocated to your queue
              </CardDescription>
            </div>
            <Link
              href="/collections/my-tasks"
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-4">
            {myTasks.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">All Collections Cleared!</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  No pending collection tasks allocated for today. Check in with the branch supervisor or log remarks on previous visits.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myTasks.slice(0, 5).map((task) => {
                  const isCritical = task.priority === 'CRITICAL';
                  const initials = task.customerName
                    ? task.customerName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'CU';

                  return (
                    <div
                      key={task.id}
                      className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition-all duration-200 shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            isCritical
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                              : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20'
                          }`}
                        >
                          {initials}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {task.customerName}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${
                                isCritical
                                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <div className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                              Acc: {task.loanNumber}
                            </span>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="font-semibold text-rose-600 dark:text-rose-400 font-mono">
                              Due: {formatCurrency(task.dueAmount)}
                            </span>
                            {task.customerPhone && (
                              <>
                                <span className="text-slate-300 dark:text-slate-700">•</span>
                                <a
                                  href={`tel:${task.customerPhone}`}
                                  className="inline-flex items-center gap-1 text-[11px] hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                                >
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{task.customerPhone}</span>
                                </a>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button
                          href={`/collections?search=${encodeURIComponent(task.customerName)}`}
                          variant="primary"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs h-8 px-3"
                        >
                          Collect EMI
                        </Button>
                        <Button
                          href="/collections/my-tasks"
                          variant="outline"
                          size="sm"
                          className="text-xs font-semibold h-8 px-3 border-slate-200 dark:border-slate-800"
                        >
                          Log Remark
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Staff Quick Action Center & Checklist */}
        <div className="space-y-6">
          <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Daily Operations Hub
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Rapid workflow shortcuts & field tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-3.5 space-y-2.5">
              <Link
                href="/customers/new"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-850/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 hover:border-emerald-500/30 transition-all duration-200 group text-xs shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">Register Borrower</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Add personal details & KYC identity</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/assessments/new"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-850/50 hover:bg-brand-50/40 dark:hover:bg-brand-950/20 hover:border-brand-500/30 transition-all duration-200 group text-xs shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 group-hover:scale-105 transition-transform">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">Evaluate Loan Request</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">FOIR score & credit assessment</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/customers/kyc"
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-850/50 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 hover:border-purple-500/30 transition-all duration-200 group text-xs shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block text-xs">KYC Verification Vault</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Upload Aadhaar, PAN & pledges</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </CardContent>
          </Card>

          {/* Daily Collection Target Meter */}
          <Card className="border-slate-200/80 dark:border-slate-800/80 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Daily Recovery Progress
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Target: ₹60,000 for today
                  </CardDescription>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                  71%
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Collected:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                  ₹42,500 <span className="text-xs text-slate-400 font-normal">/ ₹60,000</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: '71%' }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-700 dark:text-slate-300">₹17,500</span> remaining to achieve today&apos;s 100% field incentive tier.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
