import apiClient from './api';
import type { Report } from '@/types/reports';

export const reportsService = {
  async getAll(): Promise<Report[]> {
    const { data } = await apiClient.get<Report[]>('/reports');
    return data;
  },

  async generate(type: string): Promise<Report> {
    const { data } = await apiClient.post<Report>('/reports/generate', {
      type,
    });
    return data;
  },

  async download(id: string): Promise<Blob> {
    const { data } = await apiClient.get(`/reports/${id}/download`, {
      responseType: 'blob',
    });
    return data;
  },
};

export default reportsService;
