'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IndianRupee } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useCreateChit } from '@/hooks/useChits';
import { chitSchemeSchema, ChitSchemeFormData } from '@/lib/validations/chit';
import { formatCurrency } from '@/lib/utils';

export function ChitSchemeForm() {
  const router = useRouter();
  const createChitMutation = useCreateChit();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChitSchemeFormData>({
    resolver: zodResolver(chitSchemeSchema),
    defaultValues: {
      schemeName: '',
      totalValue: 500000,
      durationMonths: 20,
      totalMembers: 20,
      foremanCommissionPct: 5,
      startDate: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  const totalValue = watch('totalValue') || 0;
  const durationMonths = watch('durationMonths') || 1;
  const totalMembers = watch('totalMembers') || 1;
  const foremanPct = watch('foremanCommissionPct') || 5;

  const calculatedMonthlyDue = totalMembers > 0 ? Math.round(totalValue / totalMembers) : 0;
  const foremanAmount = Math.round((totalValue * foremanPct) / 100);

  const onSubmit = async (data: ChitSchemeFormData) => {
    try {
      const res = await createChitMutation.mutateAsync({
        ...data,
        monthlyContribution: calculatedMonthlyDue,
      });
      router.push(`/chits/${res.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto border-slate-200 dark:border-slate-800 shadow-xs">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Chit Scheme Parameters</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Define the chit corpus value, member capacity, tenure, and foreman charges.</p>
          </div>

          <Input
            label="Scheme Title / Display Name"
            required
            placeholder="e.g. Royal Wealth 5 Lakh Scheme"
            {...register('schemeName')}
            error={errors.schemeName?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Chit Value (₹ Corpus)"
              type="number"
              required
              placeholder="500000"
              {...register('totalValue')}
              error={errors.totalValue?.message}
            />

            <Input
              label="Duration (Months)"
              type="number"
              required
              placeholder="20"
              {...register('durationMonths')}
              error={errors.durationMonths?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Total Members (Subscribers)"
              type="number"
              required
              placeholder="20"
              {...register('totalMembers')}
              error={errors.totalMembers?.message}
            />

            <Input
              label="Foreman Commission (%)"
              type="number"
              step="0.5"
              required
              placeholder="5"
              {...register('foremanCommissionPct')}
              error={errors.foremanCommissionPct?.message}
            />

            <Input
              label="First Auction Date / Launch"
              type="date"
              required
              {...register('startDate')}
              error={errors.startDate?.message}
            />
          </div>

          {/* Dynamic Calculation Preview */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
            <p className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700/80 pb-1 flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Dynamic Installment Breakdown (UX Preview)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">Monthly Due / Member:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{formatCurrency(calculatedMonthlyDue)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Foreman Fee:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">{formatCurrency(foremanAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Max Prize Pool:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{formatCurrency(totalValue - foremanAmount)}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 pt-1 italic">
              Note: Backend financial calculation services will govern authoritative ledger installments and prize disbursements.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide mb-1.5">
              Scheme Description & Terms
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Describe target subscribers, auction schedule rules, and eligibility criteria..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-slate-100 focus:border-brand-600 dark:focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createChitMutation.isPending}
            >
              Initialize Chit Scheme
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
