'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assessmentFormSchema, AssessmentFormValues } from '@/lib/validations/assessment';
import { useCreateAssessment } from '@/hooks/useAssessment';
import { useCustomers } from '@/hooks/useCustomers';
import { formatCurrency } from '@/lib/utils';
import {
  User,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Send,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Building,
  Check,
  Percent,
} from 'lucide-react';
import { CreditScoreGauge } from './CreditScoreGauge';
import { Button } from '@/components/ui/Button';

export function AssessmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const { data: customerResponse } = useCustomers();
  const customers = customerResponse?.data || [];
  const createAssessmentMutation = useCreateAssessment();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      customerId: '',
      loanType: 'BUSINESS',
      requestedAmount: 200000,
      requestedTenureMonths: 12,
      monthlyIncome: 60000,
      existingObligations: [],
      collateralDetails: {
        type: '',
        description: '',
        estimatedValue: 0,
      },
      assessorRemarks: 'Comprehensive credit profile and past transaction assessment conducted.',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'existingObligations',
  });

  const watchedValues = watch();
  const selectedCustomer = customers.find((c) => c.id === watchedValues.customerId);

  // Financial calculations preview (UI preview only as per guidelines)
  const totalMonthlyObligations = (watchedValues.existingObligations || []).reduce(
    (sum, o) => sum + (Number(o.monthlyEmi) || 0),
    0
  );
  const estimatedEmi = Math.round(
    (watchedValues.requestedAmount * (1 + 0.14 * (watchedValues.requestedTenureMonths / 12))) /
      watchedValues.requestedTenureMonths
  );
  const foir = Math.round(
    ((totalMonthlyObligations + estimatedEmi) / (watchedValues.monthlyIncome || 1)) * 100
  );
  const simulatedCreditScore = selectedCustomer?.stats?.creditScore || 745;
  const isEligible = foir <= 55 && simulatedCreditScore >= 600;

  const onSubmit = async (data: AssessmentFormValues) => {
    try {
      const result = await createAssessmentMutation.mutateAsync({
        customerId: data.customerId,
        loanType: data.loanType,
        requestedAmount: data.requestedAmount,
        requestedTenureMonths: data.requestedTenureMonths,
        monthlyIncome: data.monthlyIncome,
        existingObligations: data.existingObligations,
        collateralDetails: data.collateralDetails,
        assessorRemarks: data.assessorRemarks,
      });
      router.push(`/assessments/${result.id}`);
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    }
  };

  const steps = [
    { num: 1, title: 'Customer Selection', desc: 'Identity & KYC' },
    { num: 2, title: 'Loan & Income Details', desc: 'Product & Disposable Income' },
    { num: 3, title: 'Obligations & Bureau', desc: 'External Liabilities & FOIR' },
    { num: 4, title: 'Summary & Owner Approval', desc: 'Credit Review & Sign-Off' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stepper Header: 2026 Enterprise FinTech Stepper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {steps.map((s) => {
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => s.num < step && setStep(s.num)}
                disabled={s.num > step}
                className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-xl text-left transition-all duration-200 ${
                  isCurrent
                    ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/30 shadow-2xs'
                    : isCompleted
                    ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/5 cursor-pointer'
                    : 'text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-transform ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-xs scale-105'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : s.num}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold truncate block">{s.title}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate block hidden sm:block">
                    {s.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Customer Selection */}
        {step === 1 && (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in-50 duration-200">
            {/* Top Accent Sheen */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-indigo-500" />

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  Step 1 of 4
                </span>
                <span className="text-xs text-slate-400">• Borrower Eligibility Intake</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Select Customer Profile
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choose an existing registered customer or review their current KYC compliance status before loan appraisal.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Customer Record <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('customerId')}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden transition-all"
              >
                <option value="">-- Choose Registered Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.customerCode} - {c.firstName} {c.lastName} ({c.phone})
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="text-[11px] text-rose-500 font-medium mt-1.5">{errors.customerId.message}</p>
              )}
            </div>

            {selectedCustomer && (
              <div className="p-5 rounded-xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {selectedCustomer.firstName} {selectedCustomer.lastName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {selectedCustomer.kyc.occupation} • Phone: {selectedCustomer.phone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      KYC Verified
                    </span>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                      Aadhaar: {selectedCustomer.kyc.aadharNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Annual Income</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono mt-0.5 block">
                      {formatCurrency(selectedCustomer.kyc.annualIncome)}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Bureau Score</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400 text-sm font-mono mt-0.5 block">
                      {selectedCustomer.stats?.creditScore || 720}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Active Loans</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono mt-0.5 block">
                      {selectedCustomer.stats?.activeLoans || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={!watchedValues.customerId}
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-semibold shadow-xs"
              >
                Continue to Loan Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Loan & Income Details */}
        {step === 2 && (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in-50 duration-200">
            {/* Top Accent Sheen */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-indigo-500" />

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  Step 2 of 4
                </span>
                <span className="text-xs text-slate-400">• Product Parameters</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Loan Application & Disposable Income
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Specify product requirements, requested principal, tenure, and verified monthly disposable income.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Loan Product Category
                </label>
                <select
                  {...register('loanType')}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 sm:p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden transition-all"
                >
                  <option value="BUSINESS">Business Working Capital Loan</option>
                  <option value="GOLD">Gold Loan (Pawn & Vaulted)</option>
                  <option value="BIKE">Two-Wheeler Loan</option>
                  <option value="PERSONAL">Personal Term Loan</option>
                  <option value="GUARANTOR">Guarantor Backed Loan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Requested Principal (₹)
                </label>
                <input
                  type="number"
                  {...register('requestedAmount', { valueAsNumber: true })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 sm:p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden font-mono transition-all"
                />
                {errors.requestedAmount && (
                  <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.requestedAmount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Tenure (Months)
                </label>
                <input
                  type="number"
                  {...register('requestedTenureMonths', { valueAsNumber: true })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 sm:p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden font-mono transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                  Verified Monthly Income (₹)
                </label>
                <input
                  type="number"
                  {...register('monthlyIncome', { valueAsNumber: true })}
                  className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 sm:p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden font-mono transition-all"
                />
              </div>
            </div>

            {/* Collateral details if applicable */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Collateral / Security Details (Optional)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    placeholder="Asset Type (e.g. 22K Gold, Property Title, RC Book)"
                    {...register('collateralDetails.type')}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Estimated Appraised Value (₹)"
                    {...register('collateralDetails.estimatedValue', { valueAsNumber: true })}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="font-semibold"
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setStep(3)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-semibold shadow-xs"
              >
                Credit & Obligations
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Obligations & Bureau */}
        {step === 3 && (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in-50 duration-200">
            {/* Top Accent Sheen */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-indigo-500" />

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                  Step 3 of 4
                </span>
                <span className="text-xs text-slate-400">• Credit Bureau & Risk Assessment</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Existing Obligations & Credit Bureau
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Record outside loan liabilities to calculate the customer&apos;s Fixed Obligation to Income Ratio (FOIR).
              </p>
            </div>

            {/* Bureau Score Overview */}
            <CreditScoreGauge
              score={simulatedCreditScore}
              riskBand={simulatedCreditScore >= 750 ? 'EXCELLENT' : simulatedCreditScore >= 680 ? 'GOOD' : 'FAIR'}
            />

            {/* Existing Obligations List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Existing Outstanding Loans / EMIs
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() =>
                    append({
                      institutionName: '',
                      loanType: 'Personal',
                      originalAmount: 50000,
                      outstandingBalance: 30000,
                      monthlyEmi: 2500,
                      status: 'ACTIVE',
                    })
                  }
                  className="font-semibold shadow-2xs"
                >
                  Add Liability
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-center text-xs text-slate-400">
                  No outside liabilities declared. Click &quot;Add Liability&quot; if the borrower has active external credit facilities.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {fields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center text-xs"
                    >
                      <input
                        type="text"
                        placeholder="Lender / Bank Name"
                        {...register(`existingObligations.${idx}.institutionName` as const)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                      <input
                        type="number"
                        placeholder="Outstanding (₹)"
                        {...register(`existingObligations.${idx}.outstandingBalance` as const, { valueAsNumber: true })}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                      <input
                        type="number"
                        placeholder="Monthly EMI (₹)"
                        {...register(`existingObligations.${idx}.monthlyEmi` as const, { valueAsNumber: true })}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-slate-100 font-mono focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <select
                          {...register(`existingObligations.${idx}.status` as const)}
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-[11px] font-semibold"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="SETTLED">Settled</option>
                          <option value="DEFAULTED">Defaulted</option>
                        </select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => remove(idx)}
                          className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 shrink-0"
                          title="Remove liability"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live FOIR preview card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-brand-500/10 via-purple-500/5 to-transparent border border-brand-500/20 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block font-mono">
                    Calculated FOIR: {foir}%
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Regulatory benchmark threshold: max 50% - 55%
                  </span>
                </div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border ${
                    isEligible
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25'
                  }`}
                >
                  {isEligible ? 'Eligible for Sanction' : 'Exceeds FOIR Threshold'}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(2)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="font-semibold"
              >
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setStep(4)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="font-semibold shadow-xs"
              >
                Review & Submit
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Summary & Submit for Owner Approval */}
        {step === 4 && (
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6 animate-in fade-in-50 duration-200">
            {/* Top Accent Sheen */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-indigo-500" />

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Step 4 of 4
                </span>
                <span className="text-xs text-slate-400">• Executive Sign-Off</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                Assessment Summary & Owner Sign-Off
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verify credit appraisal calculations before forwarding to the Owner approval queue and sanction order generation.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/50 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Borrower</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                    {selectedCustomer?.firstName} {selectedCustomer?.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Product</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5 block">
                    {watchedValues.loanType}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Requested Principal</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400 text-sm font-mono mt-0.5 block">
                    {formatCurrency(watchedValues.requestedAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Proposed Tenure</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono mt-0.5 block">
                    {watchedValues.requestedTenureMonths} Months
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">FOIR Ratio</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono mt-0.5 block">
                    {foir}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Estimated Monthly EMI</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono mt-0.5 block">
                    {formatCurrency(estimatedEmi)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[10px] font-bold">Eligibility Status</span>
                  <span className={`font-bold text-sm mt-0.5 block ${isEligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isEligible ? 'Approved for Submission' : 'High Risk Profile'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Staff / Assessor Recommendation Notes <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                {...register('assessorRemarks')}
                placeholder="Include income verification, field remarks, or collateral notes for Owner Review..."
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden transition-all"
              />
              {errors.assessorRemarks && (
                <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.assessorRemarks.message}</p>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(3)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="font-semibold"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={createAssessmentMutation.isPending}
                leftIcon={<Send className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
              >
                Submit for Owner Approval
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
