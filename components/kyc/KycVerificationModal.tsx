'use client';

import React, { useState } from 'react';
import { KycDocument } from '@/types/kyc';
import { useVerifyKycDocument } from '@/hooks/useKyc';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface KycVerificationModalProps {
  customerId: string;
  document: KycDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export function KycVerificationModal({
  customerId,
  document,
  isOpen,
  onClose,
}: KycVerificationModalProps) {
  const [action, setAction] = useState<'APPROVE' | 'REJECT' | 'REQUEST_RESUBMISSION'>('APPROVE');
  const [remarks, setRemarks] = useState('');
  const verifyMutation = useVerifyKycDocument();

  if (!isOpen || !document) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim() && action !== 'APPROVE') return;

    try {
      await verifyMutation.mutateAsync({
        customerId,
        documentId: document.id,
        action,
        remarks: remarks || 'Document verified against government registry / database.',
      });
      onClose();
    } catch (err) {
      console.error('Verification failed:', err);
    }
  };

  const getActionTheme = () => {
    switch (action) {
      case 'APPROVE':
        return {
          btnVariant: 'success' as const,
          btnText: 'Confirm Approval',
        };
      case 'REJECT':
        return {
          btnVariant: 'destructive' as const,
          btnText: 'Confirm Rejection',
        };
      case 'REQUEST_RESUBMISSION':
      default:
        return {
          btnVariant: 'warning' as const,
          btnText: 'Request Resubmission',
        };
    }
  };

  const theme = getActionTheme();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify KYC Compliance Document"
      description={`Customer ID: ${customerId}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="min-w-0">
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm block truncate">
              {document.title}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 block">
              {document.fileName} • {document.fileSize}
            </span>
          </div>
          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-semibold hover:border-brand-400 dark:hover:border-brand-600 shrink-0 text-xs shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 stroke-[1.8]" />
            <span>Preview File</span>
          </a>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-xs">
            Verification Decision
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setAction('APPROVE')}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[38px] cursor-pointer ${
                action === 'APPROVE'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold ring-1 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2]" />
              <span>Approve</span>
            </button>

            <button
              type="button"
              onClick={() => setAction('REQUEST_RESUBMISSION')}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[38px] cursor-pointer ${
                action === 'REQUEST_RESUBMISSION'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 font-bold ring-1 ring-amber-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 stroke-[2]" />
              <span>Resubmit</span>
            </button>

            <button
              type="button"
              onClick={() => setAction('REJECT')}
              className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[38px] cursor-pointer ${
                action === 'REJECT'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 font-bold ring-1 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 stroke-[2]" />
              <span>Reject</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-xs">
            Compliance Officer Remarks / Reason{' '}
            {action !== 'APPROVE' && <span className="text-rose-500">*</span>}
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder={
              action === 'APPROVE'
                ? 'e.g. Document clearly legible, verified against official records.'
                : 'Please state exact reason (e.g. Blurry scan, expired ID, name mismatch)...'
            }
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            required={action !== 'APPROVE'}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant={theme.btnVariant}
            size="sm"
            disabled={verifyMutation.isPending || (action !== 'APPROVE' && !remarks.trim())}
            isLoading={verifyMutation.isPending}
            loadingText="Saving..."
          >
            {theme.btnText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
