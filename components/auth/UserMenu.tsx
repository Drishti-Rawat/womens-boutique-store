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
      <div className="h-9 w-24 bg-[#E8DDCE] animate-pulse rounded-full border border-[#D7B982]/30" />
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openModal('login')}
          className="text-xs uppercase tracking-wider text-[#21191A] hover:text-[#4A1724] font-semibold transition-colors py-2 px-3"
        >
          Sign In
        </button>
        <button
          onClick={() => openModal('register')}
          className="text-xs uppercase tracking-wider bg-[#4A1724] hover:bg-[#331019] text-[#F6F0E6] font-bold px-4 py-2 rounded-full transition-all shadow-md shadow-[#4A1724]/20 border border-[#D7B982]/40"
        >
          Join
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E8DDCE] border border-[#D7B982]/50 hover:border-[#4A1724] transition-all text-[#21191A]"
      >
        <div className="w-7 h-7 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold flex items-center justify-center text-xs uppercase shadow">
          {user.name.charAt(0)}
        </div>
        <span className="text-xs font-semibold tracking-wide max-w-[100px] truncate">
          {user.name}
        </span>
        {user.role === 'ADMIN' && (
          <span className="bg-[#4A1724]/10 text-[#4A1724] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#4A1724]/30 uppercase">
            Admin
          </span>
        )}
        <span className="text-[#21191A]/60 text-xs">▾</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#F6F0E6] border border-[#D7B982]/50 shadow-2xl p-2 z-50 text-[#21191A] text-xs animate-fade-in backdrop-blur-lg">
          <div className="px-3 py-2 border-b border-[#D7B982]/30">
            <p className="font-serif font-bold text-[#4A1724] text-sm truncate">{user.name}</p>
            <p className="text-[11px] text-[#21191A]/70 truncate">{user.email}</p>
          </div>

          <div className="py-1">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#E8DDCE] text-[#4A1724] font-bold transition-colors"
              >
                ⚙️ Admin Dashboard
              </Link>
            )}

            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#E8DDCE] transition-colors text-[#21191A]"
            >
              📦 My Orders
            </Link>
          </div>

          <div className="border-t border-[#D7B982]/30 pt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-100 text-rose-800 font-semibold transition-colors"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
