import { LoanType } from './loan';

export type AssessmentStatus =
  | 'DRAFT'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'REQUIRES_MORE_INFO';

export interface ExistingObligation {
  id: string;
  institutionName: string;
  loanType: string;
  originalAmount: number;
  outstandingBalance: number;
  monthlyEmi: number;
  status: 'ACTIVE' | 'SETTLED' | 'DEFAULTED';
}

export interface CreditScoreDetails {
  score: number;
  provider: 'CIBIL' | 'EXPERIAN' | 'CRIF' | 'INTERNAL';
  riskBand: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  scoreDate: string;
  summary: string;
}

export interface EligibilityMetrics {
  monthlyIncome: number;
  totalMonthlyObligations: number;
  foir: number; // Fixed Obligation to Income Ratio (percentage)
  eligibleLoanAmount: number;
  maxTenureMonths: number;
  recommendedInterestRate: number;
  riskScore: number; // 0-100
  isEligible: boolean;
}

export interface LoanAssessment {
  id: string;
  assessmentNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  loanType: LoanType;
  requestedAmount: number;
  requestedTenureMonths: number;
  status: AssessmentStatus;
  creditDetails: CreditScoreDetails;
  eligibility: EligibilityMetrics;
  existingObligations: ExistingObligation[];
  collateralDetails?: {
    type: string;
    description: string;
    estimatedValue: number;
    ltvPercentage: number;
  };
  supportingDocuments: Array<{
    id: string;
    name: string;
    type: string;
    verified: boolean;
  }>;
  assessorId: string;
  assessorName: string;
  assessorRemarks: string;
  ownerApprovalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssessmentInput {
  customerId: string;
  loanType: LoanType;
  requestedAmount: number;
  requestedTenureMonths: number;
  monthlyIncome: number;
  existingObligations: Omit<ExistingObligation, 'id'>[];
  collateralDetails?: {
    type?: string;
    description?: string;
    estimatedValue?: number;
  };
  assessorRemarks?: string;
}
