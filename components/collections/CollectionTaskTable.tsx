'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CollectionTask } from '@/types/collection';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RecordCollectionModal } from './RecordCollectionModal';
import { EscalateTaskModal } from './EscalateTaskModal';
import {
  CreditCard,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  WalletCards,
} from 'lucide-react';

interface CollectionTaskTableProps {
  tasks: CollectionTask[];
  isLoading?: boolean;
}

export function CollectionTaskTable({ tasks, isLoading }: CollectionTaskTableProps) {
  const [selectedTaskForRemark, setSelectedTaskForRemark] = useState<CollectionTask | null>(null);
  const [selectedTaskForEscalate, setSelectedTaskForEscalate] = useState<CollectionTask | null>(null);

  const getStatusBadge = (status: CollectionTask['status']) => {
    switch (status) {
      case 'COLLECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3 stroke-[2]" /> Collected
          </span>
        );
      case 'PARTIALLY_COLLECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            Partially Paid
          </span>
        );
      case 'FOLLOW_UP':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <Clock className="w-3 h-3 stroke-[1.8]" /> Follow-Up Set
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20">
            <ShieldAlert className="w-3 h-3 stroke-[2]" /> Escalated
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: CollectionTask['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/25 tracking-wide">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/25 tracking-wide">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/25 tracking-wide">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 tracking-wide">
            LOW
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-brand-600 border-r-transparent" />
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">Loading collection tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <WalletCards className="w-6 h-6 stroke-[2]" />
        </div>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">No Collection Tasks Found</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          All scheduled recovery visits and follow-ups for this filter are completed or up-to-date.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">
              <th className="py-3 px-3.5 whitespace-nowrap">Task & Customer</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Loan Details</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Due / Collected</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Due Date & DPD</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Staff Assigned</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Priority / Status</th>
              <th className="py-3 px-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-normal">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-3.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{task.customerName}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 font-normal">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.customerPhone}</span>
                  </div>
                  <div className="text-[11px] text-brand-600 dark:text-brand-400 font-mono mt-0.5 font-medium">
                    #{task.taskNumber}
                  </div>
                </td>

                <td className="py-3 px-3.5">
                  <Link href={`/loans/${task.loanId}`} prefetch={true} className="font-semibold text-brand-600 dark:text-brand-400 hover:underline font-mono text-sm">
                    {task.loanNumber}
                  </Link>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">{task.loanType}</div>
                </td>

                <td className="py-3 px-3.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums font-mono text-sm">
                    {formatCurrency(task.dueAmount)}
                  </div>
                  {task.collectedAmount > 0 && (
                    <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                      Paid: {formatCurrency(task.collectedAmount)}
                    </div>
                  )}
                </td>

                <td className="py-3 px-3.5">
                  <div className="text-slate-700 dark:text-slate-200 text-sm font-normal">{formatDate(task.dueDate)}</div>
                  {task.daysOverdue > 0 ? (
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> {task.daysOverdue} Days Overdue
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Current Cycle</span>
                  )}
                </td>

                <td className="py-3 px-3.5">
                  <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                    {task.assignedStaffName || 'Unassigned'}
                  </span>
                  {task.nextFollowUpDate && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" /> Next: {formatDate(task.nextFollowUpDate)}
                    </div>
                  )}
                </td>

                <td className="py-3 px-3.5">
                  <div className="flex flex-col gap-1 items-start">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                  </div>
                </td>

                <td className="py-3 px-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => setSelectedTaskForRemark(task)}
                      className="font-medium shadow-2xs"
                    >
                      Log Activity
                    </Button>
                    {task.status !== 'COLLECTED' && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setSelectedTaskForEscalate(task)}
                        className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                        title="Escalate to Legal / Recovery"
                      >
                        <ShieldAlert className="w-4 h-4 stroke-[1.8]" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RecordCollectionModal
        task={selectedTaskForRemark}
        isOpen={!!selectedTaskForRemark}
        onClose={() => setSelectedTaskForRemark(null)}
      />

      <EscalateTaskModal
        task={selectedTaskForEscalate}
        isOpen={!!selectedTaskForEscalate}
        onClose={() => setSelectedTaskForEscalate(null)}
      />
    </>
  );
}
