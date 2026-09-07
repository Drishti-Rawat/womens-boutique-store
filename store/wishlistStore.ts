/**
 * Wishlist Store — Syncs in-memory state with backend PostgreSQL database via /api/wishlist.
 * Enforces user authentication before allowing wishlisting.
 */
import { create } from 'zustand';
import type { Product, User } from '@/types';
import type { ModalType } from '@/store/uiStore';
import { wishlistService } from '@/services/wishlistService';

interface WishlistState {
  items: Product[];
  isLoading: boolean;

  fetchWishlist: () => Promise<void>;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleWishlist: (
    product: Product,
    user: User | null,
    openModal: (modal: ModalType) => void,
    addToast: (message: string, type?: 'success' | 'error' | 'info') => void
  ) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await wishlistService.getWishlist();
      set({ items, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: (product) => {
    const { items } = get();
    if (!items.some((i) => i.id === product.id)) {
      set({ items: [...items, product] });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((i) => i.id !== productId) });
  },

  toggleWishlist: async (product, user, openModal, addToast) => {
    // 1. Strict Authentication Check
    if (!user) {
      addToast('Please sign in to save items to your wishlist', 'info');
      openModal('login');
      return false;
    }

    const { items, addItem, removeItem } = get();
    const exists = items.some((i) => i.id === product.id);

    if (exists) {
      // Optimistic update
      removeItem(product.id);
      addToast(`Removed "${product.name}" from your wishlist`, 'info');
      await wishlistService.removeFromWishlist(product.id);
      return false;
    } else {
      // Optimistic update
      addItem(product);
      addToast(`Saved "${product.name}" to your wishlist ♡`, 'success');
      await wishlistService.addToWishlist(product.id);
      return true;
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((i) => i.id === productId);
  },

  clearWishlist: () => set({ items: [] }),
}));
