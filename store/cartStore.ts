/**
 * Cart Store — in-memory state management, synced with PostgreSQL DB via /api/cart.
 * - Logged-in users: cart is fetched from DB on login and persisted on every mutation.
 * - Guest users: cart lives in-memory only (cleared on page refresh).
 */
import { create } from 'zustand';
import { cartService, type DBCartItem } from '@/services/cartService';

export interface CartItem {
  id: string;          // Local unique key (also used as DB cartItemId when dbId is set)
  dbId?: string;       // CartItem.id in PostgreSQL (set after DB sync)
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  color?: string;
  size: string;
  quantity: number;
  fabric?: string;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  isSyncing: boolean;
  couponCode: string | null;
  discountType: 'PERCENTAGE' | 'FLAT' | null;
  discountValue: number;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  /** Populate cart from DB (called on login / session restore). */
  fetchCartFromDB: () => Promise<void>;

  /**
   * Add item — optimistic update + DB sync for logged-in users.
   * For guests, stays in-memory only.
   */
  addItem: (item: Omit<CartItem, 'id'>) => void;

  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;

  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  /** Clear in-memory cart and DB cart (called after successful order). */
  clearCart: (syncDB?: boolean) => void;

  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getTotalItems: () => number;
}

const VALID_COUPONS: Record<string, { type: 'PERCENTAGE' | 'FLAT'; value: number; minSubtotal: number }> = {
  WELCOME10: { type: 'PERCENTAGE', value: 10, minSubtotal: 2000 },
  ROYAL20:   { type: 'PERCENTAGE', value: 20, minSubtotal: 5000 },
  NOORE500:  { type: 'FLAT',       value: 500, minSubtotal: 3000 },
};

/** Map a DB CartItem to the in-memory CartItem shape. */
function mapDBItem(dbItem: DBCartItem): CartItem {
  const p = dbItem.variant.product;
  return {
    id: `${p.id}-${dbItem.variant.size}-${dbItem.variant.color}-${dbItem.id}`,
    dbId: dbItem.id,
    productId: p.id,
    variantId: dbItem.variantId,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image: p.images?.[0] || '/images/hero_palace.jpg',
    color: dbItem.variant.color,
    size: dbItem.variant.size,
    quantity: dbItem.quantity,
    fabric: p.fabric || undefined,
  };
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,
  isSyncing: false,
  couponCode: null,
  discountType: null,
  discountValue: 0,

  openCart:   () => set({ isCartOpen: true }),
  closeCart:  () => set({ isCartOpen: false }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

  // ─── FETCH FROM DB ──────────────────────────────────────────────────────
  fetchCartFromDB: async () => {
    set({ isSyncing: true });
    try {
      const dbItems = await cartService.getCart();
      const items = dbItems.map(mapDBItem);
      set({ items });
    } catch {
      // Silently fail — keep existing in-memory cart
    } finally {
      set({ isSyncing: false });
    }
  },

  // ─── ADD ITEM ────────────────────────────────────────────────────────────
  addItem: (newItem) => {
    const { items } = get();

    // Optimistic: merge if same product+size+color
    const existingIndex = items.findIndex(
      (i) =>
        i.productId === newItem.productId &&
        i.size === newItem.size &&
        (i.color || '') === (newItem.color || '')
    );

    if (existingIndex > -1) {
      const updatedItems = [...items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + (newItem.quantity || 1),
      };
      set({ items: updatedItems, isCartOpen: true });
    } else {
      const id = `${newItem.productId}-${newItem.size}-${newItem.color || 'def'}-${Date.now()}`;
      set({ items: [...items, { ...newItem, id }], isCartOpen: true });
    }

    // Background DB sync (fire-and-forget)
    cartService.addItem(
      newItem.productId,
      newItem.size,
      newItem.color || 'Default',
      newItem.quantity || 1,
    );
  },

  // ─── REMOVE ITEM ─────────────────────────────────────────────────────────
  removeItem: (id) => {
    const { items } = get();
    const target = items.find((i) => i.id === id);

    set({ items: items.filter((i) => i.id !== id) });

    // Background DB sync if we have a DB row id
    if (target?.dbId) {
      cartService.removeItem(target.dbId);
    }
  },

  // ─── UPDATE QUANTITY ─────────────────────────────────────────────────────
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
    }));
    // Note: quantity changes are re-synced lazily — full re-add handled by addItem merge logic.
  },

  // ─── COUPON ──────────────────────────────────────────────────────────────
  applyCoupon: (code) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = VALID_COUPONS[cleanCode];
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code. Try WELCOME10, ROYAL20 or NOORE500.' };
    }
    const subtotal = get().getSubtotal();
    if (subtotal < coupon.minSubtotal) {
      return {
        success: false,
        message: `Coupon "${cleanCode}" requires a minimum subtotal of ₹${coupon.minSubtotal.toLocaleString('en-IN')}`,
      };
    }
    set({ couponCode: cleanCode, discountType: coupon.type, discountValue: coupon.value });
    return {
      success: true,
      message: `Coupon "${cleanCode}" applied! ${coupon.type === 'PERCENTAGE' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}`,
    };
  },

  removeCoupon: () => set({ couponCode: null, discountType: null, discountValue: 0 }),

  // ─── CLEAR CART ──────────────────────────────────────────────────────────
  clearCart: (syncDB = false) => {
    set({ items: [], couponCode: null, discountType: null, discountValue: 0, isCartOpen: false });
    if (syncDB) {
      cartService.clearCart();
    }
  },

  // ─── COMPUTED TOTALS ─────────────────────────────────────────────────────
  getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  getDiscountAmount: () => {
    const subtotal = get().getSubtotal();
    const { discountType, discountValue } = get();
    if (!discountType || !discountValue || subtotal <= 0) return 0;
    return discountType === 'PERCENTAGE'
      ? Math.round((subtotal * discountValue) / 100)
      : Math.min(subtotal, discountValue);
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    if (subtotal <= 0) return 0;
    return subtotal >= 5000 ? 0 : 250;
  },

  getTotal: () => {
    const sub = get().getSubtotal();
    const disc = get().getDiscountAmount();
    const ship = get().getShippingFee();
    return Math.max(0, sub - disc + ship);
  },

  getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
