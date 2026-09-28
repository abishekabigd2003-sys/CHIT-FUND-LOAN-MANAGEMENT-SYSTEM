'use client';

import React, { useState } from 'react';
import {
  Shield,
  Users,
  Copy,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Lock,
  RotateCcw,
  Sliders,
  CheckCircle2,
  UserCheck,
  Briefcase,
  Crown,
} from 'lucide-react';
import { useRoles } from '@/hooks/useRoles';
import { RoleDefinition } from '@/lib/permissions/permissions';
import { PermissionMatrix } from './PermissionMatrix';
import { RoleForm } from './RoleForm';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { DEFAULT_ROLE_PERMISSIONS, ALL_PERMISSION_IDS } from '@/lib/permissions/permission-constants';
import { cn } from '@/lib/utils';

export function RolePermissionEditor() {
  const {
    roles,
    isLoading,
    updatePermissions,
    isUpdatingPermissions,
    createRole,
    updateRole,
    duplicateRole,
    deleteRole,
    resetToDefaults,
    isResetting,
  } = useRoles();

  const [selectedRoleCode, setSelectedRoleCode] = useState<string>('STAFF');
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const activeRole = roles.find((r) => r.code === selectedRoleCode) || roles[0];

  const handleDuplicate = async (role: RoleDefinition) => {
    const newCode = `${role.code}_COPY`;
    const newName = `${role.name} (Copy)`;
    await duplicateRole({ sourceCode: role.code, newCode, newName });
    setSelectedRoleCode(newCode);
  };

  const handleDelete = async (code: string) => {
    await deleteRole(code);
    setShowDeleteConfirm(null);
    setSelectedRoleCode('STAFF');
  };

  const handleSavePermissions = async (roleCode: string, newPermissions: string[]) => {
    await updatePermissions({ roleCode, permissions: newPermissions });
  };

  // Quick preset applicator
  const applyPreset = async (presetName: 'READ_ONLY' | 'OPERATIONS' | 'FULL') => {
    if (!activeRole || activeRole.code === 'ADMIN') return;

    let perms: string[] = [];
    if (presetName === 'READ_ONLY') {
      perms = [...(DEFAULT_ROLE_PERMISSIONS.MANAGEMENT || [])];
    } else if (presetName === 'OPERATIONS') {
      perms = [...(DEFAULT_ROLE_PERMISSIONS.STAFF || [])];
    } else if (presetName === 'FULL') {
      perms = [...(DEFAULT_ROLE_PERMISSIONS.ADMIN || [])];
    }

    await updatePermissions({ roleCode: activeRole.code, permissions: perms });
  };

  // Helper for role icons & aesthetics
  const getRoleBadgeConfig = (code: string) => {
    const upper = code.toUpperCase();
    if (upper === 'ADMIN') {
      return {
        icon: Crown,
        status: 'System Master Role',
        usersCount: 1,
        color: 'from-purple-600 to-indigo-600',
        badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800',
      };
    }
    if (upper === 'MANAGEMENT') {
      return {
        icon: Briefcase,
        status: 'Executive Oversight',
        usersCount: 2,
        color: 'from-brand-600 to-purple-600',
        badgeColor: 'bg-brand-950/80 text-brand-300 border-brand-800',
      };
    }
    if (upper === 'STAFF') {
      return {
        icon: UserCheck,
        status: 'Operational Field Role',
        usersCount: 4,
        color: 'from-emerald-600 to-teal-600',
        badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
      };
    }
    return {
      icon: Shield,
      status: 'Custom Dynamic Role',
      usersCount: 0,
      color: 'from-amber-600 to-orange-600',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
    };
  };

  if (isLoading && roles.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-brand-500 border-r-transparent" />
        <p className="mt-3 text-xs text-slate-400 font-medium">Loading Dynamic Roles & Permissions Matrix...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <Sliders className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              Dynamic Access Control (RBAC)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">• Enterprise Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dynamic Roles & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage roles and control access to modules and features across your loan management system.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to restore all role permissions to factory defaults?')) {
                resetToDefaults();
              }
            }}
            isLoading={isResetting}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Defaults
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingRole(null);
              setIsRoleFormOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Role
          </Button>
        </div>
      </div>

      {/* 2. Role Overview: Modern Role Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              System & Custom Roles
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              ({roles.length} Active Roles)
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Click any card to inspect or customize privileges</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roles.map((r) => {
            const isSelected = r.code === selectedRoleCode;
            const isAdmin = r.code === 'ADMIN';
            const badgeConfig = getRoleBadgeConfig(r.code);
            const RoleIcon = badgeConfig.icon;
            const userCount = r.usersCount !== undefined ? r.usersCount : badgeConfig.usersCount;

            return (
              <div
                key={r.code}
                onClick={() => setSelectedRoleCode(r.code)}
                className={cn(
                  'group relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between select-none shadow-sm',
                  isSelected
                    ? 'border-brand-500 ring-2 ring-brand-500/25 bg-white dark:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850'
                )}
              >
                {/* Top Status & Role Icon */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={cn(
                        'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-brand-900/20 text-white bg-gradient-to-br transition-transform group-hover:scale-105',
                        badgeConfig.color
                      )}
                    >
                      <RoleIcon className="w-5 h-5" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={cn(
                          'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border',
                          badgeConfig.badgeColor
                        )}
                      >
                        {badgeConfig.status}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-500 dark:text-brand-400 animate-in fade-in-0">
                          <CheckCircle2 className="w-3 h-3" />
                          Managing
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Role Name & Code */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {r.name}
                      </h3>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80">
                        {r.code}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {r.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Meta Bar */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium">
                      {String(userCount).padStart(2, '0')} {userCount === 1 ? 'User' : 'Users'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'font-mono font-bold text-[11px] px-2 py-0.5 rounded border',
                        isAdmin
                          ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                          : 'bg-brand-950/80 text-brand-300 border-brand-800'
                      )}
                    >
                      {isAdmin ? 'FULL ACCESS' : `${r.permissions.length} / ${ALL_PERMISSION_IDS.length}`}
                    </span>

                    {/* Action buttons for custom roles */}
                    {!r.isSystem && (
                      <div
                        className="flex items-center gap-0.5 ml-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleDuplicate(r)}
                          title="Duplicate Role"
                          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingRole(r);
                            setIsRoleFormOpen(true);
                          }}
                          title="Edit Role Profile"
                          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-brand-400 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(r.code)}
                          title="Delete Role"
                          className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Role Selection / Management Header */}
      {activeRole && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Active Role Header Bar */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeRole.name}
                </h2>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {activeRole.code}
                </span>
                {activeRole.isSystem ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                    <Lock className="w-3 h-3 text-purple-600 dark:text-purple-400" /> System Role
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    Custom Enterprise Role
                  </span>
                )}
              </div>

              {/* Statistics Row */}
              <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  Users Assigned: <strong className="text-slate-900 dark:text-white">{String(activeRole.usersCount !== undefined ? activeRole.usersCount : (activeRole.code === 'ADMIN' ? 1 : activeRole.code === 'MANAGEMENT' ? 2 : 4)).padStart(2, '0')}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Active Permissions: <strong className="text-brand-600 dark:text-brand-400">{activeRole.code === 'ADMIN' ? 'ALL (Full Access)' : `${activeRole.permissions.length} / ${ALL_PERMISSION_IDS.length}`}</strong>
                </span>
                <span>•</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {activeRole.description}
                </span>
              </div>
            </div>

            {/* Quick Actions & Role Templates */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {activeRole.code !== 'ADMIN' && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Presets:
                  </span>
                  <button
                    onClick={() => applyPreset('READ_ONLY')}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 transition-colors shadow-sm"
                  >
                    Read-Only
                  </button>
                  <button
                    onClick={() => applyPreset('OPERATIONS')}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 transition-colors shadow-sm"
                  >
                    Field Staff
                  </button>
                  <button
                    onClick={() => applyPreset('FULL')}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 transition-colors shadow-sm"
                  >
                    Full Privileges
                  </button>
                </div>
              )}

              {!activeRole.isSystem && (
                <>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      setEditingRole(activeRole);
                      setIsRoleFormOpen(true);
                    }}
                    leftIcon={<Edit2 className="w-3 h-3" />}
                  >
                    Edit Role
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => handleDuplicate(activeRole)}
                    leftIcon={<Copy className="w-3 h-3" />}
                  >
                    Duplicate
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* 4. Permission Matrix */}
          <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/50">
            <PermissionMatrix
              key={activeRole.code}
              role={activeRole}
              onSave={handleSavePermissions}
              isSaving={isUpdatingPermissions}
            />
          </div>
        </div>
      )}

      {/* Role Creation / Edit Modal */}
      <RoleForm
        isOpen={isRoleFormOpen}
        onClose={() => {
          setIsRoleFormOpen(false);
          setEditingRole(null);
        }}
        onSubmit={async (data) => {
          if (editingRole) {
            await updateRole({ code: editingRole.code, data });
          } else {
            const created = await createRole(data);
            setSelectedRoleCode(created.code);
          }
        }}
        existingRoles={roles}
        initialRole={editingRole}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        title={showDeleteConfirm ? `Delete Role '${showDeleteConfirm}'?` : undefined}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to delete this custom role definition? Users assigned to this role must be reallocated before deletion.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(showDeleteConfirm!)}
            >
              Delete Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
