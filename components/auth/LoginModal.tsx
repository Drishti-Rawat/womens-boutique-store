'use client';

import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { authService } from '@/services/authService';

export function LoginModal() {
  const activeModal = useUIStore((state) => state.activeModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const openModal = useUIStore((state) => state.openModal);
  const addToast = useUIStore((state) => state.addToast);

  const setAuth = useAuthStore((state) => state.setAuth);
  const { fetchCartFromDB } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (activeModal !== 'login') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await authService.login({ email, password });
      setAuth(res.user, res.token);
      // Fetch persistent data from DB after login
      await Promise.all([fetchCartFromDB(), fetchWishlist()]);
      addToast(`Welcome back to NOORÉ, ${res.user.name}!`, 'success');
      closeModal();
      setEmail('');
      setPassword('');
    } catch (err: any) {
      const msg = err?.error || 'Invalid credentials. Please try again.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#F6F0E6] border border-[#D7B982]/50 rounded-2xl p-8 shadow-2xl text-[#21191A]">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-[#21191A]/60 hover:text-[#4A1724] text-xl transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D7B982] font-bold mb-1">
            HOUSE OF INDIAN ELEGANCE
          </p>
          <h2 className="text-3xl font-serif font-bold text-[#4A1724]">Sign In to NOORÉ</h2>
          <p className="text-xs text-[#21191A]/70 mt-1 font-light">
            Access your exclusive boutique wishlist and bespoke orders.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-600/40 text-rose-200 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#21191A] mb-1 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#E8DDCE] border border-[#D7B982]/50 text-[#21191A] placeholder-[#21191A]/40 focus:outline-none focus:border-[#4A1724] transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#21191A] mb-1 font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#E8DDCE] border border-[#D7B982]/50 text-[#21191A] placeholder-[#21191A]/40 focus:outline-none focus:border-[#4A1724] transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 rounded-full bg-[#4A1724] hover:bg-[#331019] text-[#F6F0E6] font-bold tracking-widest text-xs uppercase transition-all duration-200 shadow-xl shadow-[#4A1724]/20 border border-[#D7B982]/40 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-[#21191A]/70 border-t border-[#D7B982]/30 pt-4">
          Don&apos;t have a NOORÉ account?{' '}
          <button
            onClick={() => openModal('register')}
            className="text-[#4A1724] hover:text-[#69705A] font-bold underline underline-offset-4 ml-1"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
