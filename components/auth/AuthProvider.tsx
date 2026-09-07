'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { authService } from '@/services/authService';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  const addToast = useUIStore((state) => state.addToast);

  useEffect(() => {
    // 1. Listen for unauthorized response event from http interceptor
    const handleUnauthorized = () => {
      clearAuth();
      addToast('Session expired. Please log in again.', 'error');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    // 2. Restore session on initial load from HTTP-only cookie
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const data = await authService.me();
        if (data.user) {
          setAuth(data.user, data.token || '');
        } else {
          clearAuth();
        }
      } catch {
        // Not logged in or invalid token
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [setAuth, clearAuth, setLoading, addToast]);

  return <>{children}</>;
}
