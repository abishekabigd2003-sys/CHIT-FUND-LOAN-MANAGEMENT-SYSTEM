'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users2,
  Landmark,
  Coins,
  WalletCards,
  BarChart3,
  Bell,
  Settings2,
  X,
  ChevronRight,
  ClipboardCheck,
  ShieldCheck,
  History,
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';
import { AppModule } from '@/lib/permissions/permissions';
import { useQueryClient } from '@tanstack/react-query';
import { prefetchModuleData } from '@/lib/navigation-prefetch';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface SubNavItem {
  label: string;
  href: string;
  requiredPermission?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: any;
  module: AppModule;
  section?: string;
  requiredPermission?: string;
  subItems?: SubNavItem[];
  badge?: number;
}

const RAW_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    module: 'dashboard',
    section: 'Overview',
    requiredPermission: 'dashboard.view',
  },
  {
    label: 'Customers',
    href: '/customers',
    icon: Users2,
    module: 'customers',
    section: 'Core Banking',
    requiredPermission: 'customers.view',
    subItems: [
      { label: 'All Customers', href: '/customers', requiredPermission: 'customers.view' },
      { label: 'Add Customer', href: '/customers/new', requiredPermission: 'customers.create' },
      { label: 'KYC Profiles', href: '/customers/kyc', requiredPermission: 'kyc.view' },
      { label: 'Documents', href: '/documents', requiredPermission: 'documents.view' },
    ],
  },
  {
    label: 'Loan Assessment',
    href: '/assessments',
    icon: ClipboardCheck,
    module: 'assessments',
    section: 'Core Banking',
    requiredPermission: 'assessments.view',
    subItems: [
      { label: 'Assessments', href: '/assessments', requiredPermission: 'assessments.view' },
      { label: 'New Assessment', href: '/assessments/new', requiredPermission: 'assessments.create' },
      { label: 'Under Review', href: '/assessments?status=UNDER_REVIEW', requiredPermission: 'assessments.view' },
      { label: 'Approved', href: '/assessments?status=APPROVED', requiredPermission: 'assessments.view' },
      { label: 'Rejected', href: '/assessments?status=REJECTED', requiredPermission: 'assessments.view' },
    ],
  },
  {
    label: 'Loans',
    href: '/loans',
    icon: Landmark,
    module: 'loans',
    section: 'Core Banking',
    requiredPermission: 'loans.view',
    subItems: [
      { label: 'All Loans', href: '/loans', requiredPermission: 'loans.view' },
      { label: 'Active Loans', href: '/loans?status=ACTIVE', requiredPermission: 'loans.view' },
      { label: 'New Loan', href: '/loans/new', requiredPermission: 'loans.create' },
      { label: 'Closed Loans', href: '/loans?status=CLOSED', requiredPermission: 'loans.view' },
    ],
  },
  {
    label: 'Chit Schemes',
    href: '/chits',
    icon: Coins,
    module: 'chits',
    section: 'Core Banking',
    requiredPermission: 'chits.view',
    subItems: [
      { label: 'All Schemes', href: '/chits', requiredPermission: 'chits.view' },
      { label: 'New Scheme', href: '/chits/new', requiredPermission: 'chits.create' },
      { label: 'Subscriptions', href: '/chits/subscriptions', requiredPermission: 'chits.view' },
      { label: 'Chit Collections', href: '/chits/collections', requiredPermission: 'chits.view' },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
    icon: WalletCards,
    module: 'collections',
    section: 'Core Banking',
    requiredPermission: 'collections.view',
    subItems: [
      { label: 'Collection Dashboard', href: '/collections', requiredPermission: 'collections.view' },
      { label: 'Collection Tasks', href: '/collections/tasks', requiredPermission: 'collections.view' },
      { label: 'My Tasks', href: '/collections/my-tasks', requiredPermission: 'collections.view' },
      { label: 'Upcoming Payments', href: '/collections/upcoming', requiredPermission: 'collections.view' },
      { label: 'Overdue Recovery', href: '/collections/recovery', requiredPermission: 'collections.view' },
    ],
  },
  {
    label: 'Approvals',
    href: '/approvals',
    icon: ShieldCheck,
    module: 'approvals',
    section: 'Core Banking',
    requiredPermission: 'approvals.view',
    subItems: [
      { label: 'Pending Approvals', href: '/approvals?status=PENDING', requiredPermission: 'approvals.view' },
      { label: 'Approved Archive', href: '/approvals?status=APPROVED', requiredPermission: 'approvals.view' },
      { label: 'Rejected', href: '/approvals?status=REJECTED', requiredPermission: 'approvals.view' },
    ],
  },
  {
    label: 'Notifications',
    href: '/notifications',
    icon: Bell,
    module: 'notifications',
    section: 'Operations & Audit',
    requiredPermission: 'notifications.view',
  },
  {
    label: 'Reports & Analytics',
    href: '/reports',
    icon: BarChart3,
    module: 'reports',
    section: 'Operations & Audit',
    requiredPermission: 'reports.view',
    subItems: [
      { label: 'Overview', href: '/reports', requiredPermission: 'reports.view' },
      { label: 'Loan Reports', href: '/reports/loans', requiredPermission: 'reports.view' },
      { label: 'Collection Reports', href: '/reports/collections', requiredPermission: 'reports.view' },
      { label: 'Overdue Reports', href: '/reports/overdue', requiredPermission: 'reports.view' },
      { label: 'Staff Performance', href: '/reports/staff', requiredPermission: 'reports.view' },
    ],
  },
  {
    label: 'Audit Trail',
    href: '/audit',
    icon: History,
    module: 'audit',
    section: 'Operations & Audit',
    requiredPermission: 'audit.view',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings2,
    module: 'settings',
    section: 'Administration',
    requiredPermission: 'settings.view',
    subItems: [
      { label: 'Users & Staff', href: '/settings/users', requiredPermission: 'users.view' },
      { label: 'Roles & Privileges', href: '/settings/roles', requiredPermission: 'roles.view' },
      { label: 'Permission Matrix', href: '/settings/permissions', requiredPermission: 'roles.view' },
    ],
  },
];

