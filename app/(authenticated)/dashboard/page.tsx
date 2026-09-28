'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function DashboardRouterPage() {
  const router = useRouter();
  const { role, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (role === 'ADMIN') {
      router.replace('/dashboard/admin');
    } else if (role === 'MANAGEMENT') {
      router.replace('/dashboard/management');
    } else {
      router.replace('/dashboard/staff');
    }
  }, [role, isLoading, isAuthenticated, router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400" />
      <p className="text-xs text-slate-500 font-medium">Routing to {role} Dashboard...</p>
    </div>
  );
}
