import { LoanAssessment, CreateAssessmentInput } from '@/types/assessment';
import { mockAssessments } from './mock-data/assessments';
import { mockCustomers } from './mock-data/customers';

let assessmentsStore: LoanAssessment[] = [...mockAssessments];

export const assessmentService = {
  async getAllAssessments(status?: string): Promise<LoanAssessment[]> {
    if (!status || status === 'ALL') return assessmentsStore;
    return assessmentsStore.filter((a) => a.status === status);
  },

  async getAssessmentById(id: string): Promise<LoanAssessment | null> {
    return assessmentsStore.find((a) => a.id === id) || null;
  },

  async createAssessment(input: CreateAssessmentInput): Promise<LoanAssessment> {
    const customer = mockCustomers.find((c) => c.id === input.customerId);
    const existingMonthlyObligations = input.existingObligations.reduce(
      (sum, ob) => sum + (Number(ob.monthlyEmi) || 0),
      0
    );

    // Business financial logic preview from backend
    const foir = Math.round(
      ((existingMonthlyObligations + input.requestedAmount * 0.03) / (input.monthlyIncome || 1)) * 100
    );
    const isEligible = foir <= 55 && (customer?.stats?.creditScore || 700) >= 600;

    const newAssessment: LoanAssessment = {
      id: `asm-${Date.now().toString().slice(-4)}`,
      assessmentNumber: `ASM-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: input.customerId,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Prospective Borrower',
      customerPhone: customer?.phone || '+91 98401 00000',
      loanType: input.loanType,
      requestedAmount: input.requestedAmount,
      requestedTenureMonths: input.requestedTenureMonths,
      status: 'UNDER_REVIEW',
      creditDetails: {
        score: customer?.stats?.creditScore || 720,
        provider: 'CIBIL',
        riskBand: (customer?.stats?.creditScore || 720) > 750 ? 'EXCELLENT' : 'GOOD',
        scoreDate: new Date().toISOString().split('T')[0],
        summary: 'Automated bureau pull and historical chit repayment verification.',
      },
      eligibility: {
        monthlyIncome: input.monthlyIncome,
        totalMonthlyObligations: existingMonthlyObligations,
        foir,
        eligibleLoanAmount: Math.round(input.monthlyIncome * 0.5 * input.requestedTenureMonths * 0.8),
        maxTenureMonths: Math.max(input.requestedTenureMonths, 24),
        recommendedInterestRate: isEligible ? 13.5 : 18.0,
        riskScore: isEligible ? 82 : 45,
        isEligible,
      },
      existingObligations: input.existingObligations.map((o, idx) => ({
        id: `ob-${Date.now()}-${idx}`,
        ...o,
      })),
      collateralDetails: input.collateralDetails
        ? {
            type: input.collateralDetails.type || 'Pledged Asset',
            description: input.collateralDetails.description || '',
            estimatedValue: input.collateralDetails.estimatedValue || 0,
            ltvPercentage: input.collateralDetails.estimatedValue
              ? Math.round((input.requestedAmount / input.collateralDetails.estimatedValue) * 100)
              : 0,
          }
        : undefined,
      supportingDocuments: [
        { id: 'doc-auto-1', name: 'Identity & Address Proof', type: 'KYC', verified: true },
        { id: 'doc-auto-2', name: 'Income Statement', type: 'FINANCIAL', verified: true },
      ],
      assessorId: 'usr-staff-1',
      assessorName: 'Karthik Raman (Credit Officer)',
      assessorRemarks: input.assessorRemarks || 'Automated score analysis completed.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assessmentsStore = [newAssessment, ...assessmentsStore];
    return newAssessment;
  },

  async updateAssessmentStatus(
    id: string,
    status: LoanAssessment['status'],
    remarks?: string
  ): Promise<LoanAssessment> {
    const idx = assessmentsStore.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Assessment not found');

    assessmentsStore[idx] = {
      ...assessmentsStore[idx],
      status,
      assessorRemarks: remarks || assessmentsStore[idx].assessorRemarks,
      updatedAt: new Date().toISOString(),
    };
    return assessmentsStore[idx];
  },
};
