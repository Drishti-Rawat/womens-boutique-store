'use client';

import { useState } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

export function LoginModal() {
  const activeModal = useUIStore((state) => state.activeModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const openModal = useUIStore((state) => state.openModal);
  const addToast = useUIStore((state) => state.addToast);

  const setAuth = useAuthStore((state) => state.setAuth);

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
      addToast(`Welcome back, ${res.user.name}!`, 'success');
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
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-500/30 rounded-2xl p-8 shadow-2xl text-stone-100">
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-5 right-5 text-stone-400 hover:text-amber-400 text-xl transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-1">
            Roopkala Royale
          </p>
          <h2 className="text-2xl font-serif text-amber-200">Sign In to Your Account</h2>
          <p className="text-xs text-stone-400 mt-1">
            Access your exclusive boutique wishlist and bespoke orders.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-600/40 text-rose-300 text-xs text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya@example.com"
              className="w-full px-4 py-3 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold tracking-wide text-sm transition-all duration-200 shadow-lg shadow-amber-900/30 disabled:opacity-50"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs text-stone-400 border-t border-stone-800 pt-4">
          Don&apos;t have a Royale account?{' '}
          <button
            onClick={() => openModal('register')}
            className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 ml-1"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}
