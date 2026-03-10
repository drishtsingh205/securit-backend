import apiClient from './api';
import type { MonitoredApp, AppDetail } from '@/types/apps';

export const appsService = {
  async getAll(): Promise<MonitoredApp[]> {
    const { data } = await apiClient.get<MonitoredApp[]>('/apps');
    return data;
  },

  async getByPackage(packageName: string): Promise<AppDetail> {
    const { data } = await apiClient.get<AppDetail>(`/apps/${packageName}`);
    return data;
  },
};

export default appsService;
