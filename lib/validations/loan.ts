import { z } from 'zod';

export const baseLoanSchema = z.object({
  customerId: z.string().min(1, 'Please select a customer'),
  loanType: z.enum(['GOLD', 'BIKE', 'GUARANTOR', 'NOMINEE', 'BUSINESS', 'PERSONAL']),
  principalAmount: z.coerce.number().min(5000, 'Minimum loan amount is ₹5,000'),
  interestRateAnnual: z.coerce.number().min(1, 'Interest rate required').max(36, 'Interest rate cannot exceed 36%'),
  tenureMonths: z.coerce.number().min(3, 'Minimum tenure is 3 months').max(120, 'Maximum tenure is 120 months'),
  processingFee: z.coerce.number().min(0),
  purpose: z.string().optional(),
});

export const goldCollateralSchema = z.object({
  grossWeightGrams: z.coerce.number().min(0.5, 'Gross weight is required'),
  netWeightGrams: z.coerce.number().min(0.5, 'Net weight is required'),
  karat: z.coerce.number().min(18).max(24),
  marketRatePerGram: z.coerce.number().min(1000, 'Current market rate is required'),
  appraisedValue: z.coerce.number().min(1000, 'Appraised value required'),
  ornamentDescription: z.string().min(5, 'Ornament description is required'),
});

export const bikeCollateralSchema = z.object({
  vehicleMake: z.string().min(2, 'Make is required (e.g. Honda, Hero, Royal Enfield)'),
  vehicleModel: z.string().min(2, 'Model name is required'),
  registrationNumber: z.string().min(6, 'Valid registration number required'),
  engineNumber: z.string().min(5, 'Engine number is required'),
  chassisNumber: z.string().min(5, 'Chassis number is required'),
  vehicleValuation: z.coerce.number().min(10000, 'Vehicle valuation required'),
  hypothecated: z.boolean().default(true),
});

export const guarantorCollateralSchema = z.object({
  guarantorName: z.string().min(2, 'Guarantor name is required'),
  guarantorPhone: z.string().min(10, 'Guarantor phone is required'),
  guarantorRelationship: z.string().min(2, 'Relationship is required'),
  guarantorAadhar: z.string().min(12, '12-digit Aadhaar number required'),
  guarantorAddress: z.string().min(5, 'Guarantor address is required'),
  guarantorMonthlyIncome: z.coerce.number().min(10000, 'Guarantor monthly income is required'),
});

export const nomineeCollateralSchema = z.object({
  nomineeName: z.string().min(2, 'Nominee name is required'),
  nomineeRelationship: z.string().min(2, 'Relationship is required'),
  nomineePhone: z.string().min(10, 'Nominee phone is required'),
  nomineeAadhar: z.string().min(12, '12-digit Aadhaar number required'),
  nomineeAddress: z.string().min(5, 'Nominee address is required'),
});

export type BaseLoanFormData = z.infer<typeof baseLoanSchema>;
export type GoldCollateralFormData = z.infer<typeof goldCollateralSchema>;
export type BikeCollateralFormData = z.infer<typeof bikeCollateralSchema>;
export type GuarantorCollateralFormData = z.infer<typeof guarantorCollateralSchema>;
export type NomineeCollateralFormData = z.infer<typeof nomineeCollateralSchema>;
