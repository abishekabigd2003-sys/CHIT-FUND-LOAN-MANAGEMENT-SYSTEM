export type LoanType = 'GOLD' | 'BIKE' | 'GUARANTOR' | 'NOMINEE' | 'BUSINESS' | 'PERSONAL';

export type LoanStatus = 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'DISBURSED' 
  | 'ACTIVE' 
  | 'CLOSED' 
  | 'DEFAULTED';

export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIALLY_PAID';

export interface EMIScheduleItem {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  emiAmount: number;
  principalComponent: number;
  interestComponent: number;
  outstandingPrincipal: number;
  paidAmount: number;
  paidDate?: string;
  penaltyAmount: number;
  status: PaymentStatus;
  paymentMode?: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE';
  transactionRef?: string;
}

export interface GoldCollateral {
  grossWeightGrams: number;
  netWeightGrams: number;
  karat: number;
  marketRatePerGram: number;
  appraisedValue: number;
  ornamentDescription: string;
}

export interface BikeCollateral {
  vehicleMake: string;
  vehicleModel: string;
  registrationNumber: string;
  engineNumber: string;
  chassisNumber: string;
  vehicleValuation: number;
  hypothecated: boolean;
}

export interface GuarantorDetails {
  guarantorName: string;
  guarantorPhone: string;
  guarantorRelationship: string;
  guarantorAadhar: string;
  guarantorAddress: string;
  guarantorMonthlyIncome: number;
}

export interface NomineeDetails {
  nomineeName: string;
  nomineeRelationship: string;
  nomineePhone: string;
  nomineeAadhar: string;
  nomineeAddress: string;
}

export interface Loan {
  id: string;
  loanCode: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerCode?: string;
  loanType: LoanType;
  principalAmount: number;
  interestRateAnnual: number;
  tenureMonths: number;
  emiAmount: number;
  totalRepayable: number;
  totalPaid: number;
  totalOutstanding: number;
  processingFee: number;
  status: LoanStatus;
  disbursedAt?: string;
  nextDueDate?: string;
  createdAt: string;
  collateralDetails?: {
    gold?: GoldCollateral;
    bike?: BikeCollateral;
    guarantor?: GuarantorDetails;
    nominee?: NomineeDetails;
  };
  emiSchedule?: EMIScheduleItem[];
}

export interface CreateLoanInput {
  customerId: string;
  loanType: LoanType;
  principalAmount: number;
  interestRateAnnual: number;
  tenureMonths: number;
  processingFee?: number;
  purpose?: string;
  collateralData: {
    gold?: Partial<GoldCollateral>;
    bike?: Partial<BikeCollateral>;
    guarantor?: Partial<GuarantorDetails>;
    nominee?: Partial<NomineeDetails>;
  };
}
