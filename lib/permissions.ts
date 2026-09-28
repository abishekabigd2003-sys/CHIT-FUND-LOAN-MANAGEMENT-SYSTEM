// Re-export everything from modular structure
export * from './permissions/index';

import { UserRole } from '@/types/auth';
import { AppModule, AppAction } from './permissions/permissions';
import { DEFAULT_ROLE_PERMISSIONS } from './permissions/permission-constants';
import { hasPermission as checkPerm, canAccessModule as checkMod } from './permissions/permission-utils';

// Legacy compatibility map (fallback if needed)
export const ROLE_PERMISSIONS: Record<string, Record<string, string[]>> = {
  ADMIN: {
    dashboard: ['view', 'create', 'edit', 'delete', 'approve', 'reject', 'assign', 'export'],
    customers: ['view', 'create', 'edit', 'delete', 'export'],
    kyc: ['view', 'create', 'edit', 'upload', 'approve', 'reject', 'export'],
    assessments: ['view', 'create', 'edit', 'delete', 'approve', 'reject', 'export'],
    loans: ['view', 'create', 'edit', 'delete', 'approve', 'reject', 'export'],
    collections: ['view', 'create', 'edit', 'delete', 'assign', 'export'],
    approvals: ['view', 'approve', 'reject'],
    notifications: ['view', 'edit', 'delete'],
    reports: ['view', 'export'],
    audit: ['view', 'export'],
    settings: ['view', 'create', 'edit', 'delete'],
    chits: ['view', 'create', 'edit', 'delete', 'export'],
  },
  MANAGEMENT: {
    dashboard: ['view', 'export'],
    customers: ['view', 'export'],
    kyc: ['view', 'export'],
    assessments: ['view', 'export'],
    loans: ['view', 'export'],
    collections: ['view', 'export'],
    approvals: ['view'],
    notifications: ['view'],
    reports: ['view', 'export'],
    audit: ['view', 'export'],
    settings: ['view'],
    chits: ['view', 'export'],
  },
  STAFF: {
    dashboard: ['view'],
    customers: ['view', 'create', 'edit'],
    kyc: ['view', 'create', 'edit', 'upload'],
    assessments: ['view', 'create'],
    loans: ['view', 'create'],
    collections: ['view', 'create', 'edit'],
    approvals: [],
    notifications: ['view'],
    reports: [],
    audit: [],
    settings: [],
    chits: ['view'],
  },
};

// Backward compatible helper signatures
export function canAccessModule(role: UserRole | string | undefined, module: AppModule): boolean {
  if (!role) return false;
  if (role.toUpperCase() === 'ADMIN') return true;

  // Check stored dynamic permissions if in browser
  if (typeof window !== 'undefined') {
    try {
      const storedRoles = localStorage.getItem('dyn_rbac_roles_v2');
      if (storedRoles) {
        const parsed = JSON.parse(storedRoles);
        const found = parsed.find((r: any) => r.code === role);
        if (found) {
          return checkMod(role, found.permissions, module);
        }
      }
    } catch {}
  }

  // Fallback to default
  const defaultPerms = DEFAULT_ROLE_PERMISSIONS[role] || [];
  return checkMod(role, defaultPerms, module);
}

export function canPerformAction(
  role: UserRole | string | undefined,
  module: AppModule,
  action: AppAction
): boolean {
  if (!role) return false;
  if (role.toUpperCase() === 'ADMIN') return true;

  const targetPerm = `${module}.${action}`;
  if (typeof window !== 'undefined') {
    try {
      const storedRoles = localStorage.getItem('dyn_rbac_roles_v2');
      if (storedRoles) {
        const parsed = JSON.parse(storedRoles);
        const found = parsed.find((r: any) => r.code === role);
        if (found) {
          return checkPerm(role, found.permissions, targetPerm);
        }
      }
    } catch {}
  }

  const defaultPerms = DEFAULT_ROLE_PERMISSIONS[role] || [];
  return checkPerm(role, defaultPerms, targetPerm);
}

export function getRoleAllowedModules(role: UserRole | string): AppModule[] {
  if (!role) return [];
  if (role.toUpperCase() === 'ADMIN') {
    return [
      'dashboard', 'customers', 'kyc', 'documents', 'assessments',
      'loans', 'collections', 'approvals', 'notifications',
      'reports', 'audit', 'settings', 'chits', 'users', 'roles'
    ];
  }
  const defaultPerms = DEFAULT_ROLE_PERMISSIONS[role] || [];
  const mods = new Set<AppModule>();
  for (const perm of defaultPerms) {
    const mod = perm.split('.')[0] as AppModule;
    if (mod) mods.add(mod);
  }
  return Array.from(mods);
}
