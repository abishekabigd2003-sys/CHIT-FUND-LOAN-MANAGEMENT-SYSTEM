import { z } from 'zod';

export const chitSchemeSchema = z.object({
  schemeName: z.string().min(3, 'Scheme name must be at least 3 characters'),
  totalValue: z.coerce.number().min(25000, 'Minimum chit value is ₹25,000'),
  durationMonths: z.coerce.number().min(5, 'Minimum duration is 5 months').max(60, 'Maximum duration is 60 months'),
  totalMembers: z.coerce.number().min(5, 'Minimum 5 members').max(60, 'Maximum 60 members'),
  foremanCommissionPct: z.coerce.number().min(1).max(10, 'Foreman commission is typically between 1% and 10%'),
  startDate: z.string().min(1, 'Start date is required'),
  description: z.string().optional(),
}).refine(data => data.totalValue > 0 && data.durationMonths > 0, {
  message: 'Invalid values',
});

export type ChitSchemeFormData = z.infer<typeof chitSchemeSchema>;
