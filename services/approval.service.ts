import { ApprovalRequest, ApprovalDecisionInput } from '@/types/approval';
import { mockApprovalRequests } from './mock-data/approvals';

let approvalsStore: ApprovalRequest[] = [...mockApprovalRequests];

export const approvalService = {
  async getAllApprovals(status?: string): Promise<ApprovalRequest[]> {
    if (!status || status === 'ALL') return approvalsStore;
    return approvalsStore.filter((a) => a.status === status);
  },

  async getApprovalById(id: string): Promise<ApprovalRequest | null> {
    return approvalsStore.find((a) => a.id === id) || null;
  },

  async submitDecision(input: ApprovalDecisionInput): Promise<ApprovalRequest> {
    const idx = approvalsStore.findIndex((a) => a.id === input.approvalId);
    if (idx === -1) throw new Error('Approval request not found');

    const mappedStatus =
      input.action === 'APPROVE'
        ? 'APPROVED'
        : input.action === 'REJECT'
        ? 'REJECTED'
        : 'CHANGES_REQUESTED';

    const current = approvalsStore[idx];
    approvalsStore[idx] = {
      ...current,
      status: mappedStatus,
      decision: {
        decidedBy: 'usr-admin-1',
        decidedByName: 'S. Narayanan (Managing Director / Owner)',
        decisionDate: new Date().toISOString(),
        decisionRemarks: input.decisionRemarks,
        approvedAmount: input.approvedAmount,
        interestRateApproved: input.interestRateApproved,
        specialConditions: input.specialConditions,
      },
      auditHistory: [
        {
          id: `aud-${Date.now()}`,
          action: `DECISION_${input.action}`,
          performedBy: 'S. Narayanan (Owner)',
          timestamp: new Date().toISOString(),
          notes: input.decisionRemarks,
        },
        ...current.auditHistory,
      ],
      updatedAt: new Date().toISOString(),
    };

    return approvalsStore[idx];
  },
};
