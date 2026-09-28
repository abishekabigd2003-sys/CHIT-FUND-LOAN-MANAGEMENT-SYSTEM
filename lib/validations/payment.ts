import { z } from 'zod';

export const recordPaymentSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  category: z.enum(['LOAN_EMI', 'CHIT_INSTALLMENT', 'PENALTY', 'FEES']),
  referenceId: z.string().min(1, 'Account reference is required'),
  installmentNumber: z.coerce.number().min(1, 'Installment number is required'),
  amountPaid: z.coerce.number().min(1, 'Amount must be greater than 0'),
  penaltyAmount: z.coerce.number().min(0).default(0),
  paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE']),
  transactionReference: z.string().optional(),
  notes: z.string().optional(),
});

export type RecordPaymentFormData = z.infer<typeof recordPaymentSchema>;
