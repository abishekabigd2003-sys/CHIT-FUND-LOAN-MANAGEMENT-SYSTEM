'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MultiStepCustomerForm } from '@/components/customers/MultiStepCustomerForm';

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/customers"
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Register New Customer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete the 6-step registration process to onboard a subscriber or borrower.
          </p>
        </div>
      </div>

      <MultiStepCustomerForm />
    </div>
  );
}
