import { z } from 'zod';

export const assessmentFormSchema = z.object({
  customerId: z.string().min(1, 'Please select a customer'),
  loanType: z.enum(['GOLD', 'BIKE', 'BUSINESS', 'PERSONAL', 'GUARANTOR', 'NOMINEE']),
  requestedAmount: z.number().min(5000, 'Minimum loan amount is ₹5,000'),
  requestedTenureMonths: z.number().min(1, 'Minimum tenure is 1 month').max(120, 'Maximum tenure is 120 months'),
  monthlyIncome: z.number().min(5000, 'Monthly income must be at least ₹5,000'),
  existingObligations: z.array(
    z.object({
      institutionName: z.string().min(1, 'Institution is required'),
      loanType: z.string().min(1, 'Loan type is required'),
      originalAmount: z.number().min(0),
      outstandingBalance: z.number().min(0),
      monthlyEmi: z.number().min(0),
      status: z.enum(['ACTIVE', 'SETTLED', 'DEFAULTED']),
    })
  ).default([]),
  collateralDetails: z.object({
    type: z.string().optional(),
    description: z.string().optional(),
    estimatedValue: z.number().optional(),
  }).optional(),
  assessorRemarks: z.string().min(5, 'Please provide detailed assessor notes and recommendations'),
});

export type AssessmentFormValues = z.infer<typeof assessmentFormSchema>;
