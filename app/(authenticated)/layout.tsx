'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { usePermissions } from '@/hooks/usePermissions';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { AccessDenied } from '@/components/permissions/AccessDenied';
import { checkRouteAccess } from '@/lib/permissions/permission-utils';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { prewarmCoreModules } from '@/lib/navigation-prefetch';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { role, permissions, isLoading: isPermsLoading } = usePermissions();

  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenSidebar = React.useCallback(() => setSidebarOpen(true), []);
  const handleCloseSidebar = React.useCallback(() => setSidebarOpen(false), []);

  // Dynamic Route Authorization Check - memoized per route/role
  const routeCheck = React.useMemo(
    () => checkRouteAccess(pathname, role, permissions),
    [pathname, role, permissions]
  );

  useEffect(() => {
    setMounted(true);
    prewarmCoreModules(queryClient);
  }, [queryClient]);

  useEffect(() => {
    if (mounted && !isAuthLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, isAuthLoading, router]);

  if (!mounted || isAuthLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 text-white z-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
          <p className="text-xs text-slate-400 font-medium">Validating RBAC Security Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex h-full w-full overflow-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 min-h-0 h-full overflow-hidden">
        <Header onMenuClick={handleOpenSidebar} />

        <main className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 lg:p-5">
          <div className="max-w-7xl mx-auto space-y-4 animate-page-in">
            <Breadcrumbs />
            {routeCheck.allowed ? (
              children
            ) : (
              <AccessDenied
                requiredPermission={routeCheck.requiredPermission}
                moduleName={routeCheck.module}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
