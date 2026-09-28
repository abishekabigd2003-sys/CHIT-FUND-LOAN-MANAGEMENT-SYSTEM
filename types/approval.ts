import { LoanAssessment } from './assessment';
import { KycProfile } from './kyc';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';

export type ApprovalType = 'LOAN_ASSESSMENT' | 'LOAN_DISBURSEMENT' | 'SETTLEMENT_WAIVER' | 'KYC_OVERRIDE';

export interface ApprovalRequest {
  id: string;
  approvalNumber: string;
  type: ApprovalType;
  entityId: string;
  status: ApprovalStatus;
  customerId: string;
  customerName: string;
  customerPhone: string;
  requestedAmount: number;
  loanType: string;
  tenureMonths: number;
  assessmentSummary: {
    assessmentId: string;
    creditScore: number;
    foir: number;
    riskBand: string;
    monthlyIncome: number;
    recommendedRate: number;
    existingObligationsTotal: number;
  };
  kycSummary: {
    status: string;
    verifiedDocsCount: number;
    totalDocsCount: number;
    riskCategory: string;
  };
  staffRemarks: string;
  submittedBy: {
    id: string;
    name: string;
    role: string;
    submittedAt: string;
  };
  decision?: {
    decidedBy: string;
    decidedByName: string;
    decisionDate: string;
    decisionRemarks: string;
    approvedAmount?: number;
    interestRateApproved?: number;
    specialConditions?: string[];
  };
  auditHistory: Array<{
    id: string;
    action: string;
    performedBy: string;
    timestamp: string;
    notes?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalDecisionInput {
  approvalId: string;
  action: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES';
  decisionRemarks: string;
  approvedAmount?: number;
  interestRateApproved?: number;
  specialConditions?: string[];
}
