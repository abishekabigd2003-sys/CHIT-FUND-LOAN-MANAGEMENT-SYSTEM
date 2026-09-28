'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Shield,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  UserCheck,
  Edit2,
  Trash2,
  KeyRound,
  X,
  Loader2,
} from 'lucide-react';
import { useUsersList } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';
import { usePermissions } from '@/hooks/usePermissions';
import { User, UserRole } from '@/types/auth';
import { Button } from '@/components/ui/Button';
import { PermissionGuard } from '@/components/permissions/PermissionGuard';

import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export default function UsersSettingsPage() {
  const { users, isLoading, assignRole, isAssigningRole, createUser, isCreatingUser, deleteUser } =
    useUsersList();
  const { roles } = useRoles();
  const { hasPermission } = usePermissions();

  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const [selectedRoleToAssign, setSelectedRoleToAssign] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('STAFF');
  const [newUserBranch, setNewUserBranch] = useState('Anna Nagar Branch');
  const [newUserPhone, setNewUserPhone] = useState('+91 98400 11223');
  const [createError, setCreateError] = useState<string | null>(null);

  const canEditUsers = hasPermission('users.edit');
  const canDeleteUsers = hasPermission('users.delete');

  const handleOpenAssignRole = (user: User) => {
    setSelectedUserForRole(user);
    setSelectedRoleToAssign(user.role);
  };

  const handleConfirmRoleAssignment = async () => {
    if (!selectedUserForRole || !selectedRoleToAssign) return;
    await assignRole({ userId: selectedUserForRole.id, roleCode: selectedRoleToAssign });
    setSelectedUserForRole(null);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    try {
      await createUser({
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole as UserRole,
        branch: newUserBranch.trim(),
        phone: newUserPhone.trim(),
      });
      setIsCreateModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
    } catch (err: any) {
      setCreateError(err?.message || 'Failed to create user');
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-600 dark:text-brand-400" />
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Loading user credentials & role assignments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            Staff & User Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage system users, branch affiliations, and assign dynamic RBAC roles.
          </p>
        </div>

        <PermissionGuard permission="users.create">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs shadow-2xs"
          >
            Provision New User
          </Button>
        </PermissionGuard>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Officer Name & Contact</th>
              <th className="py-3.5 px-4">Assigned RBAC Role</th>
              <th className="py-3.5 px-4">Branch Office</th>
              <th className="py-3.5 px-4">Effective Privileges</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium">
            {users.map((u) => {
              const roleDef = roles.find((r) => r.code === u.role);
              const permsCount = roleDef ? roleDef.permissions.length : (u.role === 'ADMIN' ? 'All' : 0);

              return (
                <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  {/* User Profile */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-brand-600 dark:bg-brand-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">{u.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Assigned Role */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          : u.role === 'MANAGEMENT'
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      <Shield className="w-3 h-3" />
                      {roleDef?.name || u.role}
                    </span>
                  </td>

                  {/* Branch */}
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{u.branch}</span>
                    </div>
                  </td>

                  {/* Effective Privileges */}
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {permsCount} active permissions
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {canEditUsers && (
                        <Button
                          variant="outline"
                          size="xs"
                          leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                          onClick={() => handleOpenAssignRole(u)}
                          title="Assign Role"
                        >
                          Assign Role
                        </Button>
                      )}

                      {canDeleteUsers && u.role !== 'ADMIN' && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => {
                            if (confirm(`Deactivate and remove user account for ${u.name}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Role Assignment Modal */}
      <Modal
        isOpen={!!selectedUserForRole}
        onClose={() => setSelectedUserForRole(null)}
        title="Assign Role to User"
        description={selectedUserForRole ? `Configure dynamic RBAC privileges for ${selectedUserForRole.name}` : undefined}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            The user&apos;s effective system permissions will instantly update to match the selected role.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Dynamic Role
            </label>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {roles.map((r) => {
                const isSelected = r.code === selectedRoleToAssign;
                return (
                  <div
                    key={r.code}
                    onClick={() => setSelectedRoleToAssign(r.code)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-colors text-xs flex items-center justify-between ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-900 dark:text-brand-200 font-semibold'
                        : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{r.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        {r.permissions.length} privileges • {r.code}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedUserForRole(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmRoleAssignment}
              isLoading={isAssigningRole}
            >
              Apply Role
            </Button>
          </div>
        </div>
      </Modal>

      {/* Provision New User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision New User"
        description="Create staff or management credentials with branch assignment"
        size="sm"
      >
        <form onSubmit={handleCreateUserSubmit} className="space-y-3.5 text-xs">
          {createError && (
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
              {createError}
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="e.g. Ramesh Kumar"
            required
          />

          <Input
            label="Corporate Email Address"
            type="email"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="e.g. ramesh@chitfund.com"
            required
          />

          <Input
            label="Branch Office"
            type="text"
            value={newUserBranch}
            onChange={(e) => setNewUserBranch(e.target.value)}
            required
          />

          <Input
            label="Phone Number"
            type="text"
            value={newUserPhone}
            onChange={(e) => setNewUserPhone(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Assigned Role
            </label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            >
              {roles.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCreatingUser}
            >
              Provision User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
