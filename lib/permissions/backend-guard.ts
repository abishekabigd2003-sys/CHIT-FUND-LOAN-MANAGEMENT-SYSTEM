import { User } from '@/types/auth';
import { hasPermission } from './permission-utils';

export class AuthorizationError extends Error {
  public statusCode: number = 403;
  public requiredPermission?: string;

  constructor(message: string, requiredPermission?: string) {
    super(message);
    this.name = 'AuthorizationError';
    this.requiredPermission = requiredPermission;
  }
}

/**
 * Backend authorization guard: validates that the user possesses the required permission.
 * Throws an AuthorizationError (403) if authorization fails.
 */
export function assertPermission(
  user: User | null | undefined,
  requiredPermission: string,
  userPermissions?: string[]
): void {
  if (!user) {
    throw new AuthorizationError('Authentication required to perform this action', requiredPermission);
  }

  // Admin always authorized
  if (user.role?.toUpperCase() === 'ADMIN') {
    return;
  }

  const isAllowed = hasPermission(user.role, userPermissions, requiredPermission);
  if (!isAllowed) {
    throw new AuthorizationError(
      `Forbidden: Access denied. Missing permission '${requiredPermission}' for role '${user.role}'`,
      requiredPermission
    );
  }
}

/**
 * Strict Admin-only guard: enforces that only users with role 'ADMIN' can perform
 * sensitive RBAC operations (modifying roles, changing user roles, editing permissions).
 */
export function assertAdmin(user: User | null | undefined, operation: string = 'RBAC configuration'): void {
  if (!user) {
    throw new AuthorizationError(`Authentication required for ${operation}`);
  }

  if (user.role?.toUpperCase() !== 'ADMIN') {
    throw new AuthorizationError(
      `Forbidden: Only administrators are authorized to execute ${operation}. Current role: '${user.role}'`
    );
  }
}

/**
 * Validates permission without throwing, returns detailed boolean result.
 */
export function validateBackendPermission(
  user: User | null | undefined,
  requiredPermission: string,
  userPermissions?: string[]
): { authorized: boolean; reason?: string } {
  try {
    assertPermission(user, requiredPermission, userPermissions);
    return { authorized: true };
  } catch (err: any) {
    return { authorized: false, reason: err.message };
  }
}
