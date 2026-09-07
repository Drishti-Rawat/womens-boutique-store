'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { authService } from '@/services/authService';

/**
 * AuthProvider — mounts at the root layout.
 * On mount:
 *   1. Validates the HTTP-only session cookie via /api/auth/me
 *   2. If logged in → fetches cart AND wishlist from PostgreSQL DB
 * On logout event: clears auth, cart, and wishlist state.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, setLoading } = useAuthStore();
  const { addToast } = useUIStore();
  const { fetchCartFromDB, clearCart } = useCartStore();
  const { fetchWishlist, clearWishlist } = useWishlistStore();

  useEffect(() => {
    // Handle global unauthorized events from http interceptors
    const handleUnauthorized = () => {
      clearAuth();
      clearCart();
      clearWishlist();
      addToast('Session expired. Please sign in again.', 'error');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    // Restore session on page load / refresh
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const data = await authService.me();
        if (data.user) {
          setAuth(data.user, data.token || '');

          // ── Fetch persistent data from DB in parallel ──────────────────
          await Promise.all([
            fetchCartFromDB(),   // Restore cart items from PostgreSQL
            fetchWishlist(),     // Restore wishlist items from PostgreSQL
          ]);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [setAuth, clearAuth, setLoading, addToast, fetchCartFromDB, clearCart, fetchWishlist, clearWishlist]);

  return <>{children}</>;
}
