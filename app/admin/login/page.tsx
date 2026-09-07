'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const addToast = useUIStore((state) => state.addToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Calls dedicated Admin Login endpoint /api/admin/auth/login
      const res = await authService.adminLogin({ email, password });

      if (res.user.role !== 'ADMIN') {
        await authService.logout().catch(() => {});
        clearAuth();
        const forbiddenMsg = 'Access Denied: Customer accounts are not authorized for the Admin Portal.';
        setError(forbiddenMsg);
        addToast(forbiddenMsg, 'error');
        return;
      }

      setAuth(res.user, res.token);
      addToast(`Welcome to Admin Suite, ${res.user.name}`, 'success');
      router.push('/admin');
    } catch (err: any) {
      const msg = err?.error || 'Invalid admin credentials.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Royal Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-700/20 to-rose-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-stone-900/90 border border-amber-500/30 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-3">
            🔐 Secure Admin Portal
          </div>
          <h1 className="text-2xl font-serif text-amber-200 font-bold tracking-wide">
            ROOPKALA ROYALE
          </h1>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest font-medium">
            Management &amp; Store Operations
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-600/40 text-rose-200 text-xs font-medium text-center">
            {error}
          </div>
        )}

        {/* Form: Admin Login */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-stone-300 mb-1 font-medium">
              Administrator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@roopkalaroyale.com"
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
            className="w-full py-3.5 mt-2 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold tracking-widest text-xs uppercase transition-all shadow-xl shadow-amber-950/40 disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating Admin...' : 'Sign In as Administrator'}
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-6 p-3 rounded-lg bg-stone-950 border border-stone-800 text-[11px] text-stone-400 space-y-1">
          <p className="text-amber-400/90 font-semibold flex items-center gap-1">
            🛡️ Production Security Isolation
          </p>
          <p>
            Admin authentication is routed via dedicated endpoint <code className="text-amber-300">/api/admin/auth/login</code>. Public self-registration for Admin accounts is strictly disabled.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-800 text-center">
          <Link
            href="/"
            className="text-xs text-stone-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-1"
          >
            ← Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
