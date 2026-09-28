import { z } from 'zod';

export const collectionRemarkSchema = z.object({
  taskId: z.string().min(1, 'Task ID is required'),
  interactionType: z.enum(['PHONE_CALL', 'FIELD_VISIT', 'OFFICE_VISIT', 'WHATSAPP_MESSAGE', 'LEGAL_NOTICE']),
  outcome: z.string().min(2, 'Please state the customer interaction outcome'),
  amountCollected: z.number().min(0, 'Amount must be 0 or greater').optional(),
  nextFollowUpDate: z.string().optional(),
  notes: z.string().min(5, 'Notes must be at least 5 characters'),
  location: z.string().optional(),
});

export type CollectionRemarkFormValues = z.infer<typeof collectionRemarkSchema>;

export const createCollectionTaskSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  loanId: z.string().min(1, 'Loan reference is required'),
  dueAmount: z.number().min(1, 'Due amount must be greater than zero'),
  dueDate: z.string().min(1, 'Due date is required'),
  assignedStaffId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  notes: z.string().optional(),
});

export type CreateCollectionTaskFormValues = z.infer<typeof createCollectionTaskSchema>;
