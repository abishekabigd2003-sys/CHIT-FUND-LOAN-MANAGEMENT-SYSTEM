'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, ArrowLeft, Home, Lock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';

interface AccessDeniedProps {
  requiredPermission?: string;
  moduleName?: string;
  actionName?: string;
  title?: string;
  message?: string;
}

export function AccessDenied({
  requiredPermission,
  moduleName,
  actionName,
  title = 'Access Restricted: 403 Forbidden',
  message,
}: AccessDeniedProps) {
  const router = useRouter();
  const { role, switchRole } = useAuth();

  const defaultMessage = message || (
    requiredPermission
      ? `Your current role (${role}) lacks the required privilege: '${requiredPermission}'. Only authorized enterprise personnel can access this resource.`
      : `Your current role (${role}) is not authorized to access this module or execute this action.`
  );

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#0f172a] rounded-3xl border border-rose-200 dark:border-rose-950/60 p-6 sm:p-8 shadow-2xl text-center space-y-6 animate-in fade-in-50 zoom-in-95">
        {/* Shield Icon Badge */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm">
          <ShieldAlert className="w-8 h-8 stroke-[1.8]" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-100/70 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <Lock className="w-3 h-3 stroke-[2]" />
            <span>RBAC Security Policy Enforced</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {defaultMessage}
          </p>
        </div>

        {/* Permission & Role Diagnostics */}
        <div className="p-3.5 bg-slate-50 dark:bg-[#0d1527] rounded-2xl border border-slate-200/80 dark:border-slate-800 text-left text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Current Role:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              {role}
            </span>
          </div>
          {requiredPermission && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Required Permission:</span>
              <span className="font-mono text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                {requiredPermission}
              </span>
            </div>
          )}
          {moduleName && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Target Module:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 capitalize">
                {moduleName}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 pt-2">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="text-xs gap-1.5 flex-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="text-xs gap-1.5 flex-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Button>
          </div>

          {/* Quick Simulation Option for testing / evaluation */}
          {role !== 'ADMIN' && (
            <button
              onClick={() => switchRole('ADMIN')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 stroke-[2]" />
              <span>Switch to Admin Role (Evaluate Full Access)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
