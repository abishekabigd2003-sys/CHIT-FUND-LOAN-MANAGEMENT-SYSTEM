'use client';

import React, { useState } from 'react';
import { CollectionTask } from '@/types/collection';
import { useEscalateTask } from '@/hooks/useCollections';
import { formatCurrency } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface EscalateTaskModalProps {
  task: CollectionTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EscalateTaskModal({ task, isOpen, onClose }: EscalateTaskModalProps) {
  const [stage, setStage] = useState<'MID' | 'LEGAL' | 'SETTLEMENT'>('LEGAL');
  const [notes, setNotes] = useState('');
  const escalateMutation = useEscalateTask();

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    try {
      await escalateMutation.mutateAsync({
        taskId: task.id,
        stage,
        notes,
      });
      onClose();
    } catch (err) {
      console.error('Failed to escalate task:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Escalate to Recovery Pipeline"
      description={`Customer: ${task.customerName} (${task.loanNumber})`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
          <p className="font-semibold text-rose-900 dark:text-rose-200 text-sm">
            {task.customerName} • {task.loanNumber}
          </p>
          <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
            Total Outstanding: <span className="font-bold">{formatCurrency(task.totalOutstanding)}</span> •{' '}
            <span className="font-bold">{task.daysOverdue} Days Overdue</span>
          </p>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-xs">
            Escalation Destination
          </label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as any)}
            className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          >
            <option value="LEGAL">Legal Notice & Auction Proceedings</option>
            <option value="MID">Senior Field Recovery Squad</option>
            <option value="SETTLEMENT">One-Time Settlement (OTS) Waiver Review</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-xs">
            Escalation Justification & Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Unreachable on registered mobile, repeated breach of promise, collateral repossession initiated..."
            className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            required
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            disabled={!notes.trim()}
            isLoading={escalateMutation.isPending}
            loadingText="Escalating..."
          >
            Confirm Escalation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
