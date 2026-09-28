'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users';
import { User } from '@/types/auth';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

export function useUsersList() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const toast = useToast();

  const {
    data: users = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => usersApi.getUsers(),
  });

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, roleCode }: { userId: string; roleCode: string }) => {
      return usersApi.assignRole(userId, roleCode, user);
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      toast.success('Role Assigned', `Assigned role ${updatedUser.role} to ${updatedUser.name}.`);
    },
    onError: (err: any) => {
      toast.error('Assignment Failed', err?.message || 'Could not assign role.');
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      return usersApi.createUser(userData, user);
    },
    onSuccess: (newUser) => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
      toast.success('User Provisioned', `New user ${newUser.name} created successfully.`);
    },
    onError: (err: any) => {
      toast.error('Provisioning Failed', err?.message || 'Could not create user.');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, data }: { userId: string; data: Partial<User> }) => {
      return usersApi.updateUser(userId, data, user);
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
      toast.success('User Updated', `Updated details for ${updatedUser.name}.`);
    },
    onError: (err: any) => {
      toast.error('Update Failed', err?.message || 'Could not update user.');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return usersApi.deleteUser(userId, user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-list'] });
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
      toast.info('User Removed', 'User account has been deleted.');
    },
    onError: (err: any) => {
      toast.error('Delete Failed', err?.message || 'Could not delete user.');
    },
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    assignRole: assignRoleMutation.mutateAsync,
    isAssigningRole: assignRoleMutation.isPending,
    createUser: createUserMutation.mutateAsync,
    isCreatingUser: createUserMutation.isPending,
    updateUser: updateUserMutation.mutateAsync,
    isUpdatingUser: updateUserMutation.isPending,
    deleteUser: deleteUserMutation.mutateAsync,
    isDeletingUser: deleteUserMutation.isPending,
  };
}
