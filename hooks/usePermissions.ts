'use client';

import { useMemo, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { rolesApi } from '@/lib/api/roles';
import { ALL_PERMISSION_IDS } from '@/lib/permissions/permission-constants';
import {
  hasPermission as checkPerm,
  hasAnyPermission as checkAny,
  hasAllPermissions as checkAll,
  canAccessModule as checkMod,
} from '@/lib/permissions/permission-utils';
import { AppModule } from '@/lib/permissions/permissions';

export function usePermissions() {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();

  const currentRole = role || user?.role || 'ADMIN';
  const isAdmin = currentRole.toUpperCase() === 'ADMIN';

  // Fetch dynamic permissions for the user's active role
  const {
    data: activePermissions = rolesApi.getStoredPermissionsForRole(currentRole),
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['role-permissions', currentRole],
    queryFn: async () => {
      if (isAdmin) {
        return ALL_PERMISSION_IDS;
      }
      const roleDef = await rolesApi.getRoleByCode(currentRole);
      return roleDef?.permissions || [];
    },
    initialData: () => rolesApi.getStoredPermissionsForRole(currentRole),
    staleTime: 1000 * 60 * 5, // 5 minutes, invalidated reactively
    refetchOnWindowFocus: false,
  });

  // Listen to RBAC update events across tabs/modals
  useEffect(() => {
    const handlePermissionsUpdated = () => {
      rolesApi.invalidateCache();
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
    };

    const handleUserUpdated = () => {
      rolesApi.invalidateCache();
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
    };

    window.addEventListener('rbac-permissions-updated', handlePermissionsUpdated);
    window.addEventListener('rbac-user-updated', handleUserUpdated);

    return () => {
      window.removeEventListener('rbac-permissions-updated', handlePermissionsUpdated);
      window.removeEventListener('rbac-user-updated', handleUserUpdated);
    };
  }, [queryClient]);

  const hasPermission = useCallback(
    (requiredPermission: string): boolean => {
      return checkPerm(currentRole, activePermissions, requiredPermission);
    },
    [currentRole, activePermissions]
  );

  const hasAnyPermission = useCallback(
    (requiredPermissions: string[]): boolean => {
      return checkAny(currentRole, activePermissions, requiredPermissions);
    },
    [currentRole, activePermissions]
  );

  const hasAllPermissions = useCallback(
    (requiredPermissions: string[]): boolean => {
      return checkAll(currentRole, activePermissions, requiredPermissions);
    },
    [currentRole, activePermissions]
  );

  const canAccessModule = useCallback(
    (moduleName: AppModule | string): boolean => {
      return checkMod(currentRole, activePermissions, moduleName);
    },
    [currentRole, activePermissions]
  );

  return useMemo(
    () => ({
      permissions: activePermissions,
      role: currentRole,
      user,
      isAdmin,
      isLoading,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canAccessModule,
      refetchPermissions: refetch,
    }),
    [
      activePermissions,
      currentRole,
      user,
      isAdmin,
      isLoading,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canAccessModule,
      refetch,
    ]
  );
}
