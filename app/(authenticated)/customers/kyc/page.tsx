'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useKycProfiles } from '@/hooks/useKyc';
import { KycProfileTable } from '@/components/kyc/KycProfileTable';
import { ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';

export default function CustomerKycPage() {
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const { data: profiles = [], isLoading } = useKycProfiles(
    selectedStatus === 'ALL' ? undefined : selectedStatus
  );

  const tabs = [
    { label: 'All KYC Profiles', value: 'ALL' },
    { label: 'Fully Verified', value: 'VERIFIED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Requires Resubmission', value: 'REQUIRES_RESUBMISSION' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Customer KYC & Regulatory Compliance
          </h1>
          <p className="page-subtitle">
            Audit customer identity, address proofs, financial documentation, and risk categories before loan disbursement.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={`px-3.5 py-1.5 rounded-xl text-[13.5px] sm:text-[14px] font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === tab.value
                ? 'bg-brand-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <KycProfileTable profiles={profiles} isLoading={isLoading} />
    </div>
  );
}
