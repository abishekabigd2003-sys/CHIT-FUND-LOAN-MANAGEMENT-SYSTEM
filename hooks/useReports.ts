import { useQuery } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';
import { dashboardService } from '@/services/dashboard.service';
import { ReportFilter } from '@/types/report';

export function useCollectionReport(filter?: ReportFilter) {
  return useQuery({
    queryKey: ['report-collections', filter],
    queryFn: () => reportService.getCollectionReport(filter),
  });
}

export function useDueReport(filter?: ReportFilter) {
  return useQuery({
    queryKey: ['report-dues', filter],
    queryFn: () => reportService.getDueReport(filter),
  });
}

export function useCustomerReport(filter?: ReportFilter) {
  return useQuery({
    queryKey: ['report-customers', filter],
    queryFn: () => reportService.getCustomerReport(filter),
  });
}

export function useChitPerformanceReport(filter?: ReportFilter) {
  return useQuery({
    queryKey: ['report-chit-perf', filter],
    queryFn: () => reportService.getChitPerformanceReport(filter),
  });
}

export function useLoanPerformanceReport(filter?: ReportFilter) {
  return useQuery({
    queryKey: ['report-loan-perf', filter],
    queryFn: () => reportService.getLoanPerformanceReport(filter),
  });
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardService.getDashboardSummary(),
  });
}
