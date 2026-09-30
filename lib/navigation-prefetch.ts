import { QueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import { loanService } from '@/services/loan.service';
import { chitService } from '@/services/chit.service';
import { collectionService } from '@/services/collection.service';
import { approvalService } from '@/services/approval.service';
import { assessmentService } from '@/services/assessment.service';
import { dashboardService } from '@/services/dashboard.service';
import { auditService } from '@/services/audit.service';

/**
 * Pre-warms the React Query cache for a target route or module.
 * This guarantees that when a user switches modules, data is ALREADY in memory,
 * eliminating the loading lag and rendering instantly.
 */
export function prefetchModuleData(queryClient: QueryClient, href: string) {
  try {
    const cleanHref = href.split('?')[0];

    if (cleanHref.startsWith('/customers')) {
      queryClient.prefetchQuery({
        queryKey: ['customers', { search: '', status: 'ALL', page: 1, limit: 10 }],
        queryFn: () => customerService.getCustomers({ search: '', status: 'ALL', page: 1, limit: 10 }),
        staleTime: 1000 * 60 * 5,
      });
    } else if (cleanHref.startsWith('/loans')) {
      queryClient.prefetchQuery({
        queryKey: ['loans', { type: 'ALL', status: 'ALL', search: undefined }],
        queryFn: () => loanService.getLoans({ type: 'ALL', status: 'ALL' }),
        staleTime: 1000 * 60 * 5,
      });
    } else if (cleanHref.startsWith('/chits')) {
      queryClient.prefetchQuery({
        queryKey: ['chits', { status: undefined, search: undefined }],
        queryFn: () => chitService.getChits({ status: undefined, search: undefined }),
        staleTime: 1000 * 60 * 5,
      });
    } else if (cleanHref.startsWith('/collections')) {
      queryClient.prefetchQuery({
        queryKey: ['collection-tasks', undefined],
        queryFn: () => collectionService.getAllTasks(),
        staleTime: 1000 * 60 * 5,
      });
    } else if (cleanHref.startsWith('/approvals')) {
      queryClient.prefetchQuery({
        queryKey: ['approvals', undefined],
        queryFn: () => approvalService.getAllApprovals(),
        staleTime: 1000 * 60 * 5,
      });
    } else if (cleanHref.startsWith('/assessments')) {
      queryClient.prefetchQuery({
        queryKey: ['assessments', undefined],
        queryFn: () => assessmentService.getAllAssessments(),
        staleTime: 1000 * 60 * 5,
      });
    } else if (cleanHref.startsWith('/dashboard')) {
      queryClient.prefetchQuery({
        queryKey: ['dashboard-summary'],
        queryFn: () => dashboardService.getDashboardSummary(),
        staleTime: 1000 * 60 * 5,
      });
      queryClient.prefetchQuery({
        queryKey: ['approvals', 'PENDING'],
        queryFn: () => approvalService.getAllApprovals('PENDING'),
        staleTime: 1000 * 60 * 5,
      });
    } else if (cleanHref.startsWith('/audit')) {
      queryClient.prefetchQuery({
        queryKey: ['audit-logs', { module: undefined, search: '' }],
        queryFn: () => auditService.getLogs({ search: '' }),
        staleTime: 1000 * 60 * 5,
      });
    }
  } catch {
    // Fail-safe: Never block UI execution if background prefetch has an error
  }
}

/**
 * Pre-warms the primary application modules during idle time
 * after the application shell is mounted.
 */
export function prewarmCoreModules(queryClient: QueryClient) {
  const prewarm = () => {
    prefetchModuleData(queryClient, '/customers');
    prefetchModuleData(queryClient, '/loans');
    prefetchModuleData(queryClient, '/chits');
    prefetchModuleData(queryClient, '/collections');
    prefetchModuleData(queryClient, '/approvals');
    prefetchModuleData(queryClient, '/dashboard');
  };

  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prewarm, { timeout: 1500 });
    } else {
      setTimeout(prewarm, 300);
    }
  }
}
