'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, role } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        const dest =
          role === 'ADMIN'
            ? '/dashboard/admin'
            : role === 'MANAGEMENT'
            ? '/dashboard/management'
            : '/dashboard/staff';
        router.replace(dest);
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading, role, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
        <p className="text-xs text-slate-400 font-medium tracking-wide">Loading Financial Ledger...</p>
      </div>
    </div>
  );
}
