'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    couponCode,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
    getTotalItems,
  } = useCartStore();

  const addToast = useUIStore((state) => state.addToast);
  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();
  const totalItems = getTotalItems();

  const freeShippingThreshold = 5000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;

    const res = applyCoupon(inputCoupon);
    if (res.success) {
      addToast(res.message, 'success');
      setInputCoupon('');
    } else {
      addToast(res.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark Blur Backdrop */}
      <div
        onClick={closeCart}
        className="fixed inset-0 bg-[#21191A]/70 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      />

      {/* Slide-over Drawer Content */}
      <div className="relative w-full max-w-md bg-[#F6F0E6] text-[#21191A] h-full shadow-2xl flex flex-col justify-between border-l border-[#D7B982]/40 z-50 animate-in slide-in-from-right duration-300">
        {/* ─── 1. DRAWER HEADER ───────────────────────────────────────────── */}
        <div className="p-6 bg-[#4A1724] text-[#F6F0E6] flex items-center justify-between border-b border-[#D7B982]/30 flex-shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#D7B982]/50 flex items-center justify-center text-[#D7B982] text-xs">
              🛍️
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#F6F0E6]">
                Shopping Bag
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-[#D7B982] font-mono">
                {totalItems} {totalItems === 1 ? 'Silhouette' : 'Silhouettes'} Selected
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full bg-[#F6F0E6]/10 hover:bg-[#F6F0E6] text-[#F6F0E6] hover:text-[#4A1724] flex items-center justify-center font-bold transition-all text-xs"
            aria-label="Close Bag"
          >
            ✕
          </button>
        </div>

        {/* ─── 2. FREE SHIPPING PROGRESS BAR ──────────────────────────────── */}
        <div className="bg-[#E8DDCE] p-4 border-b border-[#D7B982]/30 flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            {remainingForFreeShipping > 0 ? (
              <span className="text-[#4A1724] font-serif">
                Add <span className="font-bold">₹ {remainingForFreeShipping.toLocaleString('en-IN')}</span> more for Free Royal Shipping!
              </span>
            ) : (
              <span className="text-emerald-800 font-bold flex items-center gap-1 font-serif">
                <span>✓</span> You've unlocked Complimentary Royal Shipping!
              </span>
            )}
            <span className="text-[10px] text-[#69705A] font-mono font-bold">
              {Math.round(freeShippingPercent)}%
            </span>
          </div>

          <div className="w-full bg-[#F6F0E6] h-2 rounded-full overflow-hidden border border-[#D7B982]/40">
            <div
              className="bg-gradient-to-r from-[#4A1724] to-[#D7B982] h-full transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingPercent}%` }}
            />
          </div>
        </div>

        {/* ─── 3. CART ITEMS LIST (SCROLLABLE) ────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#E8DDCE] border border-[#D7B982] flex items-center justify-center text-3xl text-[#4A1724]">
                👜
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-[#4A1724]">Your Shopping Bag is Empty</h3>
                <p className="text-xs text-[#21191A]/70 font-light max-w-xs mx-auto">
                  Explore our handwoven Banarasi sarees, royal bridal lehengas, and couture Anarkalis to add to your bag.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 rounded-full bg-[#4A1724] text-[#F6F0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-[#E8DDCE]/40 p-3.5 rounded-2xl border border-[#D7B982]/30 shadow-sm relative group hover:border-[#D7B982] transition-all"
              >
                {/* Product Thumbnail Image */}
                <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#E8DDCE] border border-[#D7B982]/30">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>

                {/* Info & Quantity Stepper */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif text-xs font-bold text-[#4A1724] truncate">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        addToast(`Removed "${item.name}"`, 'info');
                      }}
                      className="text-xs text-[#21191A]/40 hover:text-rose-700 transition-colors p-1"
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-[#69705A] font-mono">
                    {item.size && <span className="bg-[#D7B982]/30 text-[#4A1724] px-2 py-0.5 rounded font-bold uppercase">Size: {item.size}</span>}
                    {item.color && <span>• Color: {item.color}</span>}
                  </div>

                  <p className="text-xs font-bold text-[#4A1724]">
                    ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>

                  {/* Quantity Counter Stepper */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center border border-[#D7B982]/60 rounded-lg bg-[#F6F0E6] px-2 py-0.5 gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-xs font-bold text-[#4A1724] hover:scale-110 transition-transform"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#21191A] font-mono px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-xs font-bold text-[#4A1724] hover:scale-110 transition-transform"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ─── 4. COUPON & ORDER BREAKDOWN FOOTER ─────────────────────────── */}
        {items.length > 0 && (
          <div className="p-6 bg-[#E8DDCE]/70 border-t border-[#D7B982]/40 space-y-4 flex-shrink-0">
            {/* Coupon Code Input */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between bg-[#F6F0E6] p-2.5 rounded-xl border border-emerald-600/40 text-xs text-emerald-800 font-bold">
                  <span className="flex items-center gap-1.5">
                    <span>🎟️</span>
                    <span>COUPON {couponCode} APPLIED</span>
                  </span>
                  <button
                    onClick={() => {
                      removeCoupon();
                      addToast('Coupon removed', 'info');
                    }}
                    className="text-xs text-rose-700 hover:underline uppercase"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="Coupon code (e.g. ROYAL20)"
                    className="flex-1 px-4 py-2 rounded-xl bg-[#F6F0E6] border border-[#D7B982]/60 text-xs text-[#21191A] placeholder-[#21191A]/50 focus:outline-none focus:border-[#4A1724] uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#4A1724] text-[#F6F0E6] text-xs font-bold uppercase tracking-wider hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow"
                  >
                    APPLY
                  </button>
                </form>
              )}
            </div>

            {/* Price Summary Breakdown */}
            <div className="space-y-1.5 text-xs text-[#21191A]/80 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">₹ {subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Promo Discount ({couponCode})</span>
                  <span className="font-mono">- ₹ {discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono font-bold">
                  {shipping === 0 ? <span className="text-emerald-800">COMPLIMENTARY</span> : `₹ ${shipping}`}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-[#D7B982]/40 text-sm font-bold text-[#4A1724]">
                <span>Total Amount</span>
                <span className="font-mono text-base">₹ {total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3.5 rounded-full bg-[#4A1724] text-[#F6F0E6] text-center font-bold text-xs uppercase tracking-widest hover:bg-[#331019] transition-all shadow-xl block flex items-center justify-center gap-2 border border-[#D7B982]/40"
            >
              <span>PROCEED TO CHECKOUT • ₹ {total.toLocaleString('en-IN')}</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
