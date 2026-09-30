'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export const Breadcrumbs = React.memo(function Breadcrumbs() {
  const pathname = usePathname();
  const { role } = useAuth();
  const segments = pathname.split('/').filter(Boolean);

  // Do not render breadcrumbs on dashboard root or role dashboard pages
  if (
    segments.length === 0 ||
    (segments.length === 1 && segments[0] === 'dashboard') ||
    (segments.length === 2 && segments[0] === 'dashboard')
  ) {
    return null;
  }

  const dashboardHref =
    role === 'ADMIN'
      ? '/dashboard/admin'
      : role === 'MANAGEMENT'
      ? '/dashboard/management'
      : '/dashboard/staff';

  const formatSegment = (str: string) => {
    if (str.startsWith('cust-') || str.startsWith('loan-') || str.startsWith('chit-')) {
      return str.toUpperCase();
    }
    return str
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1.5 sm:space-x-2 text-[14px] font-medium text-slate-500 dark:text-slate-400 mb-3 sm:mb-4 overflow-x-auto whitespace-nowrap scrollbar-none py-1"
    >
      <Link
        href={dashboardHref}
        prefetch={true}
        className="flex items-center hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 font-medium"
      >
        <Home className="w-4 h-4 mr-1.5 text-slate-400 dark:text-slate-500 stroke-[1.8]" />
        <span>Dashboard</span>
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;

        return (
          <React.Fragment key={href}>
            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 stroke-[2]" />
            {isLast ? (
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {formatSegment(segment)}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 font-medium"
              >
                {formatSegment(segment)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
});
