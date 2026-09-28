'use client';

import React from 'react';
import { useCollectionTasks } from '@/hooks/useCollections';
import { CollectionTaskTable } from '@/components/collections/CollectionTaskTable';
import { CreditCard, BellRing, CheckCircle, MessageSquare } from 'lucide-react';

export default function UpcomingCollectionsPage() {
  const { data: tasks = [], isLoading } = useCollectionTasks();
  const upcomingTasks = tasks.filter((t) => t.daysOverdue === 0 && t.status !== 'COLLECTED');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Upcoming Payments & Automated Reminders
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated WhatsApp UPI payment links and SMS courtesy alerts scheduled for active loan cycles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Automated 7-day payment reminder broadcast queued for 12 accounts.')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Trigger WhatsApp Reminders
          </button>
        </div>
      </div>

      <CollectionTaskTable tasks={upcomingTasks} isLoading={isLoading} />
    </div>
  );
}
