'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Receipt } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useRecordPayment } from '@/hooks/usePayments';
import { recordPaymentSchema, RecordPaymentFormData } from '@/lib/validations/payment';
import { mockCustomers } from '@/services/mock-data/customers';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCustomerId?: string;
  defaultReferenceId?: string;
  defaultCategory?: 'LOAN_EMI' | 'CHIT_INSTALLMENT';
  defaultAmount?: number;
}

export function RecordPaymentModal({
  isOpen,
  onClose,
  defaultCustomerId = 'cust-001',
  defaultReferenceId = 'GL-2024-0089',
  defaultCategory = 'LOAN_EMI',
  defaultAmount = 22158,
}: RecordPaymentModalProps) {
  const recordMutation = useRecordPayment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecordPaymentFormData>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: {
      customerId: defaultCustomerId,
      category: defaultCategory,
      referenceId: defaultReferenceId,
      installmentNumber: 5,
      amountPaid: defaultAmount,
      penaltyAmount: 0,
      paymentMethod: 'UPI',
      transactionReference: '',
      notes: 'Counter collection receipt',
    },
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (data: RecordPaymentFormData) => {
    try {
      await recordMutation.mutateAsync(data);
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment Collection Receipt"
      description="Issue official digital receipt for Loan EMI or Chit Fund monthly subscription."
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Borrower / Subscriber"
          required
          {...register('customerId')}
          error={errors.customerId?.message}
          options={mockCustomers.map((c) => ({
            label: `${c.firstName} ${c.lastName} (${c.customerCode})`,
            value: c.id,
          }))}
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Payment Category"
            required
            {...register('category')}
            options={[
              { label: 'Loan EMI Repayment', value: 'LOAN_EMI' },
              { label: 'Chit Fund Installment', value: 'CHIT_INSTALLMENT' },
              { label: 'Late Penalty Fine', value: 'PENALTY' },
              { label: 'Processing Fee', value: 'FEES' },
            ]}
          />

          <Input
            label="Account Reference Code"
            required
            placeholder="e.g. GL-2024-0089"
            {...register('referenceId')}
            error={errors.referenceId?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Installment Month #"
            type="number"
            required
            {...register('installmentNumber')}
            error={errors.installmentNumber?.message}
          />

          <Input
            label="Amount Paid (₹)"
            type="number"
            required
            {...register('amountPaid')}
            error={errors.amountPaid?.message}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Collection Method"
            required
            {...register('paymentMethod')}
            options={[
              { label: 'UPI / QR Code', value: 'UPI' },
              { label: 'Cash at Counter', value: 'CASH' },
              { label: 'Direct Bank Transfer / NEFT', value: 'BANK_TRANSFER' },
              { label: 'Cheque / Draft', value: 'CHEQUE' },
            ]}
          />

          <Input
            label="Transaction Ref / Cheque No."
            placeholder={paymentMethod === 'UPI' ? 'UPI/4253109...' : 'Ref #'}
            {...register('transactionReference')}
          />
        </div>

        <Input
          label="Staff Internal Remarks"
          placeholder="Receipt notes, field visit remarks..."
          {...register('notes')}
        />

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-sm font-semibold">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            size="sm"
            isLoading={recordMutation.isPending}
            className="text-sm font-semibold gap-1.5 shadow-xs"
          >
            <Receipt className="w-4 h-4 stroke-[1.8]" />
            <span>Issue Receipt</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}
