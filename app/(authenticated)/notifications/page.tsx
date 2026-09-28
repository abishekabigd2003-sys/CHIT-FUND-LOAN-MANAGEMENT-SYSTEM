'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  AlertCircle,
  Calendar,
  FileText,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from '@/hooks/useNotifications';
import { NotificationItem, NotificationType } from '@/types/notification';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NotificationsCenterPage() {
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();

  const filtered = notifications.filter((n) => {
    if (filterType !== 'ALL' && n.type !== filterType) return false;
    if (filterStatus === 'UNREAD' && n.isRead) return false;
    if (filterStatus === 'READ' && !n.isRead) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'OVERDUE_ALERT':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'CHIT_AUCTION':
      case 'UPCOMING_PAYMENT':
      case 'DUE_DATE':
        return <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />;
      case 'KYC_PENDING':
        return <FileText className="w-5 h-5 text-amber-600" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-purple-600" />;
    }
  };

  const getPriorityBadge = (priority: NotificationItem['priority']) => {
    switch (priority) {
      case 'HIGH':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">Medium</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            System Notification Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational alerts, upcoming EMI collections, auction notices, and KYC review requests.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsRead.mutate()}
            className="gap-1.5 text-xs bg-white"
          >
            <CheckCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Mark All As Read</span>
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="w-44">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { label: 'All Alerts', value: 'ALL' },
                { label: 'Overdue Dues', value: 'OVERDUE_ALERT' },
                { label: 'Chit Auctions', value: 'CHIT_AUCTION' },
                { label: 'Upcoming Payments', value: 'UPCOMING_PAYMENT' },
                { label: 'KYC Verification', value: 'KYC_PENDING' },
                { label: 'System Audit', value: 'SYSTEM' },
              ]}
              className="h-9 text-xs py-1"
            />
          </div>

          <div className="w-36">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { label: 'All States', value: 'ALL' },
                { label: 'Unread Only', value: 'UNREAD' },
                { label: 'Read Only', value: 'READ' },
              ]}
              className="h-9 text-xs py-1"
            />
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Showing {filtered.length} of {notifications.length} alerts
        </div>
      </div>

      {/* Notification Stream */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All Caught Up!"
          description="There are no notifications matching your current filters."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className={`p-4 transition-all hover:shadow-xs ${
                !item.isRead ? 'border-brand-200 dark:border-brand-900/60 bg-brand-50/20 dark:bg-brand-950/20' : 'border-slate-200/80 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.title}</h3>
                      {getPriorityBadge(item.priority)}
                      {!item.isRead && (
                        <span className="text-[10px] bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 px-1.5 py-0.5 rounded font-semibold">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 max-w-2xl">{item.message}</p>
                    <p className="text-[11px] text-slate-400 pt-1">
                      Received: {formatDate(item.createdAt, 'dd MMM yyyy, hh:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.link && (
                    <Link href={item.link}>
                      <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900">
                        <span>View Context</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  )}

                  {!item.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead.mutate(item.id)}
                      className="h-8 px-2 text-xs text-slate-500 hover:text-slate-800"
                    >
                      Dismiss
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