interface NavGroupProps {
  item: NavItem;
  pathname: string;
  unreadCount: number;
  onClose?: () => void;
  showSectionHeader?: boolean;
  onPrefetch: (href: string) => void;
}

const SidebarNavGroup = React.memo(function SidebarNavGroup({
  item,
  pathname,
  unreadCount,
  onClose,
  showSectionHeader,
  onPrefetch,
}: NavGroupProps) {
  const Icon = item.icon;
  const isParentActive =
    pathname === item.href ||
    (item.module === 'dashboard' && pathname.startsWith('/dashboard')) ||
    (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) ||
    (item.href !== '/dashboard' && pathname.startsWith(item.href + '?'));

  return (
    <div className="space-y-0.5">
      {showSectionHeader && (
        <div className="pt-3 pb-1 px-3 first:pt-1">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase select-none">
            {item.section}
          </p>
        </div>
      )}

      <Link
        href={item.href}
        prefetch={true}
        onMouseEnter={() => onPrefetch(item.href)}
        onTouchStart={() => onPrefetch(item.href)}
        onClick={() => onClose && onClose()}
        className={cn(
          'relative flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all group select-none',
          isParentActive
            ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-950/60 font-semibold'
            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
        )}
      >
        {/* Active Indicator Bar */}
        {isParentActive && (
          <span className="absolute left-0 top-2 bottom-2 w-1 bg-brand-300 rounded-r-full shadow-sm" />
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <Icon
            className={cn(
              'w-[18px] h-[18px] shrink-0 stroke-[1.8] transition-colors',
              isParentActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
            )}
          />
          <span className="tracking-tight truncate">{item.label}</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {item.module === 'notifications' && unreadCount > 0 && (
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0',
                isParentActive ? 'bg-white text-brand-700' : 'bg-rose-500 text-white'
              )}
            >
              {unreadCount}
            </span>
          )}
          {item.badge !== undefined && item.module !== 'notifications' && (
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0',
                isParentActive ? 'bg-white text-brand-700' : 'bg-rose-500 text-white'
              )}
            >
              {item.badge}
            </span>
          )}
          {item.subItems && (
            <ChevronRight
              className={cn(
                'w-4 h-4 text-slate-400 stroke-[2] transition-transform duration-200 shrink-0',
                isParentActive && 'rotate-90 text-white'
              )}
            />
          )}
        </div>
      </Link>

      {/* Sub Menu Links */}
      {item.subItems && isParentActive && (
        <div className="ml-7 pl-3 border-l-2 border-brand-500/30 space-y-1 py-1">
          {item.subItems.map((sub) => {
            const isSubActive = pathname === sub.href;
            return (
              <Link
                key={sub.href}
                href={sub.href}
                prefetch={true}
                onMouseEnter={() => onPrefetch(sub.href)}
                onTouchStart={() => onPrefetch(sub.href)}
                onClick={() => onClose && onClose()}
                className={cn(
                  'block py-1.5 px-3 rounded-lg text-xs sm:text-[13px] font-medium transition-colors',
                  isSubActive
                    ? 'text-brand-300 font-semibold bg-brand-950/60'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                )}
              >
                {sub.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
});

export const Sidebar = React.memo(function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { role, canAccessModule, hasPermission } = usePermissions();
  const { data: notifications = [] } = useNotifications();

  const handlePrefetch = React.useCallback(
    (href: string) => {
      try {
        router.prefetch(href);
        prefetchModuleData(queryClient, href);
      } catch {}
    },
    [router, queryClient]
  );

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const dashboardHref = React.useMemo(() => {
    if (role === 'ADMIN') return '/dashboard/admin';
    if (role === 'MANAGEMENT') return '/dashboard/management';
    return '/dashboard/staff';
  }, [role]);

  // Dynamic Filtering: memoized so route changes do not re-filter all modules/permissions
  const filteredNavItems = React.useMemo(() => {
    return RAW_NAV_ITEMS
      .filter((item) => {
        if (!canAccessModule(item.module)) return false;
        if (item.requiredPermission && !hasPermission(item.requiredPermission)) return false;
        return true;
      })
      .map((item) => {
        const itemHref = item.module === 'dashboard' ? dashboardHref : item.href;
        if (!item.subItems) return { ...item, href: itemHref };
        const allowedSubs = item.subItems.filter((sub) => {
          if (!sub.requiredPermission) return true;
          return hasPermission(sub.requiredPermission);
        });
        return {
          ...item,
          href: itemHref,
          subItems: allowedSubs.length > 0 ? allowedSubs : undefined,
        };
      });
  }, [canAccessModule, hasPermission, dashboardHref]);

  return (
    <>
      {/* Mobile Backdrop with smooth blur */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full h-[100dvh] w-72 shrink-0 flex-col bg-slate-900 dark:bg-[#070b13] text-slate-300 transition-transform duration-300 ease-in-out border-r border-slate-800/90 shadow-2xl',
          'lg:sticky lg:top-0 lg:h-[100dvh] lg:translate-x-0 lg:z-30 lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand / Logo Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-5 bg-slate-900/60 dark:bg-[#070b13]/60 backdrop-blur-xs">
          <Link href={dashboardHref} prefetch={true} className="flex items-center gap-3 group select-none">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600/30 via-slate-800 to-slate-900 p-1.5 ring-1 ring-white/15 shadow-md shadow-purple-950/50 group-hover:ring-brand-500/50 transition-all">
              <Image
                src="/images/loans/chit-loan-logo.png"
                alt="Chit & Loan Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-[15px] tracking-tight block leading-tight">
                  CHIT & LOAN
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              </div>
              <span className="text-[10px] uppercase tracking-wider text-brand-400 font-bold block">
                Fintech Enterprise
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 stroke-[2]" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 space-y-1 scrollbar-none">
          {filteredNavItems.map((item, index) => {
            const showSectionHeader =
              item.section &&
              (index === 0 || filteredNavItems[index - 1]?.section !== item.section);

            return (
              <SidebarNavGroup
                key={item.label}
                item={item}
                pathname={pathname}
                unreadCount={unreadCount}
                onClose={onClose}
                showSectionHeader={Boolean(showSectionHeader)}
                onPrefetch={handlePrefetch}
              />
            );
          })}
        </div>

      </aside>
    </>
  );
});
