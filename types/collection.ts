export type CollectionTaskStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'FOLLOW_UP'
  | 'COLLECTED'
  | 'PARTIALLY_COLLECTED'
  | 'OVERDUE'
  | 'ESCALATED'
  | 'CLOSED';

export type CollectionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type InteractionType =
  | 'PHONE_CALL'
  | 'FIELD_VISIT'
  | 'OFFICE_VISIT'
  | 'WHATSAPP_MESSAGE'
  | 'LEGAL_NOTICE';

export interface CollectionRemark {
  id: string;
  taskId: string;
  staffId: string;
  staffName: string;
  interactionType: InteractionType;
  outcome: string;
  amountCollected?: number;
  nextFollowUpDate?: string;
  createdAt: string;
  notes: string;
  location?: string;
}

export interface CollectionTask {
  id: string;
  taskNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  loanId: string;
  loanNumber: string;
  loanType: string;
  dueAmount: number;
  dueDate: string;
  daysOverdue: number;
  totalOutstanding: number;
  assignedStaffId?: string;
  assignedStaffName?: string;
  priority: CollectionPriority;
  status: CollectionTaskStatus;
  lastFollowUpDate?: string;
  nextFollowUpDate?: string;
  collectedAmount: number;
  recoveryStage?: 'EARLY' | 'MID' | 'LEGAL' | 'SETTLEMENT';
  remarks: CollectionRemark[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionTaskInput {
  customerId: string;
  loanId: string;
  dueAmount: number;
  dueDate: string;
  assignedStaffId?: string;
  priority: CollectionPriority;
  notes?: string;
}

export interface AddCollectionRemarkInput {
  taskId: string;
  interactionType: InteractionType;
  outcome: string;
  amountCollected?: number;
  nextFollowUpDate?: string;
  notes: string;
  location?: string;
}
