'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  User,
  Phone,
  MapPin,
  FileCheck,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { useCreateCustomer } from '@/hooks/useCustomers';
import { fullCustomerSchema, FullCustomerFormData } from '@/lib/validations/customer';
import { formatCurrency } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'Basic Info', icon: User },
  { id: 2, label: 'Contact', icon: Phone },
  { id: 3, label: 'Address', icon: MapPin },
  { id: 4, label: 'KYC & Nominee', icon: FileCheck },
  { id: 5, label: 'Review & Verify', icon: ClipboardList },
  { id: 6, label: 'Complete', icon: CheckCircle2 },
];

export function MultiStepCustomerForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [registeredCustomer, setRegisteredCustomer] = useState<any>(null);
  const createCustomerMutation = useCreateCustomer();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FullCustomerFormData>({
    resolver: zodResolver(fullCustomerSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: 'MALE',
      dob: '1992-05-15',
      email: '',
      phone: '',
      alternatePhone: '',
      addressLine1: '',
      addressLine2: '',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      country: 'India',
      aadharNumber: '',
      panNumber: '',
      occupation: '',
      annualIncome: 600000,
      nomineeName: '',
      nomineeRelationship: 'Spouse',
      nomineePhone: '',
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof FullCustomerFormData)[] = [];
    if (currentStep === 1) fieldsToValidate = ['firstName', 'lastName', 'gender', 'dob'];
    if (currentStep === 2) fieldsToValidate = ['email', 'phone'];
    if (currentStep === 3) fieldsToValidate = ['addressLine1', 'city', 'state', 'pincode'];
    if (currentStep === 4) {
      fieldsToValidate = [
        'aadharNumber',
        'panNumber',
        'occupation',
        'annualIncome',
        'nomineeName',
        'nomineeRelationship',
        'nomineePhone',
      ];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FullCustomerFormData) => {
    try {
      const res = await createCustomerMutation.mutateAsync(data);
      setRegisteredCustomer(res);
      setCurrentStep(6);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const values = getValues();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Step Indicator Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="grid grid-cols-6 gap-2">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900/60 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[11px] mt-1.5 font-medium hidden sm:block ${
                    isCurrent ? 'text-brand-600 dark:text-brand-400 font-semibold' : isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content Container */}
      <Card className="shadow-xs border-slate-200">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in-50 duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-semibold text-slate-900">Step 1: Basic Information</h3>
                  <p className="text-xs text-slate-500">Provide legal identification names as per government identity records.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    required
                    placeholder="e.g. Ramesh"
                    {...register('firstName')}
                    error={errors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    required
                    placeholder="e.g. Chandran"
                    {...register('lastName')}
                    error={errors.lastName?.message}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Gender"
                    required
                    options={[
                      { label: 'Male', value: 'MALE' },
                      { label: 'Female', value: 'FEMALE' },
                      { label: 'Other', value: 'OTHER' },
                    ]}
                    {...register('gender')}
                  />
                  <Input
                    label="Date of Birth"
                    type="date"
                    required
                    {...register('dob')}
                    error={errors.dob?.message}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in-50 duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-semibold text-slate-900">Step 2: Contact Details</h3>
                  <p className="text-xs text-slate-500">Active mobile numbers for automated EMI alerts and transaction receipts.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Primary Mobile Phone"
                    required
                    placeholder="+91 98400 12345"
                    {...register('phone')}
                    error={errors.phone?.message}
                  />
                  <Input
                    label="Alternate Mobile Phone"
                    placeholder="+91 94440 67890 (Optional)"
                    {...register('alternatePhone')}
                    error={errors.alternatePhone?.message}
                  />
                </div>

                <Input
                  label="Official / Personal Email"
                  type="email"
                  required
                  placeholder="ramesh.chandran@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in-50 duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-semibold text-slate-900">Step 3: Residential Address</h3>
                  <p className="text-xs text-slate-500">Physical address for document verification and field recovery visits.</p>
                </div>

                <Input
                  label="Address Line 1 (Door / Building / Street)"
                  required
                  placeholder="Flat 302, Green Meadows, 4th Cross"
                  {...register('addressLine1')}
                  error={errors.addressLine1?.message}
                />

                <Input
                  label="Address Line 2 (Area / Locality)"
                  placeholder="T. Nagar / Anna Nagar (Optional)"
                  {...register('addressLine2')}
                  error={errors.addressLine2?.message}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    required
                    placeholder="Chennai"
                    {...register('city')}
                    error={errors.city?.message}
                  />
                  <Input
                    label="State"
                    required
                    placeholder="Tamil Nadu"
                    {...register('state')}
                    error={errors.state?.message}
                  />
                  <Input
                    label="Postal PIN Code"
                    required
                    placeholder="600017"
                    {...register('pincode')}
                    error={errors.pincode?.message}
                  />
                </div>
              </div>
            )}

            {/* Step 4: KYC & Nominee */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in-50 duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-semibold text-slate-900">Step 4: KYC & Nominee Information</h3>
                  <p className="text-xs text-slate-500">Government identity markers and registered nominee beneficiary.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Aadhaar Number (12 Digits)"
                    required
                    placeholder="7654 3210 9876"
                    {...register('aadharNumber')}
                    error={errors.aadharNumber?.message}
                  />
                  <Input
                    label="Income Tax PAN"
                    required
                    placeholder="ABCDE1234F"
                    {...register('panNumber')}
                    error={errors.panNumber?.message}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Occupation / Trade"
                    required
                    placeholder="Textile Merchant / Civil Engineer"
                    {...register('occupation')}
                    error={errors.occupation?.message}
                  />
                  <Input
                    label="Estimated Annual Income (₹)"
                    type="number"
                    required
                    placeholder="600000"
                    {...register('annualIncome')}
                    error={errors.annualIncome?.message}
                  />
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3">
                    Nominee Beneficiary Details
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Nominee Name"
                      required
                      placeholder="e.g. Radhika Chandran"
                      {...register('nomineeName')}
                      error={errors.nomineeName?.message}
                    />
                    <Input
                      label="Relationship"
                      required
                      placeholder="Spouse / Mother / Son"
                      {...register('nomineeRelationship')}
                      error={errors.nomineeRelationship?.message}
                    />
                    <Input
                      label="Nominee Mobile"
                      required
                      placeholder="+91 98401 55667"
                      {...register('nomineePhone')}
                      error={errors.nomineePhone?.message}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-semibold text-slate-900">Step 5: Review & Confirmation</h3>
                  <p className="text-xs text-slate-500">Please review all submitted information before issuing customer registration.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200/80">
                    <p className="font-semibold text-slate-900 border-b border-slate-200 pb-1">Personal Details</p>
                    <p><span className="text-slate-500">Full Name:</span> {values.firstName} {values.lastName}</p>
                    <p><span className="text-slate-500">Gender & DOB:</span> {values.gender} • {values.dob}</p>
                    <p><span className="text-slate-500">Phone:</span> {values.phone}</p>
                    <p><span className="text-slate-500">Email:</span> {values.email}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200/80">
                    <p className="font-semibold text-slate-900 border-b border-slate-200 pb-1">KYC & Financials</p>
                    <p><span className="text-slate-500">Aadhaar:</span> {values.aadharNumber}</p>
                    <p><span className="text-slate-500">PAN:</span> {values.panNumber}</p>
                    <p><span className="text-slate-500">Occupation:</span> {values.occupation}</p>
                    <p><span className="text-slate-500">Annual Income:</span> {formatCurrency(values.annualIncome)}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2 border border-slate-200/80">
                  <p className="font-semibold text-slate-900 border-b border-slate-200 pb-1">Registered Address & Nominee</p>
                  <p><span className="text-slate-500">Address:</span> {values.addressLine1}, {values.city}, {values.state} - {values.pincode}</p>
                  <p><span className="text-slate-500">Nominee:</span> {values.nomineeName} ({values.nomineeRelationship}) - {values.nomineePhone}</p>
                </div>

                <div className="p-4 rounded-xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand-900 dark:text-brand-200">
                  <p className="font-medium">Consent & Compliance Declaration</p>
                  <p className="text-[11px] text-brand-700 dark:text-brand-300 mt-1">
                    By submitting this registration, you confirm that physical or digital verification documents have been collected in compliance with financial ledger regulations.
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Completion */}
            {currentStep === 6 && (
              <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Customer Registered Successfully!</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Customer record created with Code:{' '}
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {registeredCustomer?.customerCode || 'CUST-NEW'}
                  </span>
                  . You can now enroll the customer in chit schemes, disburse loans, or upload KYC verification proofs.
                </p>

                <div className="pt-6 flex items-center justify-center gap-3 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentStep(1);
                      setRegisteredCustomer(null);
                    }}
                  >
                    Register Another
                  </Button>

                  <Button
                    variant="primary"
                    onClick={() => router.push(`/customers/${registeredCustomer?.id || ''}`)}
                  >
                    Go to Customer Profile
                  </Button>
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            {currentStep < 6 && (
              <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" size="sm" onClick={prevStep}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <Button type="button" variant="primary" size="sm" onClick={nextStep}>
                    Next Step
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="success"
                    size="md"
                    isLoading={createCustomerMutation.isPending}
                  >
                    Complete Customer Registration
                  </Button>
                )}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
