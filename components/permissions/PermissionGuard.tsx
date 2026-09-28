'use client';

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { AccessDenied } from './AccessDenied';

export interface PermissionGuardProps {
  permission?: string;
  anyPermissions?: string[];
  allPermissions?: string[];
  module?: string;
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
  children: React.ReactNode;
}

/**
 * Granular Permission Guard component.
 * Conditionally mounts children only if current user's effective permissions satisfy the requirement.
 */
export function PermissionGuard({
  permission,
  anyPermissions,
  allPermissions,
  module,
  fallback = null,
  showAccessDenied = false,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, canAccessModule, isLoading } =
    usePermissions();

  if (isLoading) {
    return null;
  }

  let isAllowed = true;

  if (permission && !hasPermission(permission)) {
    isAllowed = false;
  }

  if (anyPermissions && anyPermissions.length > 0 && !hasAnyPermission(anyPermissions)) {
    isAllowed = false;
  }

  if (allPermissions && allPermissions.length > 0 && !hasAllPermissions(allPermissions)) {
    isAllowed = false;
  }

  if (module && !canAccessModule(module)) {
    isAllowed = false;
  }

  if (isAllowed) {
    return <>{children}</>;
  }

  if (showAccessDenied) {
    return (
      <AccessDenied
        requiredPermission={permission || allPermissions?.[0] || anyPermissions?.[0]}
        moduleName={module}
      />
    );
  }

  return <>{fallback}</>;
}
