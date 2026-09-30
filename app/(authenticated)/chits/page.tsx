'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Coins, Search } from 'lucide-react';
import { useChits } from '@/hooks/useChits';
import { ChitSchemeCard } from '@/components/chits/ChitSchemeCard';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ChitsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');

  const { data: schemes = [], isLoading } = useChits({
    status: status === 'ALL' ? undefined : status,
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Chit Fund Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Create and monitor registered chit groups, subscriber rosters, and reverse auction settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            href="/chits/subscriptions"
            variant="outline"
            size="sm"
          >
            All Subscriptions
          </Button>
          <Button
            href="/chits/new"
            variant="primary"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4 stroke-[2]" />}
          >
            Create Chit Scheme
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scheme name or code (e.g. CFT-500K)..."
            startIcon={<Search className="w-4 h-4" />}
            className="h-9 sm:h-10 text-sm"
          />
        </div>

        <div className="w-full sm:w-52">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: 'All Schemes', value: 'ALL' },
              { label: 'Active Groups', value: 'ACTIVE' },
              { label: 'Upcoming Enrollments', value: 'UPCOMING' },
              { label: 'Matured & Settled', value: 'COMPLETED' },
            ]}
            className="h-9 sm:h-10 text-sm"
          />
        </div>
      </div>

      {/* Scheme Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : schemes.length === 0 ? (
        <EmptyState
          icon={Coins}
          title="No Chit Schemes Found"
          description="Create a new chit group to start enrolling verified subscribers."
          actionLabel="Create Scheme"
          onAction={() => router.push('/chits/new')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <ChitSchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
}
