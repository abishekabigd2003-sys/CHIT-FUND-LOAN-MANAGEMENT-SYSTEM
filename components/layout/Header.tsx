'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Menu, Search, LogOut, User as UserIcon, Building2, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { RoleSwitcher } from './RoleSwitcher';
import { NotificationDropdown } from './NotificationDropdown';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const GlobalSearchModal = dynamic(
  () => import('@/components/layout/GlobalSearchModal').then((mod) => mod.GlobalSearchModal),
  { ssr: false }
);

export const Header = React.memo(function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Auto-close profile dropdown on click outside or escape key
  useEffect(() => {
    if (!showProfileMenu) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        profileMenuRef.current &&
        event.target instanceof Node &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [showProfileMenu]);

  // Global Ctrl+K / Cmd+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#090d16]/85 px-3 sm:px-6 backdrop-blur-xl transition-colors duration-150">
        {/* Left Side: Mobile Menu Button & Search Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xs sm:max-w-sm md:max-w-md">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors shrink-0 cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Global Search Command Bar */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all text-xs sm:text-sm text-left shadow-2xs cursor-pointer min-h-[38px] group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 shrink-0 stroke-[2] transition-colors" />
              <span className="font-medium text-slate-500 dark:text-slate-400 truncate hidden sm:inline">
                Search customers, loans, chits...
              </span>
              <span className="font-medium text-slate-500 dark:text-slate-400 truncate sm:hidden">
                Search...
              </span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs shrink-0 ml-2">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Side: Role Switcher, Notification Dropdown, Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
          {/* Role Switcher */}
          <RoleSwitcher />

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* User Profile */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-2 sm:gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left group cursor-pointer min-h-[38px]"
              aria-label="User profile menu"
              aria-expanded={showProfileMenu}
              aria-haspopup="true"
            >
              <div className="relative shrink-0">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200/80 dark:ring-slate-700 shadow-2xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                {/* Active indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              <div className="hidden md:block">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none mt-1 font-medium">
                  {user?.branch || 'Corporate HQ'}
                </p>
              </div>

              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 hidden sm:block stroke-[2] transition-transform duration-200',
                  showProfileMenu && 'rotate-180'
                )}
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl z-40 p-2 animate-in fade-in-0 zoom-in-95">
                <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">{user?.email}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 stroke-[1.8]" />
                    <span>{user?.branch || 'Corporate HQ'}</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/settings"
                    prefetch={true}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400 stroke-[1.8]" />
                    <span>Account Settings</span>
                  </Link>
                </div>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                {/* Dark / Light / System Mode Toggle inside Profile Menu */}
                <ThemeToggle variant="menu" />

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 stroke-[1.8]" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {isSearchOpen && (
        <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
});
