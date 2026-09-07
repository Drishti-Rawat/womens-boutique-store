/**
 * Auth Service — all auth API calls go through here.
 * Components should never call fetch directly.
 */
import { http } from './http';
import type { User } from '@/types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export const authService = {
  register: (payload: RegisterPayload) =>
    http.post<AuthResponse>('/api/auth/register', payload, { skipAuth: true }),

  login: (payload: LoginPayload) =>
    http.post<AuthResponse>('/api/auth/login', payload, { skipAuth: true }),

  logout: () => http.post<{ message: string }>('/api/auth/logout'),

  me: () => http.get<{ user: User; token: string }>('/api/auth/me'),
};
