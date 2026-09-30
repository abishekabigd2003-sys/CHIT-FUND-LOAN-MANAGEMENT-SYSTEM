'use client';

import React from 'react';
import {
  Receipt,
  Clock,
  Users,
  Landmark,
  Coins,
  ArrowRight,
  AlertTriangle,
  UserCheck,
  FileCheck2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ReportsOverviewPage() {
  const reportModules = [
    {
      title: 'Collection & Recovery Report',
      desc: 'Itemized receipts, payment channel breakdowns (Cash, UPI, NEFT), and staff recovery audits.',
      href: '/reports/collections',
      icon: Receipt,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      title: 'Due & Overdue Report',
      desc: 'Outstanding installment aging, 30+ day delinquency buckets, and projected monthly cash flow.',
      href: '/reports/dues',
      icon: Clock,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50',
    },
    {
      title: 'Overdue Recovery Tracker',
      desc: 'Deep-dive overdue aging buckets, legal escalations, and borrower default recovery analytics.',
      href: '/reports/overdue',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50',
    },
    {
      title: 'Customer Portfolio Report',
      desc: 'Customer KYC completion ratios, total invested capital, cumulative loans borrowed, and credit scores.',
      href: '/reports/customers',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50',
    },
    {
      title: 'Loan Performance & NPA Report',
      desc: 'Asset health across Gold, Bike, and Guarantor loans, recovery percentages, and collateral adequacy.',
      href: '/reports/loans',
      icon: Landmark,
      color: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50',
    },
    {
      title: 'Chit Scheme Performance',
      desc: 'Enrollment progress, monthly auction discount margins, dividend distributions, and foreman margins.',
      href: '/reports/chits',
      icon: Coins,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50',
    },
    {
      title: 'Staff Performance & Recovery',
      desc: 'Agent collection targets, recovery efficiency metrics, and field visit conversion rates.',
      href: '/reports/staff',
      icon: UserCheck,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50',
    },
    {
      title: 'KYC & Regulatory Compliance',
      desc: 'Aadhaar, PAN, and address proof verification audit sheets with rejection status logs.',
      href: '/reports/kyc',
      icon: FileCheck2,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Executive Reports & Financial Audits
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Download regulatory compliance ledgers, collection sheets, and loan portfolio analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {reportModules.map((rep) => {
          const Icon = rep.icon;
          return (
            <Card key={rep.title} className="hover:shadow-md transition-all duration-200 flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 shadow-2xs ${rep.color}`}>
                  <Icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <CardTitle className="text-sm sm:text-base font-bold">{rep.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-normal">
                  {rep.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  href={rep.href}
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="justify-between group font-semibold text-xs sm:text-sm"
                  rightIcon={
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  }
                >
                  Open Report
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
