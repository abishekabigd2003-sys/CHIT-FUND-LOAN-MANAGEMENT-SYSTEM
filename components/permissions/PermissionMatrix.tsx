'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Check,
  Search,
  Save,
  RotateCcw,
  CheckSquare,
  Square,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Lock,
  Sparkles,
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileText,
  ClipboardCheck,
  Coins,
  CreditCard,
  Landmark,
  Bell,
  BarChart3,
  History,
  UserCog,
  KeyRound,
  Settings,
} from 'lucide-react';
import { RoleDefinition, AppModule } from '@/lib/permissions/permissions';
import { APP_MODULES, ALL_PERMISSIONS, ALL_PERMISSION_IDS } from '@/lib/permissions/permission-constants';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/utils';

interface PermissionMatrixProps {
  role: RoleDefinition;
  onSave: (roleCode: string, permissions: string[]) => Promise<void>;
  isSaving?: boolean;
}

// Module Icon mapping
const MODULE_ICONS: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  customers: Users,
  kyc: ShieldCheck,
  documents: FileText,
  assessments: ClipboardCheck,
  loans: Coins,
  approvals: CheckCircle2,
  collections: CreditCard,
  chits: Landmark,
  notifications: Bell,
  reports: BarChart3,
  audit: History,
  users: UserCog,
  roles: KeyRound,
  settings: Settings,
};

