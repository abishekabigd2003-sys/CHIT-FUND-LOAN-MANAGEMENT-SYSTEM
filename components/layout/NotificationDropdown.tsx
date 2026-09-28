'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, ExternalLink, AlertCircle, Calendar, ShieldAlert, FileText } from 'lucide-react';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks/useNotifications';
import { NotificationItem } from '@/types/notification';
import { cn } from '@/lib/utils';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications = [] } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'OVERDUE_ALERT':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'CHIT_AUCTION':
      case 'UPCOMING_PAYMENT':
      case 'DUE_DATE':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'KYC_PENDING':
        return <FileText className="w-4 h-4 text-amber-500" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5 stroke-[1.8]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xl z-40 overflow-hidden animate-in fade-in-0 zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-[#0d1527]/75">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full border border-rose-200/50 dark:border-rose-800/50">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead.mutate()}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4 stroke-[2]" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">No notifications found</div>
              ) : (
                notifications.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!item.isRead) markAsRead.mutate(item.id);
                    }}
                    className={cn(
                      'p-4 flex items-start gap-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer',
                      !item.isRead && 'bg-brand-50/40 dark:bg-brand-950/30'
                    )}
                  >
                    <div className="mt-0.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={cn('text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate', !item.isRead ? 'font-bold' : 'font-medium')}>
                          {item.title}
                        </p>
                        {!item.isRead && <span className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0d1527]/50 text-center">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 inline-flex items-center gap-1.5"
              >
                <span>View all notifications</span>
                <ExternalLink className="w-3.5 h-3.5 stroke-[2]" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
