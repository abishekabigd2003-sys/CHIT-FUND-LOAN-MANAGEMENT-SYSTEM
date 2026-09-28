'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calculator, Info } from 'lucide-react';
import { LoanType } from '@/types/loan';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useCreateLoan } from '@/hooks/useLoans';
import { mockCustomers } from '@/services/mock-data/customers';
import { generateEMISchedulePreview } from '@/services/loan.service';
import { formatCurrency } from '@/lib/utils';
import { baseLoanSchema, BaseLoanFormData } from '@/lib/validations/loan';
import { LoanProductSelector } from './LoanProductSelector';

interface DynamicLoanFormProps {
  initialLoanType?: LoanType;
}

export function DynamicLoanForm({ initialLoanType = 'GOLD' }: DynamicLoanFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams?.get('customerId') || '';

  const [loanType, setLoanType] = useState<LoanType>(initialLoanType);
  const createLoanMutation = useCreateLoan();

  // Collateral Sub-states
  const [goldData, setGoldData] = useState({
    grossWeightGrams: 45.0,
    netWeightGrams: 42.0,
    karat: 22,
    marketRatePerGram: 6450,
    appraisedValue: 270900,
    ornamentDescription: '2 Gold Bangles + 1 Chain',
  });

  const [bikeData, setBikeData] = useState({
    vehicleMake: 'Honda',
    vehicleModel: 'Activa 6G Premium',
    registrationNumber: 'TN 09 BX 1284',
    engineNumber: 'JF50E12389',
    chassisNumber: 'ME4JF5048K19283',
    vehicleValuation: 85000,
    hypothecated: true,
  });

  const [guarantorData, setGuarantorData] = useState({
    guarantorName: 'K. Rengarajan',
    guarantorPhone: '+91 98402 33445',
    guarantorRelationship: 'Business Partner',
    guarantorAadhar: '9876 5432 1098',
    guarantorAddress: '15, M.G. Road, Chennai',
    guarantorMonthlyIncome: 75000,
  });

  const [nomineeData, setNomineeData] = useState({
    nomineeName: 'L. Meenakshi',
    nomineeRelationship: 'Spouse',
    nomineePhone: '+91 94441 22334',
    nomineeAadhar: '4455 6677 8899',
    nomineeAddress: 'Flat 101, Lake View, Chennai',
  });

  const defaultRates: Record<LoanType, { rate: number; defaultPrincipal: number; defaultTenure: number }> = {
    GOLD: { rate: 11.5, defaultPrincipal: 200000, defaultTenure: 12 },
    BIKE: { rate: 12.0, defaultPrincipal: 60000, defaultTenure: 18 },
    GUARANTOR: { rate: 14.0, defaultPrincipal: 300000, defaultTenure: 24 },
    NOMINEE: { rate: 13.5, defaultPrincipal: 250000, defaultTenure: 24 },
    BUSINESS: { rate: 14.5, defaultPrincipal: 500000, defaultTenure: 24 },
    PERSONAL: { rate: 13.0, defaultPrincipal: 150000, defaultTenure: 12 },
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BaseLoanFormData>({
    resolver: zodResolver(baseLoanSchema),
    defaultValues: {
      customerId: preselectedCustomerId,
      loanType: initialLoanType,
      principalAmount: defaultRates[initialLoanType].defaultPrincipal,
      interestRateAnnual: defaultRates[initialLoanType].rate,
      tenureMonths: defaultRates[initialLoanType].defaultTenure,
      processingFee: Math.round(defaultRates[initialLoanType].defaultPrincipal * 0.01),
      purpose: 'Working Capital / Vehicle / Emergency',
    },
  });

  // Keep type synchronized
  useEffect(() => {
    setValue('loanType', loanType);
    setValue('interestRateAnnual', defaultRates[loanType].rate);
  }, [loanType, setValue]);

  const watchedPrincipal = watch('principalAmount') || 0;
  const watchedRate = watch('interestRateAnnual') || 12;
  const watchedTenure = watch('tenureMonths') || 12;

  // Real-time UI preview of EMI calculation (clearly disclaimed as UX preview, with backend authoritative)
  const emiPreview = generateEMISchedulePreview(
    Number(watchedPrincipal),
    Number(watchedRate),
    Number(watchedTenure)
  );

  const onSubmit = async (data: BaseLoanFormData) => {
    const selectedCustomer = mockCustomers.find((c) => c.id === data.customerId);
    const customerName = selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : 'Customer';
    const customerPhone = selectedCustomer?.phone;

    try {
      const res = await createLoanMutation.mutateAsync({
        input: {
          ...data,
          collateralData: {
            gold: loanType === 'GOLD' ? goldData : undefined,
            bike: loanType === 'BIKE' ? bikeData : undefined,
            guarantor: loanType === 'GUARANTOR' ? guarantorData : undefined,
            nominee: loanType === 'NOMINEE' ? nomineeData : undefined,
          },
        },
        customerName,
        customerPhone,
      });

      router.push(`/loans/${res.id}`);
    } catch (err) {
      console.error('Error submitting loan:', err);
    }
  };

  return (
    <Card className="max-w-5xl mx-auto border-slate-200 dark:border-slate-800 shadow-xs">
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Loan Category Selector Tabs */}
          <LoanProductSelector
            selectedType={loanType}
            onSelect={(type) => setLoanType(type)}
          />

          {/* Customer Selection */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <Select
              label="Borrower Customer"
              required
              {...register('customerId')}
              error={errors.customerId?.message}
              options={mockCustomers.map((c) => ({
                label: `${c.firstName} ${c.lastName} (${c.customerCode}) - ${c.phone}`,
                value: c.id,
              }))}
            />
          </div>

          {/* Financial Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Principal Loan Amount (₹)"
              type="number"
              required
              placeholder="200000"
              {...register('principalAmount')}
              error={errors.principalAmount?.message}
            />

            <Input
              label="Annual Interest Rate (% p.a.)"
              type="number"
              step="0.1"
              required
              placeholder="11.5"
              {...register('interestRateAnnual')}
              error={errors.interestRateAnnual?.message}
            />

            <Input
              label="Tenure (Months)"
              type="number"
              required
              placeholder="12"
              {...register('tenureMonths')}
              error={errors.tenureMonths?.message}
            />
          </div>

          {/* EMI Calculation Preview Card (Authoritative Backend Disclaimer) */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-brand-400" />
                EMI & Interest Preview (Instant UX Estimation)
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Authoritative values from Backend API
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Monthly EMI:</span>
                <span className="font-bold text-white text-base">{formatCurrency(emiPreview.emiAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Interest:</span>
                <span className="font-bold text-amber-400 text-base">{formatCurrency(emiPreview.totalInterest)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Repayable:</span>
                <span className="font-bold text-emerald-400 text-base">{formatCurrency(emiPreview.totalPayable)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Processing Fee:</span>
                <span className="font-bold text-slate-300 text-base">
                  {formatCurrency(Math.round(watchedPrincipal * 0.01))}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>
                Backend rule: The frontend does not hardcode financial truth. Server-side credit calculations will generate the authoritative ledger upon approval.
              </span>
            </p>
          </div>

          {/* Dynamic Collateral Details Section Based on Loan Type */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {loanType === 'GOLD' && 'Gold Ornament Collateral Details'}
                  {loanType === 'BIKE' && 'Two-Wheeler Vehicle Registration Details'}
                  {loanType === 'GUARANTOR' && 'Third-Party Financial Guarantor Details'}
                  {loanType === 'NOMINEE' && 'Nominee Beneficiary Co-Applicant Details'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Provide verified collateral appraisal assets.</p>
              </div>
            </div>

            {/* GOLD COLLATERAL */}
            {loanType === 'GOLD' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Gross Weight (Grams)"
                  type="number"
                  step="0.1"
                  value={goldData.grossWeightGrams}
                  onChange={(e) => setGoldData({ ...goldData, grossWeightGrams: Number(e.target.value) })}
                />
                <Input
                  label="Net Gold Weight (Grams)"
                  type="number"
                  step="0.1"
                  value={goldData.netWeightGrams}
                  onChange={(e) => {
                    const net = Number(e.target.value);
                    const appraised = net * goldData.marketRatePerGram;
                    setGoldData({ ...goldData, netWeightGrams: net, appraisedValue: appraised });
                  }}
                />
                <Input
                  label="Gold Purity (Karat)"
                  type="number"
                  value={goldData.karat}
                  onChange={(e) => setGoldData({ ...goldData, karat: Number(e.target.value) })}
                />
                <Input
                  label="Market Rate / Gram (₹)"
                  type="number"
                  value={goldData.marketRatePerGram}
                  onChange={(e) => {
                    const rate = Number(e.target.value);
                    setGoldData({ ...goldData, marketRatePerGram: rate, appraisedValue: goldData.netWeightGrams * rate });
                  }}
                />
                <Input
                  label="Appraised Value (₹)"
                  type="number"
                  value={goldData.appraisedValue}
                  onChange={(e) => setGoldData({ ...goldData, appraisedValue: Number(e.target.value) })}
                />
                <Input
                  label="Ornament Description"
                  value={goldData.ornamentDescription}
                  onChange={(e) => setGoldData({ ...goldData, ornamentDescription: e.target.value })}
                />
              </div>
            )}

            {/* BIKE COLLATERAL */}
            {loanType === 'BIKE' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Vehicle Make"
                  value={bikeData.vehicleMake}
                  onChange={(e) => setBikeData({ ...bikeData, vehicleMake: e.target.value })}
                />
                <Input
                  label="Vehicle Model"
                  value={bikeData.vehicleModel}
                  onChange={(e) => setBikeData({ ...bikeData, vehicleModel: e.target.value })}
                />
                <Input
                  label="Registration Number"
                  value={bikeData.registrationNumber}
                  onChange={(e) => setBikeData({ ...bikeData, registrationNumber: e.target.value })}
                />
                <Input
                  label="Engine Number"
                  value={bikeData.engineNumber}
                  onChange={(e) => setBikeData({ ...bikeData, engineNumber: e.target.value })}
                />
                <Input
                  label="Chassis Number"
                  value={bikeData.chassisNumber}
                  onChange={(e) => setBikeData({ ...bikeData, chassisNumber: e.target.value })}
                />
                <Input
                  label="Vehicle Valuation (₹)"
                  type="number"
                  value={bikeData.vehicleValuation}
                  onChange={(e) => setBikeData({ ...bikeData, vehicleValuation: Number(e.target.value) })}
                />
              </div>
            )}

            {/* GUARANTOR COLLATERAL */}
            {loanType === 'GUARANTOR' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Guarantor Full Name"
                  value={guarantorData.guarantorName}
                  onChange={(e) => setGuarantorData({ ...guarantorData, guarantorName: e.target.value })}
                />
                <Input
                  label="Guarantor Phone"
                  value={guarantorData.guarantorPhone}
                  onChange={(e) => setGuarantorData({ ...guarantorData, guarantorPhone: e.target.value })}
                />
                <Input
                  label="Relationship"
                  value={guarantorData.guarantorRelationship}
                  onChange={(e) => setGuarantorData({ ...guarantorData, guarantorRelationship: e.target.value })}
                />
                <Input
                  label="Guarantor Aadhaar"
                  value={guarantorData.guarantorAadhar}
                  onChange={(e) => setGuarantorData({ ...guarantorData, guarantorAadhar: e.target.value })}
                />
                <Input
                  label="Monthly Income (₹)"
                  type="number"
                  value={guarantorData.guarantorMonthlyIncome}
                  onChange={(e) => setGuarantorData({ ...guarantorData, guarantorMonthlyIncome: Number(e.target.value) })}
                />
                <Input
                  label="Address"
                  value={guarantorData.guarantorAddress}
                  onChange={(e) => setGuarantorData({ ...guarantorData, guarantorAddress: e.target.value })}
                />
              </div>
            )}

            {/* NOMINEE COLLATERAL */}
            {loanType === 'NOMINEE' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Nominee Name"
                  value={nomineeData.nomineeName}
                  onChange={(e) => setNomineeData({ ...nomineeData, nomineeName: e.target.value })}
                />
                <Input
                  label="Relationship"
                  value={nomineeData.nomineeRelationship}
                  onChange={(e) => setNomineeData({ ...nomineeData, nomineeRelationship: e.target.value })}
                />
                <Input
                  label="Nominee Phone"
                  value={nomineeData.nomineePhone}
                  onChange={(e) => setNomineeData({ ...nomineeData, nomineePhone: e.target.value })}
                />
                <Input
                  label="Nominee Aadhaar"
                  value={nomineeData.nomineeAadhar}
                  onChange={(e) => setNomineeData({ ...nomineeData, nomineeAadhar: e.target.value })}
                />
                <Input
                  label="Nominee Address"
                  value={nomineeData.nomineeAddress}
                  onChange={(e) => setNomineeData({ ...nomineeData, nomineeAddress: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={createLoanMutation.isPending}
            >
              Submit Loan Application
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
