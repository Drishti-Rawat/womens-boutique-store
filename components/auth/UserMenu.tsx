'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { authService } from '@/services/authService';
import Link from 'next/link';

export function UserMenu() {
  const { user, isLoading, clearAuth } = useAuthStore();
  const { openModal, addToast } = useUIStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      clearAuth();
      setIsOpen(false);
      addToast('Signed out successfully.', 'info');
    }
  };

  if (isLoading) {
    return (
      <div className="h-9 w-24 bg-stone-800 animate-pulse rounded-full border border-stone-700" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => openModal('login')}
          className="text-xs uppercase tracking-wider text-amber-200 hover:text-amber-400 font-medium transition-colors py-2 px-3"
        >
          Sign In
        </button>
        <button
          onClick={() => openModal('register')}
          className="text-xs uppercase tracking-wider bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold px-4 py-2 rounded-full transition-all shadow-md shadow-amber-900/20"
        >
          Join Privilege
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-900 border border-amber-500/30 hover:border-amber-400/60 transition-all text-amber-200"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-700 to-yellow-500 flex items-center justify-center text-stone-950 font-bold text-xs uppercase shadow">
          {user.name.charAt(0)}
        </div>
        <span className="text-xs font-medium tracking-wide max-w-[100px] truncate">
          {user.name}
        </span>
        {user.role === 'ADMIN' && (
          <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30 uppercase">
            Admin
          </span>
        )}
        <span className="text-stone-400 text-xs">▾</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-stone-900 border border-amber-500/30 shadow-2xl p-2 z-50 text-stone-200 text-xs animate-fade-in backdrop-blur-lg">
          <div className="px-3 py-2 border-b border-stone-800">
            <p className="font-semibold text-amber-200 truncate">{user.name}</p>
            <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
          </div>

          <div className="py-1">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-800 text-amber-300 font-medium transition-colors"
              >
                ⚙️ Admin Dashboard
              </Link>
            )}

            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors text-stone-300"
            >
              📦 My Orders
            </Link>
          </div>

          <div className="border-t border-stone-800 pt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-300 transition-colors"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
