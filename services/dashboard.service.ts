import apiClient from '@/lib/axios';
import { DashboardData, mockDashboardData } from './mock-data/dashboard';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export const dashboardService = {
  async getDashboardSummary(): Promise<DashboardData> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: DashboardData }>('/dashboard/summary');
      return response.data.data;
    }
    return mockDashboardData;
  },
};
