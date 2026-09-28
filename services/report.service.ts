import apiClient from '@/lib/axios';
import {
  CollectionReportRow,
  DueReportRow,
  CustomerReportRow,
  ChitPerformanceRow,
  LoanPerformanceRow,
  ReportFilter,
} from '@/types/report';
import {
  mockCollectionReportRows,
  mockDueReportRows,
  mockCustomerReportRows,
  mockChitPerformanceRows,
  mockLoanPerformanceRows,
} from './mock-data/reports';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export const reportService = {
  async getCollectionReport(filter?: ReportFilter): Promise<CollectionReportRow[]> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: CollectionReportRow[] }>('/reports/collections', { params: filter });
      return response.data.data;
    }
    let rows = [...mockCollectionReportRows];
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      rows = rows.filter((r) => r.customerName.toLowerCase().includes(q) || r.referenceCode.toLowerCase().includes(q));
    }
    return rows;
  },

  async getDueReport(filter?: ReportFilter): Promise<DueReportRow[]> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: DueReportRow[] }>('/reports/dues', { params: filter });
      return response.data.data;
    }
    let rows = [...mockDueReportRows];
    if (filter?.status && filter.status !== 'ALL') {
      rows = rows.filter((r) => r.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      rows = rows.filter((r) => r.customerName.toLowerCase().includes(q) || r.phone.includes(q));
    }
    return rows;
  },

  async getCustomerReport(filter?: ReportFilter): Promise<CustomerReportRow[]> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: CustomerReportRow[] }>('/reports/customers', { params: filter });
      return response.data.data;
    }
    let rows = [...mockCustomerReportRows];
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q) || r.customerCode.toLowerCase().includes(q));
    }
    return rows;
  },

  async getChitPerformanceReport(filter?: ReportFilter): Promise<ChitPerformanceRow[]> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: ChitPerformanceRow[] }>('/reports/chits', { params: filter });
      return response.data.data;
    }
    return mockChitPerformanceRows;
  },

  async getLoanPerformanceReport(filter?: ReportFilter): Promise<LoanPerformanceRow[]> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: LoanPerformanceRow[] }>('/reports/loans', { params: filter });
      return response.data.data;
    }
    return mockLoanPerformanceRows;
  },

  exportToCSV(filename: string, rows: Record<string, any>[]): void {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).join(',');
    const values = rows.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...values].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
