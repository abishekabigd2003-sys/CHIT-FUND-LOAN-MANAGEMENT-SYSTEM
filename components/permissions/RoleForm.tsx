'use client';

import React, { useState } from 'react';
import { X, Shield, Plus, Copy, AlertCircle, Sparkles, KeyRound, Check } from 'lucide-react';
import { RoleDefinition, CreateRoleDto } from '@/lib/permissions/permissions';
import { Button } from '@/components/ui/Button';

import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

interface RoleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoleDto) => Promise<void>;
  existingRoles: RoleDefinition[];
  initialRole?: RoleDefinition | null;
}

export function RoleForm({
  isOpen,
  onClose,
  onSubmit,
  existingRoles,
  initialRole,
}: RoleFormProps) {
  const isEditing = !!initialRole;

  const [code, setCode] = useState(initialRole?.code || '');
  const [name, setName] = useState(initialRole?.name || '');
  const [description, setDescription] = useState(initialRole?.description || '');
  const [cloneFromCode, setCloneFromCode] = useState<string>(initialRole ? '' : 'STAFF');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    const cleanName = name.trim();
    const cleanDesc = description.trim();

    if (!cleanCode) {
      setError('Role code identifier is required (e.g. LOAN_OFFICER, BRANCH_MANAGER).');
      return;
    }
    if (!cleanName) {
      setError('Role display name is required.');
      return;
    }

    if (!isEditing && existingRoles.some((r) => r.code.toUpperCase() === cleanCode)) {
      setError(`A role with code '${cleanCode}' already exists. Please choose a unique identifier.`);
      return;
    }

    let initialPermissions: string[] = [];
    if (!isEditing && cloneFromCode) {
      const source = existingRoles.find((r) => r.code === cloneFromCode);
      if (source) {
        initialPermissions = [...source.permissions];
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        code: cleanCode,
        name: cleanName,
        description: cleanDesc || `Enterprise role for ${cleanName}`,
        permissions: isEditing ? initialRole?.permissions : initialPermissions,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save role');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Custom Role' : 'Create Dynamic Security Role'}
      description={
        isEditing
          ? 'Update role metadata and descriptive scope'
          : 'Define a new role and optionally clone permission templates'
      }
      size="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Role Display Name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!isEditing && !code) {
                setCode(e.target.value.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, ''));
              }
            }}
            placeholder="e.g. Senior Underwriter, Zonal Auditor, Recovery Lead"
            required
          />

          <Input
            label="Role Code Identifier"
            type="text"
            value={code}
            disabled={isEditing}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_'))}
            placeholder="e.g. SENIOR_UNDERWRITER"
            helperText="Unique programmatic key used for backend API authorization and route validation."
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description & Business Scope
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Explain responsibilities, operational tier, and assigned team..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none resize-none transition-all"
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Initial Permission Template
              </label>
              <select
                value={cloneFromCode}
                onChange={(e) => setCloneFromCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-none transition-all"
              >
                <option value="">Start with blank permissions (0 granted)</option>
                {existingRoles.map((r) => (
                  <option key={r.code} value={r.code}>
                    Clone from {r.name} ({r.permissions.length} privileges)
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">
                You can fine-tune individual privileges immediately after creation in the matrix.
              </span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              {isEditing ? 'Save Changes' : 'Create Role'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
