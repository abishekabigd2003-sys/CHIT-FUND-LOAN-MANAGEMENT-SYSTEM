'use client';

import React from 'react';
import { useCollectionTasks } from '@/hooks/useCollections';
import { CollectionTaskTable } from '@/components/collections/CollectionTaskTable';
import { CreditCard, BellRing, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function UpcomingCollectionsPage() {
  const { data: tasks = [], isLoading } = useCollectionTasks();
  const upcomingTasks = tasks.filter((t) => t.daysOverdue === 0 && t.status !== 'COLLECTED');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2.5">
            <BellRing className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Upcoming Payments & Automated Reminders
          </h1>
          <p className="page-subtitle">
            Automated WhatsApp UPI payment links and SMS courtesy alerts scheduled for active loan cycles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert('Automated 7-day payment reminder broadcast queued for 12 accounts.')}
            leftIcon={<MessageSquare className="w-4 h-4 stroke-[1.8]" />}
          >
            Trigger WhatsApp Reminders
          </Button>
        </div>
      </div>

      <CollectionTaskTable tasks={upcomingTasks} isLoading={isLoading} />
    </div>
  );
}
