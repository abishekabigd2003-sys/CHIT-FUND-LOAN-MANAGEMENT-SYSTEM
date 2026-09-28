import apiClient from '@/lib/axios';
import { Loan, CreateLoanInput, LoanType, LoanStatus, EMIScheduleItem } from '@/types/loan';
import { mockLoans } from './mock-data/loans';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

let inMemoryLoans = [...mockLoans];

export function generateEMISchedulePreview(
  principal: number,
  rateAnnual: number,
  tenureMonths: number,
  startDateStr: string = new Date().toISOString()
): { emiAmount: number; totalInterest: number; totalPayable: number; schedule: Partial<EMIScheduleItem>[] } {
  const monthlyRate = rateAnnual / (12 * 100);
  const emi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  let currentPrincipal = principal;
  const schedule: Partial<EMIScheduleItem>[] = [];
  let totalInterest = 0;
  const baseDate = new Date(startDateStr);

  for (let i = 1; i <= tenureMonths; i++) {
    const interest = Math.round(currentPrincipal * monthlyRate);
    const principalPaid = i === tenureMonths ? currentPrincipal : emi - interest;
    currentPrincipal = Math.max(0, currentPrincipal - principalPaid);
    totalInterest += interest;

    const dueDate = new Date(baseDate);
    dueDate.setMonth(baseDate.getMonth() + i);

    schedule.push({
      installmentNumber: i,
      dueDate: dueDate.toISOString().split('T')[0],
      emiAmount: emi,
      principalComponent: principalPaid,
      interestComponent: interest,
      outstandingPrincipal: currentPrincipal,
      status: 'PENDING',
      paidAmount: 0,
      penaltyAmount: 0,
    });
  }

  return {
    emiAmount: emi,
    totalInterest,
    totalPayable: principal + totalInterest,
    schedule,
  };
}

export const loanService = {
  async getLoans(params?: { type?: LoanType | 'ALL'; status?: LoanStatus | 'ALL'; search?: string; customerId?: string }): Promise<Loan[]> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: Loan[] }>('/loans', { params });
      return response.data.data;
    }
    let result = [...inMemoryLoans];

    if (params?.customerId) {
      result = result.filter((l) => l.customerId === params.customerId);
    }
    if (params?.type && params.type !== 'ALL') {
      result = result.filter((l) => l.loanType === params.type);
    }
    if (params?.status && params.status !== 'ALL') {
      result = result.filter((l) => l.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.loanCode.toLowerCase().includes(q) ||
          l.customerName.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async getLoanById(id: string): Promise<Loan> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: Loan }>(`/loans/${id}`);
      return response.data.data;
    }
    const loan = inMemoryLoans.find((l) => l.id === id || l.loanCode === id);
    if (!loan) throw new Error(`Loan with ID ${id} not found.`);
    return loan;
  },

  async createLoan(input: CreateLoanInput, customerName: string, customerPhone?: string): Promise<Loan> {
    if (!USE_MOCK) {
      const response = await apiClient.post<{ success: boolean; data: Loan }>('/loans', input);
      return response.data.data;
    }

    const prefixMap: Record<LoanType, string> = {
      GOLD: 'GL',
      BIKE: 'BL',
      GUARANTOR: 'GLR',
      NOMINEE: 'NL',
      BUSINESS: 'BLN',
      PERSONAL: 'PL',
    };
    const prefix = prefixMap[input.loanType];
    const year = new Date().getFullYear();
    const seq = String(inMemoryLoans.length + 1).padStart(4, '0');
    const loanCode = `${prefix}-${year}-${seq}`;

    const calculation = generateEMISchedulePreview(
      input.principalAmount,
      input.interestRateAnnual,
      input.tenureMonths
    );

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      loanCode,
      customerId: input.customerId,
      customerName,
      customerPhone,
      loanType: input.loanType,
      principalAmount: input.principalAmount,
      interestRateAnnual: input.interestRateAnnual,
      tenureMonths: input.tenureMonths,
      emiAmount: calculation.emiAmount,
      totalRepayable: calculation.totalPayable,
      totalPaid: 0,
      totalOutstanding: calculation.totalPayable,
      processingFee: input.processingFee || Math.round(input.principalAmount * 0.01),
      status: 'PENDING_APPROVAL',
      createdAt: new Date().toISOString(),
      collateralDetails: {
        gold: input.collateralData.gold as any,
        bike: input.collateralData.bike as any,
        guarantor: input.collateralData.guarantor as any,
        nominee: input.collateralData.nominee as any,
      },
      emiSchedule: calculation.schedule.map((s, idx) => ({
        ...s,
        id: `emi-${Date.now()}-${idx + 1}`,
        loanId: `loan-${Date.now()}`,
      })) as EMIScheduleItem[],
    };

    inMemoryLoans.unshift(newLoan);
    return newLoan;
  },

  async updateLoanStatus(id: string, status: LoanStatus): Promise<Loan> {
    if (!USE_MOCK) {
      const response = await apiClient.patch<{ success: boolean; data: Loan }>(`/loans/${id}/status`, { status });
      return response.data.data;
    }
    const idx = inMemoryLoans.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error('Loan not found');

    const updated: Loan = {
      ...inMemoryLoans[idx],
      status,
      disbursedAt: status === 'ACTIVE' || status === 'DISBURSED' ? new Date().toISOString() : inMemoryLoans[idx].disbursedAt,
    };
    inMemoryLoans[idx] = updated;
    return updated;
  },

  async fetchEmiCalculationPreview(principal: number, interestRate: number, tenure: number) {
    if (!USE_MOCK) {
      const res = await apiClient.post('/loans/calculate-emi', {
        principal,
        interestRate,
        tenureMonths: tenure,
      });
      return res.data;
    }
    return generateEMISchedulePreview(principal, interestRate, tenure);
  }
};
