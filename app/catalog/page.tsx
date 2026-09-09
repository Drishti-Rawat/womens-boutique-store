'use client';

import { useState, useEffect, useTransition, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/services/productService';
import type { Product, PaginationInfo } from '@/services/productService';
import { ProductCard } from '@/components/product/ProductCard';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';

// NOORÉ Fallback Catalog (if DB has no seeded items)
const FALLBACK_CATALOG = [
  {
    id: 'prod-1',
    name: 'Gulnaar Banarasi Saree',
    slug: 'gulnaar-banarasi-saree',
    price: 8990,
    fabric: 'Banarasi Silk • Zari Weave',
    images: ['/images/hero_palace.jpg'],
    isFeatured: true,
  },
  {
    id: 'prod-2',
    name: 'Zara Velvet Bridal Lehenga',
    slug: 'zara-bridal-lehenga',
    price: 14990,
    fabric: 'Royal Velvet • Zardozi Embroidery',
    images: ['/images/lehenga_royal.jpg'],
    isFeatured: true,
  },
  {
    id: 'prod-3',
    name: 'Arohi Sage Silk Anarkali',
    slug: 'arohi-silk-anarkali',
    price: 5290,
    fabric: 'Sage Olive Raw Silk • Gold Threadwork',
    images: ['/images/anarkali_luxe.jpg'],
    isFeatured: true,
  },
  {
    id: 'prod-4',
    name: 'Ruhani Tissue Organza Saree',
    slug: 'ruhani-tissue-saree',
    price: 5990,
    fabric: 'Tissue Organza • Delicate Border',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true,
  },
  {
    id: 'prod-5',
    name: 'Meher Ivory Silk Co-ord',
    slug: 'meher-ivory-coord',
    price: 4490,
    fabric: 'Pure Raw Silk • Minimalist Stitching',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true,
  },
  {
    id: 'prod-6',
    name: 'Suhani Velvet Anarkali',
    slug: 'suhani-velvet-anarkali',
    price: 8990,
    fabric: 'Plum Velvet • Marodi Needlework',
    images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800'],
    isFeatured: true,
  },
];

// Active DB Brand Categories
const CATEGORY_FILTERS = [
  { slug: 'all', label: 'All Collections' },
  { slug: 'sarees', label: 'Heritage Sarees' },
  { slug: 'lehengas', label: 'Royal Lehengas' },
  { slug: 'anarkalis', label: 'Anarkalis & Kurtas' },
  { slug: 'co-ords', label: 'Couture Co-ords' },
  { slug: 'accessories', label: 'Dupattas & Accessories' },
];

// Heritage Fabrics Filter Options
const FABRIC_FILTERS = [
  'All Fabrics',
  'Silk',
  'Velvet',
  'Organza',
  'Chanderi',
  'Raw Silk',
];

// Functional Price Range Brackets
const PRICE_FILTERS = [
  { id: 'all', label: 'All Prices', min: undefined, max: undefined },
  { id: 'under6k', label: 'Under ₹6,000', min: undefined, max: 6000 },
  { id: '6k-10k', label: '₹6,000 – ₹10,000', min: 6000, max: 10000 },
  { id: '10k-15k', label: '₹10,000 – ₹15,000', min: 10000, max: 15000 },
  { id: 'above15k', label: 'Above ₹15,000', min: 15000, max: undefined },
];

const ITEMS_PER_PAGE = 8;

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const isFeaturedOnly = searchParams.get('featured') === 'true';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── FILTER STATES ──────────────────────────────────────────────────────
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeFabric, setActiveFabric] = useState('All Fabrics');
  const [activePriceId, setActivePriceId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'low-high' | 'high-low'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // DB Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);

  const { user } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const addToast = useUIStore((state) => state.addToast);
  const openModal = useUIStore((state) => state.openModal);

  // ─── API FETCH EFFECT ───────────────────────────────────────────────────
  useEffect(() => {
    async function fetchCatalogFromBackend() {
      setLoading(true);
      try {
        const selectedPrice = PRICE_FILTERS.find((p) => p.id === activePriceId);

        const res = await productService.getAll({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          category: activeCategory !== 'all' ? activeCategory : undefined,
          fabric: activeFabric !== 'All Fabrics' ? activeFabric : undefined,
          minPrice: selectedPrice?.min,
          maxPrice: selectedPrice?.max,
          search: searchQuery.trim() || undefined,
          sort: sortBy,
          featured: isFeaturedOnly || undefined,
        });

        if (res.products && res.products.length > 0) {
          setProducts(res.products);
          setPaginationInfo(res.pagination || null);
        } else {
          setProducts([]);
          setPaginationInfo(null);
        }
      } catch (err) {
        console.error('API catalog fetch error:', err);
        setProducts(FALLBACK_CATALOG as unknown as Product[]);
      } finally {
        setLoading(false);
      }
    }

    fetchCatalogFromBackend();
  }, [currentPage, activeCategory, activeFabric, activePriceId, searchQuery, sortBy, isFeaturedOnly]);

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const resetAllFilters = () => {
    setActiveCategory('all');
    setActiveFabric('All Fabrics');
    setActivePriceId('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const isFiltered =
    activeCategory !== 'all' ||
    activeFabric !== 'All Fabrics' ||
    activePriceId !== 'all' ||
    searchQuery.trim() !== '';

  const totalPages = paginationInfo?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A] font-sans antialiased">
      {/* ─── 1. LUXURY BURGUNDY HERO HEADER ───────────────────────────────── */}
      <section className="relative w-full bg-[#4A1724] text-[#F6F0E6] border-b border-[#D7B982]/40 py-6 px-6 sm:px-12 overflow-hidden shadow-lg">
        {/* Background Palace Watermark */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <Image
            src="/images/hero_palace.jpg"
            alt="Palace Backdrop"
            fill
            className="object-cover object-center"
          />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          {/* Left Title & Tagline */}
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[#D7B982] text-xs">❀</span>
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#D7B982] font-semibold">
                TRADITION LIVES BEAUTIFULLY
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#F6F0E6]">
              The Nooré <span className="italic text-[#D7B982]">Collection</span>
            </h1>

            <p className="text-xs text-[#E8DDCE] font-light max-w-md">
              Handwoven Banarasi silks, royal velvet zardozi lehengas & contemporary heirlooms.
            </p>
          </div>

          {/* Right Quick Category Pills */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-xs">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setActiveCategory(cat.slug);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all border ${
                  activeCategory === cat.slug
                    ? 'bg-[#D7B982] text-[#4A1724] border-[#D7B982] font-bold shadow-md'
                    : 'bg-[#4A1724]/80 text-[#E8DDCE] border-[#D7B982]/40 hover:border-[#D7B982] hover:text-[#F6F0E6]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. TOP TOOLBAR: LIVE SEARCH, SORT & RESET ──────────────────────── */}
      <section className="bg-[#E8DDCE]/70 border-b border-[#D7B982]/30 sticky top-0 z-30 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Live Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search silhouette, fabric or craft..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#F6F0E6] text-xs text-[#21191A] placeholder-[#21191A]/60 border border-[#D7B982]/60 focus:outline-none focus:ring-1 focus:ring-[#4A1724]"
            />
            <svg className="w-4 h-4 absolute left-3 top-2 text-[#21191A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 0114 0z" />
            </svg>
          </div>

          {/* Item Count Indicator & Sort Dropdown */}
          <div className="flex items-center gap-3 text-xs ml-auto">
            <span className="text-xs font-mono text-[#69705A] font-bold hidden sm:inline-block">
              {paginationInfo ? `${paginationInfo.total} Pieces Found` : ''}
            </span>

            {isFiltered && (
              <button
                onClick={resetAllFilters}
                className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#4A1724] text-[#F6F0E6] text-[10px] font-bold uppercase tracking-wider hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow"
              >
                Reset Filters ↺
              </button>
            )}

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4A1724] text-[#F6F0E6] text-[10px] font-bold uppercase tracking-wider shadow"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filter</span>
              {isFiltered && <span className="w-1.5 h-1.5 rounded-full bg-[#D7B982]"></span>}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[#69705A] font-bold text-[10px] uppercase">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'featured' | 'low-high' | 'high-low');
                  setCurrentPage(1);
                }}
                className="bg-[#F6F0E6] border border-[#D7B982]/70 rounded-full px-4 py-1.5 text-xs font-semibold text-[#21191A] focus:outline-none focus:ring-1 focus:ring-[#4A1724]"
              >
                <option value="featured">Featured Edits</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. MAIN CONTENT: LEFT SIDEBAR FILTERS + RIGHT PRODUCT GRID ────── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ─── LEFT SIDEBAR FILTER PANEL ──────────────────────────────────── */}
          <aside className="hidden lg:block lg:col-span-3 space-y-5 text-xs border-r border-[#D7B982]/25 pr-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#D7B982]/30">
              <h2 className="font-serif text-base font-bold text-[#4A1724] flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Filter By</span>
              </h2>
              {isFiltered && (
                <button onClick={resetAllFilters} className="text-[10px] text-[#B98282] font-bold hover:underline">
                  Reset ↺
                </button>
              )}
            </div>

            {/* 1. Heritage Fabric Filter */}
            <div className="space-y-2 pb-3 border-b border-[#D7B982]/25">
              <span className="text-[#4A1724] font-serif font-bold text-xs uppercase tracking-wider block">
                Heritage Fabric
              </span>
              <div className="space-y-1 pt-0.5">
                {FABRIC_FILTERS.map((fab) => (
                  <button
                    key={fab}
                    onClick={() => {
                      setActiveFabric(fab);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                      activeFabric === fab
                        ? 'bg-[#4A1724] text-[#F6F0E6] font-bold shadow'
                        : 'hover:bg-[#E8DDCE]/60 text-[#21191A]/80'
                    }`}
                  >
                    <span>{fab}</span>
                    {activeFabric === fab && <span className="text-[#D7B982]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Price Range Filter */}
            <div className="space-y-2 pb-3 border-b border-[#D7B982]/25">
              <span className="text-[#4A1724] font-serif font-bold text-xs uppercase tracking-wider block">
                Price Range
              </span>
              <div className="space-y-1 pt-0.5 text-[#21191A]/80 font-medium">
                {PRICE_FILTERS.map((pr) => (
                  <label key={pr.id} className="flex items-center gap-2.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-[#E8DDCE]/40">
                    <input
                      type="radio"
                      name="catalogPriceFilter"
                      checked={activePriceId === pr.id}
                      onChange={() => {
                        setActivePriceId(pr.id);
                        setCurrentPage(1);
                      }}
                      className="accent-[#4A1724]"
                    />
                    <span>{pr.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bottom Heritage Card */}
            <div className="pt-1">
              <div className="border border-[#D7B982]/50 p-4 rounded-xl bg-[#E8DDCE]/40 text-center space-y-1 relative overflow-hidden shadow-sm">
                <div className="w-6 h-6 rounded-full border border-[#D7B982]/60 flex items-center justify-center text-[#4A1724] text-[10px] mx-auto">
                  ❀
                </div>
                <p className="text-[8px] uppercase tracking-[0.25em] text-[#4A1724] font-bold">
                  INDIAN ROOTS
                </p>
                <p className="text-[9px] text-[#69705A] font-serif italic">
                  A Brighter Tomorrow
                </p>
              </div>
            </div>
          </aside>

          {/* ─── RIGHT MAIN CATALOG GRID ──────────────────────────────────── */}
          <main className="lg:col-span-9 space-y-6">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="h-96 bg-[#E8DDCE] animate-pulse rounded-2xl border border-[#D7B982]/30" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-[#E8DDCE]/30 rounded-3xl border border-[#D7B982]/30 space-y-4">
                <div className="w-12 h-12 rounded-full border border-[#D7B982] flex items-center justify-center text-[#4A1724] text-xl mx-auto">
                  ❀
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#4A1724]">No Silhouettes Match Your Selection</h3>
                <p className="text-xs text-[#21191A]/70 max-w-sm mx-auto">
                  We couldn&apos;t find pieces matching your exact filter parameters. Reset filters to view all pieces.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 rounded-full bg-[#4A1724] text-[#F6F0E6] text-xs font-bold uppercase tracking-widest hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow"
                >
                  RESET FILTERS ↺
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* DB Server-Side Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-[#D7B982]/30">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-1.5 rounded-full border border-[#4A1724] text-[#4A1724] font-bold text-xs uppercase tracking-widest disabled:opacity-40 hover:bg-[#4A1724] hover:text-[#F6F0E6] transition-all"
                >
                  ← PREVIOUS
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${
                        currentPage === pg
                          ? 'bg-[#4A1724] text-[#F6F0E6] shadow-md border border-[#D7B982]/50'
                          : 'bg-[#E8DDCE] text-[#21191A] hover:bg-[#D7B982]/40'
                      }`}
                    >
                      {pg}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-1.5 rounded-full border border-[#4A1724] text-[#4A1724] font-bold text-xs uppercase tracking-widest disabled:opacity-40 hover:bg-[#4A1724] hover:text-[#F6F0E6] transition-all"
                >
                  NEXT →
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ─── 4. BOTTOM OCCASION SECTION ───────────────────────────────────── */}
      <section className="bg-[#F6F0E6] py-10 border-t border-[#D7B982]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-4 text-[#D7B982]">
              <div className="w-12 sm:w-24 h-px bg-[#D7B982]/60" />
              <div className="w-5 h-5 rounded-full border border-[#D7B982]/60 flex items-center justify-center text-[#4A1724] text-[10px]">
                ❀
              </div>
              <div className="w-12 sm:w-24 h-px bg-[#D7B982]/60" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#4A1724] tracking-tight">
              DRESS FOR THE MOMENT
            </h2>

            <p className="text-xs text-[#21191A]/70 font-light">
              Curated looks for every occasion.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {[
              { label: 'Wedding', img: '/images/lehenga_royal.jpg' },
              { label: 'Festive', img: '/images/hero_palace.jpg' },
              { label: 'Date Night', img: '/images/anarkali_luxe.jpg' },
              { label: 'Work', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800' },
              { label: 'Everyday', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800' },
            ].map((occ, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveCategory('all');
                  window.scrollTo({ top: 150, behavior: 'smooth' });
                }}
                className="group relative h-40 rounded-xl overflow-hidden shadow-md cursor-pointer border border-[#D7B982]/30"
              >
                <Image
                  src={occ.img}
                  alt={occ.label}
                  fill
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#21191A]/85 via-[#21191A]/20 to-transparent p-3 flex items-end justify-center">
                  <span className="font-serif text-lg font-normal text-[#F6F0E6] group-hover:text-[#D7B982] transition-colors">
                    {occ.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MOBILE FILTER DRAWER (SLIDE UP FROM BOTTOM) ────────────────── */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#21191A]/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileFilterOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="relative bg-[#F6F0E6] w-full max-h-[85vh] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-full duration-300">
            <div className="px-6 py-4 border-b border-[#D7B982]/30 flex items-center justify-between bg-[#E8DDCE]/80">
              <h2 className="font-serif text-lg font-bold text-[#4A1724] flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Filter & Sort</span>
              </h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6F0E6] border border-[#D7B982]/50 flex items-center justify-center text-[#4A1724] shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Filters Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 text-sm">
              {/* Fabric Filter */}
              <div className="space-y-3">
                <span className="text-[#4A1724] font-serif font-bold text-sm uppercase tracking-wider block border-b border-[#D7B982]/30 pb-2">
                  Heritage Fabric
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {FABRIC_FILTERS.map((fab) => (
                    <button
                      key={fab}
                      onClick={() => {
                        setActiveFabric(fab);
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${
                        activeFabric === fab
                          ? 'bg-[#4A1724] text-[#F6F0E6] border-[#4A1724] shadow-md'
                          : 'bg-[#F6F0E6] text-[#21191A]/80 border-[#D7B982]/50'
                      }`}
                    >
                      {fab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <span className="text-[#4A1724] font-serif font-bold text-sm uppercase tracking-wider block border-b border-[#D7B982]/30 pb-2">
                  Price Range
                </span>
                <div className="flex flex-col gap-3 pt-1 text-[#21191A]/90">
                  {PRICE_FILTERS.map((pr) => (
                    <label key={pr.id} className="flex items-center gap-3 cursor-pointer py-1">
                      <input
                        type="radio"
                        name="mobilePriceFilter"
                        checked={activePriceId === pr.id}
                        onChange={() => {
                          setActivePriceId(pr.id);
                          setCurrentPage(1);
                        }}
                        className="w-4 h-4 accent-[#4A1724]"
                      />
                      <span className="font-medium">{pr.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-6 bg-[#E8DDCE]/80 border-t border-[#D7B982]/30 flex gap-3">
              <button 
                onClick={() => {
                  resetAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-3.5 rounded-full border border-[#4A1724] text-[#4A1724] font-bold text-xs uppercase tracking-widest bg-transparent"
              >
                Clear All
              </button>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-[2] py-3.5 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold text-xs uppercase tracking-widest shadow-lg"
              >
                View {paginationInfo?.total || 0} Pieces
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F0E6] flex items-center justify-center text-xs text-[#4A1724] font-mono">LOADING NOORÉ COLLECTIONS...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
