'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { DynamicLoanForm } from '@/components/loans/DynamicLoanForm';
import { Button } from '@/components/ui/Button';

export default function NewLoanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          href="/loans"
          variant="outline"
          size="icon-sm"
          title="Back to Loans"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Issue New Loan Application
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select borrower, collateral type (Gold, Bike, Guarantor, Nominee), interest terms, and appraisal values.
          </p>
        </div>
      </div>

      <DynamicLoanForm />
    </div>
  );
}
