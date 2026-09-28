'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Landmark } from 'lucide-react';
import { useChit } from '@/hooks/useChits';
import { ChitMembersTable } from '@/components/chits/ChitMembersTable';
import { ChitAuctionsTracker } from '@/components/chits/ChitAuctionsTracker';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ChitDetailPage() {
  const router = useRouter();
  const params = useParams();
  const chitId = params?.chitId as string;
  const { data: scheme, isLoading } = useChit(chitId);
  const [activeTab, setActiveTab] = useState('members');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!scheme) {
    return (
      <EmptyState
        icon={Landmark}
        title="Scheme Not Found"
        description="The requested chit fund scheme could not be located."
        actionLabel="Back to Schemes"
        onAction={() => router.push('/chits')}
      />
    );
  }

  const enrollmentPct = Math.round((scheme.enrolledMembersCount / scheme.totalMembers) * 100);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/chits" className="inline-flex items-center text-xs text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Schemes
      </Link>

      {/* Scheme Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded">
                {scheme.schemeCode}
              </span>
              <Badge variant={scheme.status === 'ACTIVE' ? 'success' : 'info'} dot>
                {scheme.status}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{scheme.schemeName}</h1>
            {scheme.description && (
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">{scheme.description}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-right">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Chit Corpus</span>
              <span className="text-xl font-black text-slate-900">{formatCurrency(scheme.totalValue)}</span>
            </div>
          </div>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Monthly Due / Member</span>
            <span className="font-bold text-slate-900 text-sm">{formatCurrency(scheme.monthlyContribution)}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Subscribers</span>
            <span className="font-bold text-slate-900 text-sm">
              {scheme.enrolledMembersCount} / {scheme.totalMembers} Enrolled
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Current Cycle</span>
            <span className="font-bold text-slate-900 text-sm">
              Month {scheme.currentMonth} of {scheme.durationMonths}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider">Foreman Margin</span>
            <span className="font-bold text-blue-600 text-sm">{scheme.foremanCommissionPct}% Commission</span>
          </div>
        </div>
      </div>

      {/* Tabs for Members vs Auctions */}
      <Tabs
        tabs={[
          { id: 'members', label: 'Subscribers & Tickets', badge: scheme.members?.length || 0 },
          { id: 'auctions', label: 'Monthly Auctions & Dividends', badge: scheme.auctions?.length || 0 },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab Panels */}
      {activeTab === 'members' && (
        <ChitMembersTable
          chitId={scheme.id}
          members={scheme.members || []}
          monthlyContribution={scheme.monthlyContribution}
        />
      )}

      {activeTab === 'auctions' && (
        <ChitAuctionsTracker auctions={scheme.auctions || []} />
      )}
    </div>
  );
}
