import apiClient from './api';
import type { Alert } from '@/types/alerts';

export const alertsService = {
  async getAll(severity?: string): Promise<Alert[]> {
    const params = severity ? { severity } : {};
    const { data } = await apiClient.get<Alert[]>('/alerts', { params });
    return data;
  },

  async dismiss(id: string): Promise<void> {
    await apiClient.patch(`/alerts/${id}/dismiss`);
  },

  async getCount(): Promise<{ total: number; critical: number }> {
    const { data } = await apiClient.get('/alerts/count');
    return data;
  },
};

export default alertsService;
