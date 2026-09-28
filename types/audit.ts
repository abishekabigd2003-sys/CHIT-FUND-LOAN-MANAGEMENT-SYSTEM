import { UserRole } from './auth';

export type AuditModule =
  | 'AUTH'
  | 'CUSTOMERS'
  | 'KYC'
  | 'ASSESSMENTS'
  | 'LOANS'
  | 'COLLECTIONS'
  | 'APPROVALS'
  | 'SETTINGS'
  | 'REPORTS';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'STATUS_CHANGE'
  | 'LOGIN'
  | 'ROLE_SWITCH'
  | 'EXPORT';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  module: AuditModule;
  action: AuditAction;
  recordId: string;
  description: string;
  previousValue?: Record<string, any> | string | null;
  newValue?: Record<string, any> | string | null;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AuditFilterParams {
  module?: AuditModule;
  action?: AuditAction;
  userId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}
