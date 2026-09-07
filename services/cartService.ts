/**
 * cartService — HTTP client for /api/cart (PostgreSQL DB).
 * Called by cartStore to keep the in-memory cart in sync with the backend.
 */
import { getInMemoryToken } from '@/store/authStore';

function authHeaders() {
  const token = getInMemoryToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface DBCartItem {
  id: string;           // CartItem.id
  variantId: string;
  quantity: number;
  variant: {
    id: string;
    sku: string;
    color: string;
    size: string;
    stock: number;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      salePrice?: number | null;
      images: string[];
      fabric?: string | null;
    };
  };
}

export const cartService = {
  /** Fetch the full cart from DB and return mapped items. */
  async getCart(): Promise<DBCartItem[]> {
    const token = getInMemoryToken();
    if (!token) return [];
    try {
      const res = await fetch('/api/cart', {
        method: 'GET',
        headers: authHeaders(),
        cache: 'no-store',
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.cart?.items || [];
    } catch {
      return [];
    }
  },

  /** Add / increment item in DB cart. */
  async addItem(productId: string, size: string, color: string, quantity: number): Promise<boolean> {
    const token = getInMemoryToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ productId, size, color, quantity }),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /** Remove a single CartItem from DB by cartItemId. */
  async removeItem(cartItemId: string): Promise<boolean> {
    const token = getInMemoryToken();
    if (!token) return false;
    try {
      const res = await fetch(`/api/cart?cartItemId=${cartItemId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /** Clear ALL items from the DB cart (used after order placement). */
  async clearCart(): Promise<boolean> {
    const token = getInMemoryToken();
    if (!token) return false;
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: authHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
