'use client';

import React from 'react';
import Link from 'next/link';
import { AssessmentWizard } from '@/components/assessments/AssessmentWizard';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function NewAssessmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/assessments"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            New Loan Assessment Appraisal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate customer eligibility, credit score, external liabilities, and forward for Owner Sanction.
          </p>
        </div>
      </div>

      <AssessmentWizard />
    </div>
  );
}
