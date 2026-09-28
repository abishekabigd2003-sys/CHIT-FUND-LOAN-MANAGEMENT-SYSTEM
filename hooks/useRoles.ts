'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '@/lib/api/roles';
import { CreateRoleDto, UpdateRoleDto } from '@/lib/permissions/permissions';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

export function useRoles() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  const {
    data: roles = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['roles-list'],
    queryFn: () => rolesApi.getRoles(),
    staleTime: 1000 * 60 * 5,
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ roleCode, permissions }: { roleCode: string; permissions: string[] }) => {
      return rolesApi.updateRolePermissions(roleCode, permissions, user);
    },
    onSuccess: (updatedRole) => {
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      toast.success('Permissions Updated', `Successfully updated permissions for ${updatedRole.name}.`);
    },
    onError: (err: any) => {
      toast.error('Permission Update Failed', err?.message || 'Could not update permissions.');
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: async (data: CreateRoleDto) => {
      return rolesApi.createRole(data, user);
    },
    onSuccess: (newRole) => {
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
      toast.success('Role Created', `Custom role '${newRole.name}' (${newRole.code}) created successfully.`);
    },
    onError: (err: any) => {
      toast.error('Failed to Create Role', err?.message || 'Could not create role.');
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ code, data }: { code: string; data: UpdateRoleDto }) => {
      return rolesApi.updateRole(code, data, user);
    },
    onSuccess: (updatedRole) => {
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
      toast.success('Role Updated', `Updated profile for role ${updatedRole.name}.`);
    },
    onError: (err: any) => {
      toast.error('Failed to Update Role', err?.message || 'Could not update role.');
    },
  });

  const duplicateRoleMutation = useMutation({
    mutationFn: async ({ sourceCode, newCode, newName }: { sourceCode: string; newCode: string; newName: string }) => {
      return rolesApi.duplicateRole(sourceCode, newCode, newName, user);
    },
    onSuccess: (newRole) => {
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
      toast.success('Role Duplicated', `Created role '${newRole.name}' cloned with permissions.`);
    },
    onError: (err: any) => {
      toast.error('Duplication Failed', err?.message || 'Could not duplicate role.');
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (code: string) => {
      return rolesApi.deleteRole(code, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
      toast.info('Role Deleted', 'The custom role has been removed.');
    },
    onError: (err: any) => {
      toast.error('Cannot Delete Role', err?.message || 'Failed to delete role.');
    },
  });

  const resetRolesMutation = useMutation({
    mutationFn: async () => {
      return rolesApi.resetRolesToDefault(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      toast.success('Defaults Restored', 'All roles and permissions have been reset to factory defaults.');
    },
    onError: (err: any) => {
      toast.error('Reset Failed', err?.message || 'Could not reset roles.');
    },
  });

  return {
    roles,
    isLoading,
    error,
    refetch,
    updatePermissions: updatePermissionsMutation.mutateAsync,
    isUpdatingPermissions: updatePermissionsMutation.isPending,
    createRole: createRoleMutation.mutateAsync,
    isCreatingRole: createRoleMutation.isPending,
    updateRole: updateRoleMutation.mutateAsync,
    isUpdatingRole: updateRoleMutation.isPending,
    duplicateRole: duplicateRoleMutation.mutateAsync,
    isDuplicatingRole: duplicateRoleMutation.isPending,
    deleteRole: deleteRoleMutation.mutateAsync,
    isDeletingRole: deleteRoleMutation.isPending,
    resetToDefaults: resetRolesMutation.mutateAsync,
    isResetting: resetRolesMutation.isPending,
  };
}

export function useRole(code: string) {
  return useQuery({
    queryKey: ['role-detail', code],
    queryFn: () => rolesApi.getRoleByCode(code),
    enabled: !!code,
  });
}
