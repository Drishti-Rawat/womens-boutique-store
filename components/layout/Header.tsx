'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserMenu } from '@/components/auth/UserMenu';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';

export function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openModal, addToast } = useUIStore();
  const { user } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const { openCart, getTotalItems, isSyncing } = useCartStore();

  const totalBagItems = getTotalItems();

  const handleWishlistClick = () => {
    if (!user) {
      addToast('Please sign in to view your wishlist', 'info');
      openModal('login');
    } else {
      router.push('/account?tab=wishlist');
    }
  };

  return (
    <>
      {/* Top Announcement Bar - Deep Burgundy #4A1724 */}
      <div className="w-full bg-[#4A1724] text-[#D7B982] text-[11px] font-medium tracking-widest py-2 px-2 sm:px-6 uppercase border-b border-[#D7B982]/20 flex items-center justify-center sm:justify-between text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 text-[8px] sm:text-[10px]">
          <span>COMPLIMENTARY SHIPPING ON ORDERS ABOVE ₹5,000</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">EASY RETURNS</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">CRAFTED IN INDIA</span>
        </div>
        <span className="hidden md:inline text-[10px] text-[#D7B982]/80 tracking-widest">
          A MORE BEAUTIFUL TOMORROW
        </span>
      </div>

      {/* Main Header - Antique Ivory #F6F0E6 */}
      <header className="sticky top-0 z-40 w-full bg-[#F6F0E6]/95 backdrop-blur-md border-b border-[#D7B982]/30 text-[#21191A] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-[0.2em] font-medium text-[#21191A]/80">
            {/* COLLECTIONS Mega Menu Dropdown */}
            <div className="relative group py-2">
              <Link href="/catalog" className="hover:text-[#4A1724] transition-colors flex items-center gap-1">
                <span>COLLECTIONS</span>
                <span className="text-[9px]">▼</span>
              </Link>

              {/* Dropdown Card */}
              <div className="absolute top-full left-0 hidden group-hover:block w-[600px] bg-[#F6F0E6] text-[#21191A] p-6 rounded-2xl shadow-2xl border border-[#D7B982]/40 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-3 gap-6 text-xs">
                  {/* Col 1 */}
                  <div className="space-y-3">
                    <p className="font-serif font-bold text-[#4A1724] uppercase tracking-wider text-[10px] border-b border-[#D7B982]/30 pb-1.5">
                      BY CATEGORY
                    </p>
                    <ul className="space-y-2 text-[#21191A]/80 font-medium">
                      <li><Link href="/catalog?category=sarees" className="hover:text-[#4A1724] hover:underline transition-colors block">Heritage Sarees</Link></li>
                      <li><Link href="/catalog?category=lehengas" className="hover:text-[#4A1724] hover:underline transition-colors block">Royal Lehengas</Link></li>
                      <li><Link href="/catalog?category=anarkalis" className="hover:text-[#4A1724] hover:underline transition-colors block">Anarkalis & Kurtas</Link></li>
                      <li><Link href="/catalog?category=co-ords" className="hover:text-[#4A1724] hover:underline transition-colors block">Couture Co-ords</Link></li>
                      <li><Link href="/catalog?category=accessories" className="hover:text-[#4A1724] hover:underline transition-colors block">Accessories</Link></li>
                    </ul>
                  </div>

                  {/* Col 2 */}
                  <div className="space-y-3">
                    <p className="font-serif font-bold text-[#4A1724] uppercase tracking-wider text-[10px] border-b border-[#D7B982]/30 pb-1.5">
                      CURATED EDITS
                    </p>
                    <ul className="space-y-2 text-[#21191A]/80 font-medium">
                      <li><Link href="/catalog?category=sarees" className="hover:text-[#4A1724] hover:underline transition-colors block">The Heritage Edit</Link></li>
                      <li><Link href="/catalog?category=lehengas" className="hover:text-[#4A1724] hover:underline transition-colors block">After Dark</Link></li>
                      <li><Link href="/catalog?category=co-ords" className="hover:text-[#4A1724] hover:underline transition-colors block">Modern Heirlooms</Link></li>
                      <li><Link href="/catalog?featured=true" className="hover:text-[#4A1724] hover:underline transition-colors block">Bestsellers</Link></li>
                    </ul>
                  </div>

                  {/* Col 3 */}
                  <div className="bg-[#E8DDCE]/60 p-4 rounded-xl border border-[#D7B982]/30 space-y-2 text-center flex flex-col justify-between">
                    <div className="w-8 h-8 rounded-full border border-[#D7B982] flex items-center justify-center text-[#4A1724] text-xs mx-auto">
                      ❀
                    </div>
                    <div>
                      <p className="font-serif font-bold text-sm text-[#4A1724]">Banarasi Silk</p>
                      <p className="text-[10px] text-[#21191A]/70 font-light">Handwoven in Varanasi</p>
                    </div>
                    <Link href="/catalog?category=sarees" className="text-[9px] uppercase font-bold text-[#4A1724] tracking-widest hover:underline block pt-1">
                      EXPLORE →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/catalog?featured=true" className="hover:text-[#4A1724] transition-colors py-2">
              THE EDIT
            </Link>
            <Link href="/journal" className="hover:text-[#4A1724] transition-colors py-2">
              JOURNAL
            </Link>
            <Link href="/about" className="hover:text-[#4A1724] transition-colors py-2">
              OUR STORY
            </Link>
          </nav>

          {/* Center Brand Logo */}
          <Link href="/" className="flex flex-col items-center group py-1">
            <span className="font-serif text-3xl font-bold tracking-[0.15em] text-[#4A1724] group-hover:text-[#69705A] transition-colors">
              NOORÉ
            </span>
            <span className="text-[8px] uppercase tracking-[0.35em] text-[#D7B982] font-bold">
              WEAR YOUR STORY
            </span>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-5 text-[#21191A]">
            {/* Search */}
            <Link href="/catalog" className="hover:text-[#4A1724] transition-colors p-1" aria-label="Search">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Wishlist */}
            <button
              onClick={handleWishlistClick}
              className="relative hover:text-[#4A1724] transition-colors flex items-center gap-1"
              aria-label="Wishlist"
            >
              <svg className={`w-4 h-4 ${wishlistItems.length > 0 ? 'text-[#4A1724] fill-[#4A1724]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="hidden sm:inline-block text-xs font-semibold text-[#4A1724]">({wishlistItems.length})</span>
              )}
            </button>

            {/* Bag */}
            <button
              onClick={openCart}
              className="relative hover:text-[#4A1724] transition-colors flex items-center gap-1.5"
              aria-label="Bag"
            >
              {isSyncing && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#D7B982] rounded-full animate-pulse" />
              )}
              <svg className={`w-4 h-4 ${totalBagItems > 0 ? 'text-[#4A1724]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className={`hidden sm:inline-block text-xs font-semibold ${totalBagItems > 0 ? 'text-[#4A1724] font-bold' : ''}`}>
                ({totalBagItems})
              </span>
            </button>

            {/* User Account */}
            <UserMenu />

            {/* Hamburger Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -mr-2 text-[#4A1724] hover:bg-[#D7B982]/20 rounded-md transition-colors"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-[#F6F0E6] border-b border-[#D7B982]/40 shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col py-4 px-6 text-sm uppercase tracking-[0.2em] font-medium text-[#21191A]/80 divide-y divide-[#D7B982]/20">
              <Link href="/catalog" onClick={() => setIsMobileMenuOpen(false)} className="py-4 hover:text-[#4A1724] transition-colors">
                COLLECTIONS
              </Link>
              <Link href="/catalog?featured=true" onClick={() => setIsMobileMenuOpen(false)} className="py-4 hover:text-[#4A1724] transition-colors">
                THE EDIT
              </Link>
              <Link href="/journal" onClick={() => setIsMobileMenuOpen(false)} className="py-4 hover:text-[#4A1724] transition-colors">
                JOURNAL
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-4 hover:text-[#4A1724] transition-colors">
                OUR STORY
              </Link>
            </nav>
            <div className="bg-[#E8DDCE]/50 px-6 py-6 border-t border-[#D7B982]/30 flex flex-col items-center justify-center space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#4A1724] font-bold">WEAR YOUR STORY</span>
              <div className="w-8 h-8 rounded-full border border-[#D7B982] flex items-center justify-center text-[#4A1724] text-xs">
                ❀
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
