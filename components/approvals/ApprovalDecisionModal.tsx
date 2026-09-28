'use client';

import React, { useState } from 'react';
import { ApprovalRequest } from '@/types/approval';
import { useSubmitApprovalDecision } from '@/hooks/useApprovals';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ApprovalDecisionModalProps {
  approval: ApprovalRequest | null;
  action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES';
  isOpen: boolean;
  onClose: () => void;
}

export function ApprovalDecisionModal({
  approval,
  action,
  isOpen,
  onClose,
}: ApprovalDecisionModalProps) {
  const [remarks, setRemarks] = useState('');
  const [approvedAmount, setApprovedAmount] = useState<number>(approval?.requestedAmount || 0);
  const [interestRate, setInterestRate] = useState<number>(
    approval?.assessmentSummary.recommendedRate || 14.0
  );
  const [conditions, setConditions] = useState<string>('');

  const submitDecisionMutation = useSubmitApprovalDecision();

  React.useEffect(() => {
    if (approval) {
      setApprovedAmount(approval.requestedAmount);
      setInterestRate(approval.assessmentSummary.recommendedRate || 14.0);
      setRemarks('');
      setConditions('');
    }
  }, [approval]);

  if (!isOpen || !approval) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) return;

    try {
      await submitDecisionMutation.mutateAsync({
        approvalId: approval.id,
        action,
        decisionRemarks: remarks,
        approvedAmount: action === 'APPROVE' ? approvedAmount : undefined,
        interestRateApproved: action === 'APPROVE' ? interestRate : undefined,
        specialConditions: conditions ? conditions.split('\n').filter(Boolean) : undefined,
      });
      onClose();
    } catch (err) {
      console.error('Decision submission failed:', err);
    }
  };

  const getActionTheme = () => {
    switch (action) {
      case 'APPROVE':
        return {
          title: 'Owner Sanction & Approval',
          color: 'text-emerald-600 dark:text-emerald-400',
          btnVariant: 'success' as const,
          btnText: 'Confirm & Sanction Loan',
          Icon: CheckCircle2,
        };
      case 'REJECT':
        return {
          title: 'Reject Loan Application',
          color: 'text-rose-600 dark:text-rose-400',
          btnVariant: 'destructive' as const,
          btnText: 'Confirm Rejection',
          Icon: XCircle,
        };
      case 'REQUEST_CHANGES':
      default:
        return {
          title: 'Request Changes / Additional Information',
          color: 'text-amber-600 dark:text-amber-400',
          btnVariant: 'warning' as const,
          btnText: 'Send Back to Credit Officer',
          Icon: AlertCircle,
        };
    }
  };

  const theme = getActionTheme();
  const Icon = theme.Icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={theme.title}
      description={`${approval.customerName} • ${approval.loanType} Loan Application`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-2">
            <Icon className={`w-4.5 h-4.5 ${theme.color} shrink-0`} />
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              {approval.customerName}
            </p>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Requested: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(approval.requestedAmount)}</span> over{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{approval.tenureMonths} Months</span>
          </p>
        </div>

        {action === 'APPROVE' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-xs">
                Sanctioned Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 font-bold text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-xs">
                Approved Interest (% p.a.) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 font-bold text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-xs">
                Special Sanction Conditions (One per line)
              </label>
              <textarea
                rows={2}
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="e.g. Mandatory NACH auto-debit registration, Collateral original deed deposited in vault."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5 text-xs">
            Decision Remarks & Executive Rationale <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="State formal executive rationale for this decision..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            required
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
            disabled={!remarks.trim()}
            isLoading={submitDecisionMutation.isPending}
            loadingText="Processing..."
          >
            {theme.btnText}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
