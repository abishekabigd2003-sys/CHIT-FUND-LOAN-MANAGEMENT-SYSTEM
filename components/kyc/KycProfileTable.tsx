'use client';

import React from 'react';
import Link from 'next/link';
import { KycProfile } from '@/types/kyc';
import { formatDate } from '@/lib/utils';
import { ShieldCheck, CheckCircle2, Clock, AlertTriangle, XCircle, Eye, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface KycProfileTableProps {
  profiles: KycProfile[];
  isLoading?: boolean;
}

export function KycProfileTable({ profiles, isLoading }: KycProfileTableProps) {
  const getStatusBadge = (status: KycProfile['status']) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 stroke-[2]" /> Fully Verified
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            <Clock className="w-3 h-3 stroke-[1.8]" /> Under Review
          </span>
        );
      case 'REQUIRES_RESUBMISSION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3 stroke-[1.8]" /> Resubmission Required
          </span>
        );
      case 'REJECTED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
            <XCircle className="w-3 h-3 stroke-[2]" /> Rejected
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-r-transparent" />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">Loading KYC profiles...</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-5 h-5 stroke-[2]" />
        </div>
        <p className="text-base font-bold text-slate-800 dark:text-slate-200">No KYC Records Found</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Customer KYC identity portfolios will appear here when their documents are uploaded.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">Customer</th>
            <th className="py-3.5 px-4">KYC Status</th>
            <th className="py-3.5 px-4">Risk Category</th>
            <th className="py-3.5 px-4">Identity (ID)</th>
            <th className="py-3.5 px-4">Address Proof</th>
            <th className="py-3.5 px-4">Income Proof</th>
            <th className="py-3.5 px-4">Submitted At</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
          {profiles.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
              <td className="py-3.5 px-4">
                <Link
                  href={`/customers/${p.customerId}/kyc`}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {p.customerName}
                </Link>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{p.customerPhone}</div>
              </td>

              <td className="py-3.5 px-4">{getStatusBadge(p.status)}</td>

              <td className="py-3.5 px-4">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold border tracking-wider uppercase ${
                    p.riskCategory === 'LOW'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                      : p.riskCategory === 'MEDIUM'
                      ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20'
                  }`}
                >
                  {p.riskCategory}
                </span>
              </td>

              <td className="py-3.5 px-4">
                <span
                  className={`text-[11px] font-semibold ${
                    p.identityStatus === 'VERIFIED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {p.identityStatus}
                </span>
              </td>

              <td className="py-3.5 px-4">
                <span
                  className={`text-[11px] font-semibold ${
                    p.addressStatus === 'VERIFIED'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : p.addressStatus === 'REJECTED'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {p.addressStatus}
                </span>
              </td>

              <td className="py-3.5 px-4">
                <span
                  className={`text-[11px] font-semibold ${
                    p.incomeStatus === 'VERIFIED' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {p.incomeStatus}
                </span>
              </td>

              <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-xs">
                {formatDate(p.submittedAt)}
              </td>

              <td className="py-3.5 px-4 text-right">
                <Button
                  href={`/customers/${p.customerId}/kyc`}
                  variant="outline"
                  size="xs"
                  leftIcon={<Eye className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />}
                >
                  Inspect
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
