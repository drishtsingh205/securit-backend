import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.privacylens.io/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('privacylens_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('privacylens_token');
        localStorage.removeItem('privacylens_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
