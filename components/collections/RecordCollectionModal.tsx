'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { collectionRemarkSchema, CollectionRemarkFormValues } from '@/lib/validations/collection';
import { useAddCollectionRemark } from '@/hooks/useCollections';
import { CollectionTask } from '@/types/collection';
import { formatCurrency } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface RecordCollectionModalProps {
  task: CollectionTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecordCollectionModal({ task, isOpen, onClose }: RecordCollectionModalProps) {
  const addRemarkMutation = useAddCollectionRemark();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CollectionRemarkFormValues>({
    resolver: zodResolver(collectionRemarkSchema),
    defaultValues: {
      taskId: task?.id || '',
      interactionType: 'PHONE_CALL',
      outcome: 'Customer contacted and agreed to pay.',
      amountCollected: 0,
      nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      notes: '',
      location: '',
    },
  });

  React.useEffect(() => {
    if (task) {
      reset({
        taskId: task.id,
        interactionType: 'PHONE_CALL',
        outcome: '',
        amountCollected: 0,
        nextFollowUpDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        notes: '',
        location: '',
      });
    }
  }, [task, reset]);

  if (!isOpen || !task) return null;

  const onSubmit = async (data: CollectionRemarkFormValues) => {
    try {
      await addRemarkMutation.mutateAsync({
        taskId: task.id,
        interactionType: data.interactionType,
        outcome: data.outcome,
        amountCollected: data.amountCollected ? Number(data.amountCollected) : undefined,
        nextFollowUpDate: data.nextFollowUpDate,
        notes: data.notes,
        location: data.location,
      });
      onClose();
    } catch (err) {
      console.error('Failed to log collection activity:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Collection Activity & Remarks"
      description={`Task #${task.taskNumber} • ${task.customerName}`}
      size="md"
    >
      <div className="space-y-4">
        {/* Task Quick Summary */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex justify-between text-xs font-semibold">
          <div>
            <span className="text-[10px] text-slate-400 block font-normal">Due Amount</span>
            <span className="text-slate-900 dark:text-slate-100">{formatCurrency(task.dueAmount)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-normal">Already Collected</span>
            <span className="text-emerald-600 font-bold">{formatCurrency(task.collectedAmount)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-normal">Overdue DPD</span>
            <span className={task.daysOverdue > 0 ? 'text-rose-600 font-bold' : 'text-slate-600 dark:text-slate-300'}>
              {task.daysOverdue} Days
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('taskId')} value={task.id} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Activity Mode <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('interactionType')}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="PHONE_CALL">Phone Call</option>
                <option value="FIELD_VISIT">Field Doorstep Visit</option>
                <option value="OFFICE_VISIT">Branch Office Visit</option>
                <option value="WHATSAPP_MESSAGE">WhatsApp / SMS</option>
                <option value="LEGAL_NOTICE">Legal / Demand Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount Collected (₹)
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('amountCollected', { valueAsNumber: true })}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Customer Disposition / Status <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('outcome')}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              >
                <option value="PROMISE_TO_PAY">Promise To Pay (PTP)</option>
                <option value="PAID_PARTIAL">Partial Payment Collected</option>
                <option value="PAID_FULL">Full Payment Cleared</option>
                <option value="CALL_NOT_ANSWERED">No Answer / Ringing</option>
                <option value="WRONG_NUMBER">Incorrect Phone Number</option>
                <option value="DISPUTE_RAISED">Customer Raised EMI Dispute</option>
                <option value="REFUSED_TO_PAY">Refused to Pay / Hostile</option>
              </select>
              {errors.outcome && (
                <p className="text-[11px] text-rose-500 mt-0.5">{errors.outcome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Next Follow-Up Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register('nextFollowUpDate')}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              {errors.nextFollowUpDate && (
                <p className="text-[11px] text-rose-500 mt-0.5">{errors.nextFollowUpDate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Field Visit Location (GPS Address / Area)
            </label>
            <input
              type="text"
              placeholder="e.g. 12/4 Gandhi Street, Anna Nagar West"
              {...register('location')}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Remarks & Customer Feedback <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="State customer conversation details, mode of payment promised, or reason for delay..."
              {...register('notes')}
              className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            {errors.notes && (
              <p className="text-[11px] text-rose-500 mt-0.5">{errors.notes.message}</p>
            )}
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
              variant="primary"
              size="sm"
              isLoading={addRemarkMutation.isPending}
              loadingText="Recording..."
            >
              Record Activity
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
