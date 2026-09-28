import { AppModule, AppAction, PermissionDefinition } from './types';
import { ALL_PERMISSIONS } from './permission-constants';

/**
 * Checks whether a user with given role and permission list has a specific permission.
 * ADMIN role always has unrestricted bypass privileges by system architecture rule.
 */
export function hasPermission(
  userRole: string | undefined,
  userPermissions: string[] | undefined,
  requiredPermission: string
): boolean {
  if (!userRole) return false;

  // Rule: ADMIN role is unconditionally granted full system access
  if (userRole.toUpperCase() === 'ADMIN') {
    return true;
  }

  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }

  // Support global wildcard
  if (userPermissions.includes('*')) {
    return true;
  }

  // Exact match
  if (userPermissions.includes(requiredPermission)) {
    return true;
  }

  // Support module wildcard (e.g., "loans.*")
  const moduleName = requiredPermission.split('.')[0];
  if (moduleName && userPermissions.includes(`${moduleName}.*`)) {
    return true;
  }

  return false;
}

/**
 * Checks if user possesses AT LEAST ONE of the required permissions.
 */
export function hasAnyPermission(
  userRole: string | undefined,
  userPermissions: string[] | undefined,
  requiredPermissions: string[]
): boolean {
  if (!userRole) return false;
  if (userRole.toUpperCase() === 'ADMIN') return true;
  if (!requiredPermissions || requiredPermissions.length === 0) return true;

  return requiredPermissions.some((perm) =>
    hasPermission(userRole, userPermissions, perm)
  );
}

/**
 * Checks if user possesses ALL of the required permissions.
 */
export function hasAllPermissions(
  userRole: string | undefined,
  userPermissions: string[] | undefined,
  requiredPermissions: string[]
): boolean {
  if (!userRole) return false;
  if (userRole.toUpperCase() === 'ADMIN') return true;
  if (!requiredPermissions || requiredPermissions.length === 0) return true;

  return requiredPermissions.every((perm) =>
    hasPermission(userRole, userPermissions, perm)
  );
}

/**
 * Checks if a user has access to a specific module.
 * True if ADMIN, or if user has any permission under this module.
 */
export function canAccessModule(
  userRole: string | undefined,
  userPermissions: string[] | undefined,
  module: AppModule | string
): boolean {
  if (!userRole) return false;
  if (userRole.toUpperCase() === 'ADMIN') return true;

  // Check view permission first
  if (hasPermission(userRole, userPermissions, `${module}.view`)) {
    return true;
  }

  // Check if any permission in that module is granted
  if (userPermissions && userPermissions.length > 0) {
    return userPermissions.some(
      (perm) =>
        perm.startsWith(`${module}.`) ||
        perm === '*' ||
        perm === `${module}.*`
    );
  }

  return false;
}

/**
 * Route protection rules with priority from specific to generic
 */
interface RouteRule {
  pattern: RegExp;
  permission: string;
  module: AppModule;
  action: AppAction;
}

const ROUTE_RULES: RouteRule[] = [
  // Role-Specific Dashboards
  { pattern: /^\/dashboard\/admin/, permission: 'dashboard.admin', module: 'dashboard', action: 'view' },
  { pattern: /^\/dashboard\/management/, permission: 'dashboard.management', module: 'dashboard', action: 'view' },
  { pattern: /^\/dashboard\/staff/, permission: 'dashboard.staff', module: 'dashboard', action: 'view' },

  // Settings & System config
  { pattern: /^\/settings\/permissions/, permission: 'roles.view', module: 'roles', action: 'view' },
  { pattern: /^\/settings\/roles/, permission: 'roles.view', module: 'roles', action: 'view' },
  { pattern: /^\/settings\/users/, permission: 'users.view', module: 'users', action: 'view' },
  { pattern: /^\/settings/, permission: 'settings.view', module: 'settings', action: 'view' },

  // Approvals
  { pattern: /^\/approvals/, permission: 'approvals.view', module: 'approvals', action: 'view' },

  // Audit
  { pattern: /^\/audit/, permission: 'audit.view', module: 'audit', action: 'view' },

  // Reports
  { pattern: /^\/reports/, permission: 'reports.view', module: 'reports', action: 'view' },

  // Documents
  { pattern: /^\/documents/, permission: 'documents.view', module: 'documents', action: 'view' },

  // Customers
  { pattern: /^\/customers\/new/, permission: 'customers.create', module: 'customers', action: 'create' },
  { pattern: /^\/customers\/kyc/, permission: 'kyc.view', module: 'kyc', action: 'view' },
  { pattern: /^\/customers\/[^/]+\/edit/, permission: 'customers.edit', module: 'customers', action: 'edit' },
  { pattern: /^\/customers/, permission: 'customers.view', module: 'customers', action: 'view' },

  // Assessments
  { pattern: /^\/assessments\/new/, permission: 'assessments.create', module: 'assessments', action: 'create' },
  { pattern: /^\/assessments/, permission: 'assessments.view', module: 'assessments', action: 'view' },

  // Loans
  { pattern: /^\/loans\/new/, permission: 'loans.create', module: 'loans', action: 'create' },
  { pattern: /^\/loans\/nominee/, permission: 'loans.create', module: 'loans', action: 'create' },
  { pattern: /^\/loans\/[^/]+\/edit/, permission: 'loans.edit', module: 'loans', action: 'edit' },
  { pattern: /^\/loans/, permission: 'loans.view', module: 'loans', action: 'view' },

  // Collections & Payments
  { pattern: /^\/payments/, permission: 'collections.create', module: 'collections', action: 'create' },
  { pattern: /^\/collections/, permission: 'collections.view', module: 'collections', action: 'view' },

  // Chits
  { pattern: /^\/chits\/new/, permission: 'chits.create', module: 'chits', action: 'create' },
  { pattern: /^\/chits/, permission: 'chits.view', module: 'chits', action: 'view' },

  // Notifications
  { pattern: /^\/notifications/, permission: 'notifications.view', module: 'notifications', action: 'view' },

  // Dashboard
  { pattern: /^\/dashboard/, permission: 'dashboard.view', module: 'dashboard', action: 'view' },
];

/**
 * Returns required permission for a given pathname.
 */
export function getRequiredPermissionForRoute(pathname: string): {
  permission: string;
  module: AppModule;
  action: AppAction;
} | null {
  for (const rule of ROUTE_RULES) {
    if (rule.pattern.test(pathname)) {
      return {
        permission: rule.permission,
        module: rule.module,
        action: rule.action,
      };
    }
  }
  return null;
}

/**
 * Checks whether user has permission to navigate to a route.
 */
export function checkRouteAccess(
  pathname: string,
  userRole: string | undefined,
  userPermissions: string[] | undefined
): { allowed: boolean; requiredPermission?: string; module?: string } {
  // Public or unauthenticated routes are handled outside
  if (!pathname || pathname === '/' || pathname.startsWith('/login')) {
    return { allowed: true };
  }

  if (userRole?.toUpperCase() === 'ADMIN') {
    return { allowed: true };
  }

  const req = getRequiredPermissionForRoute(pathname);
  if (!req) {
    // Unmapped route inside app: default to allowed if authenticated
    return { allowed: true };
  }

  const allowed = hasPermission(userRole, userPermissions, req.permission);
  return {
    allowed,
    requiredPermission: req.permission,
    module: req.module,
  };
}

/**
 * Helper to get permission metadata
 */
export function getPermissionMetadata(permissionId: string): PermissionDefinition | undefined {
  return ALL_PERMISSIONS.find((p) => p.id === permissionId);
}