// Action badge colors tailored for dark theme contrast
const ACTION_BADGES: Record<string, { label: string; color: string }> = {
  view: { label: 'View', color: 'bg-blue-950/80 text-blue-300 border-blue-800/70' },
  create: { label: 'Create', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/70' },
  edit: { label: 'Edit', color: 'bg-amber-950/80 text-amber-300 border-amber-800/70' },
  delete: { label: 'Delete', color: 'bg-rose-950/80 text-rose-300 border-rose-800/70' },
  approve: { label: 'Approve', color: 'bg-purple-950/80 text-purple-300 border-purple-800/70' },
  reject: { label: 'Reject', color: 'bg-orange-950/80 text-orange-300 border-orange-800/70' },
  export: { label: 'Export', color: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/70' },
  upload: { label: 'Upload', color: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/70' },
  assign: { label: 'Assign', color: 'bg-teal-950/80 text-teal-300 border-teal-800/70' },
  update: { label: 'Update', color: 'bg-lime-950/80 text-lime-300 border-lime-800/70' },
  close: { label: 'Close', color: 'bg-slate-800 text-slate-300 border-slate-700' },
};

export function PermissionMatrix({ role, onSave, isSaving = false }: PermissionMatrixProps) {
  const isAdminRole = role.code.toUpperCase() === 'ADMIN';

  // Internal state of checked permission IDs
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(isAdminRole ? ALL_PERMISSION_IDS : role.permissions)
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'ENABLED' | 'RESTRICTED'>('ALL');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    APP_MODULES.slice(0, 4).forEach((m) => {
      initial[m.id] = true;
    });
    return initial;
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Sync state when role changes
  useEffect(() => {
    setSelectedPermissions(new Set(isAdminRole ? ALL_PERMISSION_IDS : role.permissions));
  }, [role, isAdminRole]);

  // Track unsaved modifications
  const hasChanges = useMemo(() => {
    if (isAdminRole) return false;
    const originalSet = new Set(role.permissions);
    if (originalSet.size !== selectedPermissions.size) return true;
    for (const p of selectedPermissions) {
      if (!originalSet.has(p)) return true;
    }
    return false;
  }, [role.permissions, selectedPermissions, isAdminRole]);

  // Diff summary
  const diffSummary = useMemo(() => {
    const originalSet = new Set(role.permissions);
    const added: string[] = [];
    const removed: string[] = [];

    for (const p of selectedPermissions) {
      if (!originalSet.has(p)) added.push(p);
    }
    for (const p of originalSet) {
      if (!selectedPermissions.has(p)) removed.push(p);
    }

    return { added, removed };
  }, [role.permissions, selectedPermissions]);

  // Filtered modules
  const filteredModules = useMemo(() => {
    return APP_MODULES.filter((m) => {
      const modulePerms = ALL_PERMISSIONS.filter((p) => p.module === m.id);
      const enabledCount = modulePerms.filter((p) => selectedPermissions.has(p.id)).length;

      if (filterMode === 'ENABLED' && enabledCount === 0) return false;
      if (filterMode === 'RESTRICTED' && enabledCount === modulePerms.length) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      if (m.label.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)) return true;
      return modulePerms.some((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    });
  }, [searchQuery, filterMode, selectedPermissions]);

  const togglePermission = (permId: string) => {
    if (isAdminRole) return;
    const updated = new Set(selectedPermissions);
    if (updated.has(permId)) {
      updated.delete(permId);
    } else {
      updated.add(permId);
    }
    setSelectedPermissions(updated);
  };

  const toggleModulePermissions = (module: AppModule) => {
    if (isAdminRole) return;
    const modulePerms = ALL_PERMISSIONS.filter((p) => p.module === module).map((p) => p.id);
    const allChecked = modulePerms.every((id) => selectedPermissions.has(id));

    const updated = new Set(selectedPermissions);
    if (allChecked) {
      modulePerms.forEach((id) => updated.delete(id));
    } else {
      modulePerms.forEach((id) => updated.add(id));
    }
    setSelectedPermissions(updated);
  };

  const handleSelectAll = () => {
    if (isAdminRole) return;
    setSelectedPermissions(new Set(ALL_PERMISSION_IDS));
  };

  const handleClearAll = () => {
    if (isAdminRole) return;
    setSelectedPermissions(new Set());
  };

  const handleRevert = () => {
    setSelectedPermissions(new Set(role.permissions));
  };

  const toggleExpand = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    APP_MODULES.forEach((m) => {
      all[m.id] = true;
    });
    setExpandedModules(all);
  };

  const collapseAll = () => {
    setExpandedModules({});
  };

  const handleConfirmSave = async () => {
    await onSave(role.code, Array.from(selectedPermissions));
    setShowConfirmModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Admin Safety Notice */}
      {isAdminRole && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-950/40 border border-purple-800/80 text-purple-200">
          <div className="w-8 h-8 rounded-lg bg-purple-900/80 border border-purple-700 text-purple-300 flex items-center justify-center shrink-0 shadow-sm">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Admin Master Control Lock
            </h4>
            <p className="text-xs text-purple-300/80 mt-0.5 leading-relaxed">
              The <strong>Administrator</strong> possesses unrestricted, immutable system privileges across all modules by security policy. Admin permissions cannot be restricted.
            </p>
          </div>
        </div>
      )}

      {/* Control Bar: Search, Filters & Bulk Actions */}
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search module or permission..."
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              ×
            </button>
          )}
        </div>

        {/* Center: Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setFilterMode('ALL')}
            className={cn(
              'px-2.5 py-1 rounded-md font-medium transition-colors text-[11px]',
              filterMode === 'ALL'
                ? 'bg-brand-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850'
            )}
          >
            All Modules ({APP_MODULES.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('ENABLED')}
            className={cn(
              'px-2.5 py-1 rounded-md font-medium transition-colors text-[11px]',
              filterMode === 'ENABLED'
                ? 'bg-brand-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850'
            )}
          >
            Configured
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('RESTRICTED')}
            className={cn(
              'px-2.5 py-1 rounded-md font-medium transition-colors text-[11px]',
              filterMode === 'RESTRICTED'
                ? 'bg-brand-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-850'
            )}
          >
            Restricted
          </button>
        </div>

        {/* Right: Quick actions & Expand/Collapse */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isAdminRole && (
            <>
              <button
                type="button"
                onClick={handleSelectAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                <CheckSquare className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
                <span>Select All</span>
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                <Square className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Clear All</span>
              </button>
            </>
          )}

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          <button
            type="button"
            onClick={expandAll}
            className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:underline px-1"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:underline px-1"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Accordion Module List */}
      <div className="space-y-3">
        {filteredModules.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-slate-800 bg-slate-900/60 text-slate-400 text-xs">
            No modules match your current filter or search criteria.
          </div>
        ) : (
          filteredModules.map((module) => {
            const modulePerms = ALL_PERMISSIONS.filter((p) => p.module === module.id);
            const enabledCount = modulePerms.filter((p) => selectedPermissions.has(p.id)).length;
            const isAllEnabled = modulePerms.length > 0 && enabledCount === modulePerms.length;
            const isPartial = enabledCount > 0 && enabledCount < modulePerms.length;
            const isExpanded = !!expandedModules[module.id];
            const Icon = MODULE_ICONS[module.id] || LayoutDashboard;

            const percentage = modulePerms.length > 0 ? Math.round((enabledCount / modulePerms.length) * 100) : 0;

            return (
              <div
                key={module.id}
                className={cn(
                  'rounded-2xl border transition-all duration-200 overflow-hidden bg-white dark:bg-slate-900 shadow-xs',
                  isExpanded
                    ? 'border-slate-300 dark:border-slate-700 shadow-md ring-1 ring-slate-300/50 dark:ring-slate-700/50'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-750'
                )}
              >
                {/* Module Header Bar */}
                <div
                  onClick={() => toggleExpand(module.id)}
                  className="px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer select-none bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all',
                        enabledCount > 0
                          ? 'bg-brand-50 dark:bg-slate-850 border-brand-200 dark:border-slate-700 text-brand-600 dark:text-brand-400'
                          : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {module.label}
                        </span>
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80">
                          {module.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {module.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Header Status, Module Switch & Chevron */}
                  <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Progress & Badge */}
                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <span
                          className={cn(
                            'text-xs font-bold',
                            isAllEnabled
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : isPartial
                              ? 'text-brand-600 dark:text-brand-400'
                              : 'text-slate-500 dark:text-slate-400'
                          )}
                        >
                          {enabledCount} / {modulePerms.length}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">enabled</span>
                      </div>
                      <div className="w-20 bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            isAllEnabled
                              ? 'bg-emerald-500'
                              : isPartial
                              ? 'bg-brand-500'
                              : 'bg-slate-300 dark:bg-slate-700'
                          )}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Module-level Master Switch */}
                    {!isAdminRole ? (
                      <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
                        <Switch
                          checked={isAllEnabled}
                          partial={isPartial}
                          ariaLabel={isAllEnabled ? 'Disable all permissions in this module' : 'Enable all permissions in this module'}
                          title={isAllEnabled ? 'Disable all permissions in this module' : 'Enable all permissions in this module'}
                          onCheckedChange={() => toggleModulePermissions(module.id)}
                        />
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                        <Lock className="w-2.5 h-2.5" />
                        Locked
                      </span>
                    )}

                    {/* Expand/Collapse Chevron */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(module.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          isExpanded ? 'transform rotate-180' : ''
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Granular Permissions Grid */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/70">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {modulePerms.map((perm) => {
                        const isChecked = selectedPermissions.has(perm.id);
                        const badgeInfo = ACTION_BADGES[perm.action] || {
                          label: perm.action,
                          color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                        };

                        return (
                          <div
                            key={perm.id}
                            onClick={() => !isAdminRole && togglePermission(perm.id)}
                            className={cn(
                              'p-3.5 rounded-xl border transition-all duration-150 flex items-start justify-between gap-3 select-none',
                              isAdminRole
                                ? 'bg-white dark:bg-slate-900 border-purple-300/60 dark:border-purple-900/50 cursor-default'
                                : isChecked
                                ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-emerald-500/50 shadow-xs cursor-pointer'
                                : 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-850/70 cursor-pointer'
                            )}
                          >
                            <div className="min-w-0 space-y-1.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={cn(
                                    'font-semibold text-xs',
                                    isChecked ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200 font-medium'
                                  )}
                                >
                                  {perm.name}
                                </span>
                                <span
                                  className={cn(
                                    'text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border',
                                    badgeInfo.color
                                  )}
                                >
                                  {badgeInfo.label}
                                </span>
                              </div>
                              <p
                                className={cn(
                                  'text-[11px] leading-relaxed line-clamp-2',
                                  isChecked ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'
                                )}
                              >
                                {perm.description}
                              </p>
                              <span
                                className={cn(
                                  'font-mono text-[10px] block',
                                  isChecked ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'
                                )}
                              >
                                {perm.id}
                              </span>
                            </div>

                            {/* Modern Toggle Switch */}
                            <div className="shrink-0 pt-0.5">
                              {isAdminRole ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-950 text-purple-400 border border-purple-800 shadow-sm">
                                  <Lock className="w-3 h-3" />
                                </span>
                              ) : (
                                <Switch
                                  checked={isChecked}
                                  ariaLabel={`Toggle ${perm.name}`}
                                  title={isChecked ? 'Click to disable permission' : 'Click to enable permission'}
                                  onCheckedChange={() => togglePermission(perm.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modern Sticky Save Changes Floating Banner */}
      {hasChanges && (
        <div className="sticky bottom-4 z-40 p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-white">Unsaved Changes for {role.name}</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/30">
                  {diffSummary.added.length + diffSummary.removed.length} Modified
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                +{diffSummary.added.length} privileges granted, -{diffSummary.removed.length} privileges revoked.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevert}
              className="text-xs bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Discard</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowConfirmModal(true)}
              isLoading={isSaving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
              className="text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold shadow-md shadow-brand-600/30 whitespace-nowrap"
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in-0">
          <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-950 border border-brand-800 text-brand-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Update Permissions for {role.name}
                </h3>
                <p className="text-xs text-slate-400">
                  Role Code: <span className="font-mono font-semibold text-slate-300">{role.code}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              These changes take effect immediately across all active users and sessions assigned to <strong>{role.name}</strong>.
            </p>

            {/* Changes Breakdown */}
            <div className="space-y-2 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between items-center text-emerald-400">
                <span className="font-semibold">+ Privileges Granted:</span>
                <span className="font-bold">{diffSummary.added.length}</span>
              </div>
              <div className="flex justify-between items-center text-rose-400">
                <span className="font-semibold">- Privileges Revoked:</span>
                <span className="font-bold">{diffSummary.removed.length}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center font-bold text-white">
                <span>Total Active Permissions:</span>
                <span>{selectedPermissions.size} / {ALL_PERMISSION_IDS.length}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSaving}
                className="text-xs bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmSave}
                isLoading={isSaving}
                className="text-xs gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Enforce Live</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
