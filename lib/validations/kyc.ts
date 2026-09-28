import { z } from 'zod';

export const kycVerificationSchema = z.object({
  documentId: z.string().min(1, 'Document ID is required'),
  action: z.enum(['APPROVE', 'REJECT', 'REQUEST_RESUBMISSION']),
  remarks: z.string().min(3, 'Please specify verification notes or rejection reasons'),
});

export type KycVerificationFormValues = z.infer<typeof kycVerificationSchema>;
