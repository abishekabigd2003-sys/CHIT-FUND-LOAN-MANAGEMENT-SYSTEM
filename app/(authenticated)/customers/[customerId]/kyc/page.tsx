'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useKycProfile } from '@/hooks/useKyc';
import { KycDocument } from '@/types/kyc';
import { KycVerificationModal } from '@/components/kyc/KycVerificationModal';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  FileText,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CustomerKycDetailPage() {
  const params = useParams();
  const customerId = params.customerId as string;
  const { data: profile, isLoading } = useKycProfile(customerId);

  const [selectedDocForVerify, setSelectedDocForVerify] = useState<KycDocument | null>(null);

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-r-transparent" />
        <p className="mt-2 text-xs text-slate-500">Loading KYC profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">KYC Profile not found</p>
        <Link href="/customers/kyc" className="text-xs text-blue-600 mt-2 inline-block">
          Return to KYC Overview
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/customers/kyc"
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              KYC Dossier: {profile.customerName}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 border border-blue-200 dark:border-blue-800">
              {profile.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {profile.customerPhone} • {profile.customerEmail} • Risk Category: {profile.riskCategory}
          </p>
        </div>
      </div>

      {/* Verification Checklist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <span className="text-[11px] text-slate-400 block uppercase font-semibold">Identity Proof</span>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 block mt-1">
            {profile.identityStatus}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Aadhaar / PAN verification</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <span className="text-[11px] text-slate-400 block uppercase font-semibold">Address Proof</span>
          <span
            className={`text-base font-bold block mt-1 ${
              profile.addressStatus === 'VERIFIED'
                ? 'text-emerald-600'
                : profile.addressStatus === 'REJECTED'
                ? 'text-rose-600'
                : 'text-amber-600'
            }`}
          >
            {profile.addressStatus}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Utility bill or Passport</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <span className="text-[11px] text-slate-400 block uppercase font-semibold">Income Verification</span>
          <span className="text-base font-bold text-slate-900 dark:text-slate-100 block mt-1">
            {profile.incomeStatus}
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Bank statement & ITR/Salary slip</p>
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Compliance Document Repository ({profile.documents.length})
          </h2>
        </div>

        <div className="space-y-3">
          {profile.documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">{doc.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {doc.fileName} • {doc.fileSize} • Uploaded {formatDate(doc.uploadedAt)}
                  </p>
                  {doc.documentNumber && (
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                      Doc No: {doc.documentNumber}
                    </span>
                  )}
                  {doc.rejectionReason && (
                    <div className="mt-1.5 p-2 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[11px] border border-rose-200 dark:border-rose-900">
                      <strong>Rejection Reason:</strong> {doc.rejectionReason}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    doc.status === 'VERIFIED'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border border-emerald-200'
                      : doc.status === 'REJECTED'
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border border-amber-200'
                  }`}
                >
                  {doc.status}
                </span>

                <Button
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="xs"
                  leftIcon={<ExternalLink className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />}
                >
                  Preview
                </Button>

                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => setSelectedDocForVerify(doc)}
                >
                  Verify / Audit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <KycVerificationModal
        customerId={profile.customerId}
        document={selectedDocForVerify}
        isOpen={!!selectedDocForVerify}
        onClose={() => setSelectedDocForVerify(null)}
      />
    </div>
  );
}
