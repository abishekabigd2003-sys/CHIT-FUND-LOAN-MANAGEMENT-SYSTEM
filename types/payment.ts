import { PaymentStatus } from './loan';

export type PaymentCategory = 'LOAN_EMI' | 'CHIT_INSTALLMENT' | 'PENALTY' | 'FEES';
export type PaymentMethod = 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE';

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  category: PaymentCategory;
  referenceId: string; // Loan ID or Chit ID
  referenceCode: string; // Loan Code or Chit Scheme Code
  installmentNumber: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  penaltyPaid?: number;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  transactionReference?: string;
  status: PaymentStatus;
  notes?: string;
  collectedBy?: string;
}

export interface RecordPaymentPayload {
  paymentId?: string;
  referenceId: string;
  customerId: string;
  category: PaymentCategory;
  installmentNumber: number;
  amountPaid: number;
  penaltyAmount?: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  notes?: string;
}
