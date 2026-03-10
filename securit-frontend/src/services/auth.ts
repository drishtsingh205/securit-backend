import apiClient from './api';
import { LoginCredentials, AuthResponse, User } from '@/types/auth';

const TOKEN_KEY = 'privacylens_token';
const USER_KEY = 'privacylens_user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/login',
      credentials
    );
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

export default authService;
