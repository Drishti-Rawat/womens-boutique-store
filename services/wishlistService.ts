import { getInMemoryToken } from '@/store/authStore';
import type { Product } from '@/types';

export const wishlistService = {
  async getWishlist(): Promise<Product[]> {
    const token = getInMemoryToken();
    if (!token) return [];

    const res = await fetch('/api/wishlist', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  },

  async addToWishlist(productId: string): Promise<boolean> {
    const token = getInMemoryToken();
    if (!token) return false;

    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    return res.ok;
  },

  async removeFromWishlist(productId: string): Promise<boolean> {
    const token = getInMemoryToken();
    if (!token) return false;

    const res = await fetch(`/api/wishlist?productId=${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return res.ok;
  },
};
