export type NotificationType = 
  | 'UPCOMING_PAYMENT' 
  | 'DUE_DATE' 
  | 'OVERDUE_ALERT' 
  | 'KYC_PENDING' 
  | 'CHIT_AUCTION' 
  | 'LOAN_APPROVAL' 
  | 'SYSTEM';

export type NotificationPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  link?: string;
  relatedEntityId?: string;
  createdAt: string;
}
