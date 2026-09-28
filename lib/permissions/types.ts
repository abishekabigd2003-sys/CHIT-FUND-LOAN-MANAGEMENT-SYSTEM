export type AppModule =
  | 'dashboard'
  | 'customers'
  | 'kyc'
  | 'documents'
  | 'assessments'
  | 'loans'
  | 'approvals'
  | 'collections'
  | 'chits'
  | 'notifications'
  | 'reports'
  | 'audit'
  | 'users'
  | 'roles'
  | 'settings';

export type AppAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'upload'
  | 'assign'
  | 'update'
  | 'close'
  | 'export';

export type PermissionKey = string; // e.g. "customers.view", "loans.approve"

export interface PermissionDefinition {
  id: string; // e.g. "loans.approve"
  module: AppModule;
  action: AppAction;
  name: string;
  description: string;
}

export interface RoleDefinition {
  id: string;
  code: string; // e.g. "ADMIN", "MANAGEMENT", "STAFF", "LOAN_OFFICER"
  name: string;
  description: string;
  isSystem: boolean; // System roles cannot be deleted; ADMIN cannot lose permissions
  permissions: string[];
  usersCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  code: string;
  name: string;
  description: string;
  permissions?: string[];
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface RoleAssignmentAudit {
  adminUserId: string;
  adminName: string;
  targetUserId: string;
  targetUserName: string;
  previousRole: string;
  newRole: string;
  timestamp: string;
}

export interface PermissionAuditRecord {
  adminUserId: string;
  adminName: string;
  roleCode: string;
  action: 'CREATE_ROLE' | 'UPDATE_PERMISSIONS' | 'DELETE_ROLE' | 'ASSIGN_ROLE';
  addedPermissions: string[];
  removedPermissions: string[];
  previousCount: number;
  newCount: number;
  timestamp: string;
}
