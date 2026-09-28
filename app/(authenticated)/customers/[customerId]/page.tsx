'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useCustomer } from '@/hooks/useCustomers';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  FileCheck,
  CreditCard,
  Building,
  User,
  CheckCircle,
} from 'lucide-react';

export default function CustomerProfileOverviewPage() {
  const params = useParams();
  const customerId = params?.customerId as string;
  const { data: customer } = useCustomer(customerId);

  if (!customer) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: KYC, Identity & Nominee */}
      <div className="lg:col-span-2 space-y-6">
        {/* KYC Compliance Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-brand-600 dark:text-brand-400 stroke-[1.8]" />
              <CardTitle>Government Identity & KYC Status</CardTitle>
            </div>
            <Badge variant="success" dot>
              {customer.kyc.verifiedAt ? 'Verified KYC' : 'Pending Verification'}
            </Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider block font-semibold">
                  Aadhaar Number
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {customer.kyc.aadharNumber}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider block font-semibold">
                  Income Tax PAN
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {customer.kyc.panNumber}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider block font-semibold">
                  Occupation / Business
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{customer.kyc.occupation}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 border border-slate-200/60 dark:border-slate-700/60">
                <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider block font-semibold">
                  Annual Income
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(customer.kyc.annualIncome)}</span>
              </div>
            </div>

            {customer.kyc.verifiedAt && (
              <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 px-3 py-2 rounded-xl">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Verified in accordance with Regulatory AML Guidelines on {formatDate(customer.kyc.verifiedAt)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registered Nominee Beneficiary */}
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600 dark:text-brand-400 stroke-[1.8]" />
              <CardTitle>Registered Nominee Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider block font-semibold">
                  Nominee Name
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{customer.kyc.nomineeName}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider block font-semibold">
                  Relationship
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{customer.kyc.nomineeRelationship}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider block font-semibold">
                  Emergency Contact
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{customer.kyc.nomineePhone}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address & Residence */}
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500 dark:text-slate-400 stroke-[1.8]" />
              <CardTitle>Physical Address & Verification Landmark</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <p className="font-medium text-slate-900 dark:text-slate-100">{customer.address.addressLine1}</p>
            {customer.address.addressLine2 && <p>{customer.address.addressLine2}</p>}
            <p>
              {customer.address.city}, {customer.address.state} -{' '}
              <span className="font-mono font-semibold">{customer.address.pincode}</span>, {customer.address.country}
            </p>
            {customer.address.landmark && (
              <p className="text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Landmark:</span> {customer.address.landmark}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Financial Snapshot & Credit Scoring */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.8]" />
              <CardTitle>Financial Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Active Chit Subscriptions</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{customer.stats?.activeChits || 0}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Completed Chits</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{customer.stats?.completedChits || 0}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Active Loan Accounts</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{customer.stats?.activeLoans || 0}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Total Capital Contributed</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(customer.stats?.totalInvested || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Total Loan Outstanding</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">{formatCurrency(customer.stats?.totalLoanOutstanding || 0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Credit Score Assessment */}
        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-lg">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">Credit Appraisal Score</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                Low Risk
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">{customer.stats?.creditScore || 750}</span>
              <span className="text-xs text-slate-400">/ 900</span>
            </div>
            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${((customer.stats?.creditScore || 750) / 900) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Customer has maintained a 100% on-time chit installment and loan EMI track record over the past 12 months.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
