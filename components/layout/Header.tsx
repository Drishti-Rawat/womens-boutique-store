'use client';

import Link from 'next/link';
import { UserMenu } from '@/components/auth/UserMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/90 backdrop-blur-md border-b border-amber-500/20 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col items-start group">
          <span className="text-2xl font-serif tracking-wider font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 group-hover:opacity-90 transition-opacity">
            ROOPKALA ROYALE
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-amber-500/80 font-medium">
            Boutique &amp; Haute Couture
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-medium text-stone-300">
          <Link href="/catalog" className="hover:text-amber-400 transition-colors">
            Collections
          </Link>
          <Link href="/catalog?category=sarees" className="hover:text-amber-400 transition-colors">
            Heritage Sarees
          </Link>
          <Link href="/catalog?category=lehengas" className="hover:text-amber-400 transition-colors">
            Royal Lehengas
          </Link>
          <Link href="/catalog?category=couture" className="hover:text-amber-400 transition-colors">
            Couture
          </Link>
        </nav>

        {/* Right Action Menu */}
        <div className="flex items-center gap-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
