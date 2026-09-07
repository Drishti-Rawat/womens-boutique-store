'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { ProductCard } from '@/components/product/ProductCard';

export default function AccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'wishlist';

  const [activeTab, setActiveTab] = useState<'wishlist' | 'orders' | 'profile'>(
    initialTab === 'orders' ? 'orders' : initialTab === 'profile' ? 'profile' : 'wishlist'
  );

  const { user } = useAuthStore();
  const { openModal, addToast } = useUIStore();
  const { items: wishlistItems, removeItem, fetchWishlist } = useWishlistStore();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'wishlist' || tabParam === 'orders' || tabParam === 'profile') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A] font-sans antialiased selection:bg-[#4A1724] selection:text-[#F6F0E6] py-12 px-6 sm:px-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-[#D7B982] text-xs">
            <span>❀</span>
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#4A1724] font-semibold">
              MY BOUTIQUE SUITE
            </span>
            <span>❀</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#4A1724] tracking-tight">
            Account & <span className="italic text-[#D7B982] font-normal">Wishlist</span>
          </h1>

          {user && (
            <p className="text-xs sm:text-sm text-[#21191A]/70 font-mono">
              Welcome back, <span className="font-bold text-[#4A1724]">{user.name}</span> ({user.email})
            </p>
          )}
        </div>

        {/* ─── UNAUTHENTICATED STATE ─────────────────────────────────────── */}
        {!user ? (
          <div className="bg-[#E8DDCE]/60 rounded-3xl p-10 sm:p-16 border border-[#D7B982]/50 text-center max-w-2xl mx-auto space-y-6 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#4A1724] border-2 border-[#D7B982] flex items-center justify-center text-2xl text-[#D7B982] mx-auto shadow-md">
              ♥
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1724]">
                Sign In to View Your Wishlist
              </h2>
              <p className="text-xs sm:text-sm text-[#21191A]/80 font-light leading-relaxed max-w-md mx-auto">
                Save your favorite royal sarees, velvet lehengas, and couture Anarkalis to access across all your devices.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => openModal('login')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold text-xs uppercase tracking-widest hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow-lg border border-[#D7B982]/40"
              >
                SIGN IN NOW →
              </button>
              <button
                onClick={() => openModal('register')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#F6F0E6] text-[#4A1724] border border-[#D7B982] font-bold text-xs uppercase tracking-widest hover:bg-[#E8DDCE] transition-all"
              >
                CREATE ACCOUNT
              </button>
            </div>
          </div>
        ) : (
          /* ─── AUTHENTICATED ACCOUNT SUITE ───────────────────────────────── */
          <div className="space-y-8">
            {/* Tabs Bar */}
            <div className="flex items-center justify-center gap-3 border-b border-[#D7B982]/40 pb-4 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('wishlist')}
                className={`px-6 py-2.5 rounded-full tracking-wider uppercase transition-all border flex items-center gap-2 ${
                  activeTab === 'wishlist'
                    ? 'bg-[#4A1724] text-[#F6F0E6] border-[#4A1724] shadow'
                    : 'bg-[#E8DDCE]/40 text-[#21191A]/80 border-[#D7B982]/40 hover:bg-[#E8DDCE]'
                }`}
              >
                <span>♥ My Wishlist</span>
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-mono ${
                  activeTab === 'wishlist' ? 'bg-[#D7B982] text-[#4A1724] font-bold' : 'bg-[#D7B982]/30 text-[#4A1724]'
                }`}>
                  {wishlistItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-2.5 rounded-full tracking-wider uppercase transition-all border flex items-center gap-2 ${
                  activeTab === 'orders'
                    ? 'bg-[#4A1724] text-[#F6F0E6] border-[#4A1724] shadow'
                    : 'bg-[#E8DDCE]/40 text-[#21191A]/80 border-[#D7B982]/40 hover:bg-[#E8DDCE]'
                }`}
              >
                <span>📦 My Orders</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-2.5 rounded-full tracking-wider uppercase transition-all border flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'bg-[#4A1724] text-[#F6F0E6] border-[#4A1724] shadow'
                    : 'bg-[#E8DDCE]/40 text-[#21191A]/80 border-[#D7B982]/40 hover:bg-[#E8DDCE]'
                }`}
              >
                <span>👤 Profile</span>
              </button>
            </div>

            {/* TAB CONTENT: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold text-[#4A1724]">
                    Saved Heirlooms ({wishlistItems.length})
                  </h2>
                  {wishlistItems.length > 0 && (
                    <Link
                      href="/catalog"
                      className="text-xs font-bold text-[#4A1724] uppercase tracking-wider underline hover:text-[#D7B982]"
                    >
                      + Explore More Collections
                    </Link>
                  )}
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="bg-[#E8DDCE]/50 rounded-3xl p-12 text-center border border-[#D7B982]/40 space-y-4">
                    <div className="text-4xl text-[#D7B982]">♡</div>
                    <h3 className="font-serif text-xl font-bold text-[#4A1724]">
                      Your Wishlist is Empty
                    </h3>
                    <p className="text-xs text-[#21191A]/70 max-w-sm mx-auto font-light">
                      Browse our handwoven Banarasi sarees, royal bridal lehengas, and couture Anarkalis to save your favorites.
                    </p>
                    <Link
                      href="/catalog"
                      className="inline-block px-8 py-3 rounded-full bg-[#4A1724] text-[#F6F0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow"
                    >
                      EXPLORE CATALOG →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {wishlistItems.map((product) => (
                      <ProductCard key={product.id} product={product} isWishlistPage={true} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-[#E8DDCE]/50 rounded-3xl p-10 border border-[#D7B982]/40 text-center space-y-4">
                <div className="text-4xl text-[#4A1724]">📦</div>
                <h3 className="font-serif text-xl font-bold text-[#4A1724]">My Orders & Bespoke Requests</h3>
                <p className="text-xs text-[#21191A]/70 max-w-md mx-auto font-light">
                  You currently have no active or completed orders. Orders placed online or through our boutique concierges will appear here.
                </p>
                <Link
                  href="/catalog"
                  className="inline-block px-8 py-3 rounded-full bg-[#4A1724] text-[#F6F0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow"
                >
                  START SHOPPING →
                </Link>
              </div>
            )}

            {/* TAB CONTENT: PROFILE */}
            {activeTab === 'profile' && (
              <div className="bg-[#E8DDCE]/50 rounded-3xl p-8 border border-[#D7B982]/40 max-w-xl mx-auto space-y-6">
                <div className="flex items-center gap-4 border-b border-[#D7B982]/30 pb-6">
                  <div className="w-16 h-16 rounded-full bg-[#4A1724] text-[#F6F0E6] font-serif font-bold text-2xl flex items-center justify-center shadow-lg border-2 border-[#D7B982]">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-[#4A1724]">{user.name}</h3>
                    <p className="text-xs text-[#21191A]/70 font-mono">{user.email}</p>
                    <span className="inline-block mt-1 bg-[#4A1724] text-[#D7B982] text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {user.role} MEMBER
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-[#D7B982]/20">
                    <span className="text-[#21191A]/60 font-semibold">Account Status:</span>
                    <span className="font-bold text-emerald-800">✓ Active & Verified</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#D7B982]/20">
                    <span className="text-[#21191A]/60 font-semibold">Saved Wishlist Items:</span>
                    <span className="font-bold text-[#4A1724] font-mono">{wishlistItems.length} Products</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#D7B982]/20">
                    <span className="text-[#21191A]/60 font-semibold">Preferred Currency:</span>
                    <span className="font-bold text-[#21191A]">INR (₹)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
