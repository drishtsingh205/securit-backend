import apiClient from './api';
import type { DashboardStats, TrafficDataPoint } from '@/types/dashboard';

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<DashboardStats>('/dashboard/stats');
    return data;
  },

  async getTrafficData(
    timeRange: string = '24h'
  ): Promise<TrafficDataPoint[]> {
    const { data } = await apiClient.get<TrafficDataPoint[]>(
      `/dashboard/traffic?range=${timeRange}`
    );
    return data;
  },
};

export default dashboardService;
