/**
 * Auth Store — in-memory only (no localStorage / no persist).
 * Holds the current logged-in user and JWT token.
 * Token is also kept in module-level memory so the http client can read it.
 */
import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  setAuth: (user, token) => {
    // Keep token in module memory for http interceptor
    authToken = token;
    set({ user, token });
  },

  clearAuth: () => {
    authToken = null;
    set({ user: null, token: null });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));

// Module-level token reference — read by http client without localStorage
export let authToken: string | null = null;

export function getInMemoryToken(): string | null {
  return authToken;
}
