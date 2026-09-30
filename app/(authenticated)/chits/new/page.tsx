'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ChitSchemeForm } from '@/components/chits/ChitSchemeForm';
import { Button } from '@/components/ui/Button';

export default function NewChitSchemePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          href="/chits"
          variant="outline"
          size="icon-sm"
          title="Back to Schemes"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="page-title">
            Create Chit Fund Scheme
          </h1>
          <p className="page-subtitle">
            Configure new savings group rules, member limits, and auction frequency.
          </p>
        </div>
      </div>

      <ChitSchemeForm />
    </div>
  );
}
