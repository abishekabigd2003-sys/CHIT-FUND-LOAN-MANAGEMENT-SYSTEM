'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ShieldCheck, UserCheck, Briefcase, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useRoles } from '@/hooks/useRoles';
import { UserRole } from '@/types/auth';
import { cn } from '@/lib/utils';
import { useToast } from '@/providers/ToastProvider';

export function RoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const { role, switchRole } = useAuth();
  const { roles } = useRoles();
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();

  const getRoleConfig = (code: string) => {
    const upper = code.toUpperCase();
    if (upper === 'ADMIN') {
      return {
        label: 'Admin',
        desc: 'Full system privileges & root control',
        icon: ShieldCheck,
        color: 'text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 border-brand-200/80 dark:border-brand-800/80',
      };
    }
    if (upper === 'STAFF') {
      return {
        label: 'Staff',
        desc: 'Operations, collections & loan drafting',
        icon: UserCheck,
        color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-800/80',
      };
    }
    if (upper === 'MANAGEMENT') {
      return {
        label: 'Management',
        desc: 'Analytics, audits & executive reports',
        icon: Briefcase,
        color: 'text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 border-brand-200/80 dark:border-brand-800/80',
      };
    }
    // Custom roles
    return {
      label: code.replace(/_/g, ' '),
      desc: 'Dynamic custom enterprise role',
      icon: Shield,
      color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-800/80',
    };
  };

  const handleSelectRole = async (newRole: string) => {
    setIsOpen(false);
    if (newRole !== role) {
      await switchRole(newRole as UserRole);
      toast.info('Role Switched', `Now acting as ${getRoleConfig(newRole).label}`);
      if (pathname.startsWith('/dashboard')) {
        const targetDashboard =
          newRole === 'ADMIN'
            ? '/dashboard/admin'
            : newRole === 'MANAGEMENT'
            ? '/dashboard/management'
            : '/dashboard/staff';
        router.push(targetDashboard);
      }
    }
  };

  const current = getRoleConfig(role);
  const CurrentIcon = current.icon;

  const roleList = roles.length > 0 ? roles : [
    { code: 'ADMIN', name: 'Administrator', description: 'Full system privileges' },
    { code: 'STAFF', name: 'Staff', description: 'Operations & collections' },
    { code: 'MANAGEMENT', name: 'Management', description: 'Executive oversight' },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer',
          current.color
        )}
        title="Simulate Role Navigation"
      >
        <CurrentIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8] shrink-0" />
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-70 stroke-[2] shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl z-40 p-2 animate-in fade-in-0 zoom-in-95 max-h-96 overflow-y-auto">
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Switch Role Context
              </p>
              <span className="text-[11px] text-brand-700 dark:text-brand-300 font-bold bg-brand-50 dark:bg-brand-950/80 px-2 py-0.5 rounded-md border border-brand-200/60 dark:border-brand-800/60">
                {roleList.length} Roles
              </span>
            </div>

            {roleList.map((r) => {
              const config = getRoleConfig(r.code);
              const Icon = config.icon;
              const isSelected = r.code.toUpperCase() === role.toUpperCase();

              return (
                <button
                  key={r.code}
                  onClick={() => handleSelectRole(r.code)}
                  className={cn(
                    'w-full flex items-start gap-3 p-2.5 rounded-xl text-left text-sm transition-all cursor-pointer',
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 font-semibold text-slate-900 dark:text-slate-100'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 mt-0.5 shrink-0 stroke-[1.8]',
                      isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate text-xs sm:text-sm">
                        {r.name || config.label}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-md font-bold shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal line-clamp-1 mt-0.5">
                      {r.description || config.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
