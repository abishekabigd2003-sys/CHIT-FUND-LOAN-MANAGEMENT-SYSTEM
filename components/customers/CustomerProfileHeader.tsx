'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, ShieldCheck, CreditCard, Coins, Landmark, FileText, ArrowLeft } from 'lucide-react';
import { Customer } from '@/types/customer';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';

interface CustomerProfileHeaderProps {
  customer: Customer;
}

export function CustomerProfileHeader({ customer }: CustomerProfileHeaderProps) {
  const pathname = usePathname();
  const basePath = `/customers/${customer.id}`;

  const tabs = [
    { label: 'Profile Overview', href: basePath, icon: ShieldCheck },
    { label: 'Documents & KYC', href: `${basePath}/documents`, icon: FileText },
    { label: 'Loans', href: `${basePath}/loans`, icon: Landmark },
    { label: 'Chit Funds', href: `${basePath}/chits`, icon: Coins },
    { label: 'Payments', href: `${basePath}/payments`, icon: CreditCard },
  ];

  return (
    <div className="space-y-4">
      <Link
        href="/customers"
        prefetch={true}
        className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1 stroke-[2]" />
        Back to Customer List
      </Link>

      {/* Main Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {customer.avatarUrl ? (
              <img
                src={customer.avatarUrl}
                alt={customer.firstName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-200/80 dark:ring-slate-700 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center shrink-0 shadow-xs">
                {customer.firstName.charAt(0)}{customer.lastName.charAt(0)}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {customer.firstName} {customer.lastName}
                </h1>
                <Badge variant={customer.status === 'ACTIVE' ? 'success' : 'warning'} dot>
                  {customer.status}
                </Badge>
                <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border border-slate-200/60 dark:border-slate-700">
                  {customer.customerCode}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 stroke-[1.8]" />
                  {customer.phone}
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 stroke-[1.8]" />
                  {customer.email}
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 stroke-[1.8]" />
                  {customer.address.city}, {customer.address.state}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
            <div className="text-left md:text-right pr-4">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-bold">
                Total Invested
              </span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(customer.stats?.totalInvested || 0)}
              </span>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-bold">
                Loan Balance
              </span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(customer.stats?.totalLoanOutstanding || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 mt-6 pt-3 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                prefetch={true}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 stroke-[1.8] ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
