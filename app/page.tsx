'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { productService } from '@/services/productService';
import type { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useChatStore } from '@/store/chatStore';

// Default curated 4 hero items with artisan scarcity tags
const MOCKUP_PRODUCTS = [
  {
    id: 'mock-1',
    name: 'Gulnaar Banarasi Anarkali',
    slug: 'gulnaar-banarasi-saree',
    price: 8990,
    tag: 'Hand-Embroidered • 3 Left',
    images: ['/images/hero_palace.jpg'],
  },
  {
    id: 'mock-2',
    name: 'Arohi Sage Silk Kurta',
    slug: 'arohi-silk-anarkali',
    price: 4990,
    tag: 'Master Artisan Edition',
    images: ['/images/anarkali_luxe.jpg'],
  },
  {
    id: 'mock-3',
    name: 'Meher Ivory Tissue Saree',
    slug: 'ruhani-tissue-saree',
    price: 6990,
    tag: 'Limited Tissue Silk',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800'],
  },
  {
    id: 'mock-4',
    name: 'Zara Velvet Bridal Lehenga',
    slug: 'zara-bridal-lehenga',
    price: 12990,
    tag: 'Bespoke Velvet • Exclusive',
    images: ['/images/lehenga_royal.jpg'],
  },
];

const TESTIMONIALS = [
  {
    name: 'Ananya Sharma',
    city: 'Mumbai',
    occasion: 'Sister\'s Sangeet',
    rating: 5,
    quote: 'The zardozi work on the Zara Lehenga exceeded all my expectations. Sitting under the palace lights, I felt like true royalty. Unmatched craft!',
    img: '/images/lehenga_royal.jpg',
  },
  {
    name: 'Priya R. Merchant',
    city: 'New Delhi',
    occasion: 'Royal Reception',
    rating: 5,
    quote: 'The Gulnaar Anarkali is a heirloom piece. The weight of the silk and richness of the burgundy tone turns heads effortlessly.',
    img: '/images/hero_palace.jpg',
  },
  {
    name: 'Meera Kapoor',
    city: 'London',
    occasion: 'Diwali Gala',
    rating: 5,
    quote: 'Nooré\'s AI stylist recommended the Arohi Sage set for my body type, and the fit was absolute perfection right out of the box!',
    img: '/images/anarkali_luxe.jpg',
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [aiInputText, setAiInputText] = useState('');
  // Testimonial slider index
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const addToast = useUIStore((state) => state.addToast);
  const openModal = useUIStore((state) => state.openModal);
  const { user } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { openChat, sendMessage } = useChatStore();

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const res = await productService.getAll({ featured: true });
        if (res.products && res.products.length > 0) {
          setProducts(res.products.slice(0, 4));
        } else {
          setProducts(MOCKUP_PRODUCTS as unknown as Product[]);
        }
      } catch (err) {
        console.error('Failed to load featured products from DB:', err);
        setProducts(MOCKUP_PRODUCTS as unknown as Product[]);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (productName: string) => {
    addToast(`Added "${productName}" to your shopping bag.`, 'success');
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = aiInputText.trim();
    if (!text) return;
    openChat();
    sendMessage(selectedOccasion ? `${text} (for ${selectedOccasion})` : text);
    setAiInputText('');
    setSelectedOccasion(null);
  };

  const displayProducts = (products.length > 0 ? products : (MOCKUP_PRODUCTS as unknown as Product[])).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A] font-sans antialiased selection:bg-[#4A1724] selection:text-[#F6F0E6] relative">
      {/* ─── 1. HERO BANNER (MATCHING REFERENCE MOCK) ─────────────────────────── */}
      <section className="relative w-full h-[88vh] bg-[#4A1724] text-[#F6F0E6] overflow-hidden flex flex-col justify-between p-6 sm:p-12">
        {/* Background 8K Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_palace.jpg"
            alt="NOORÉ House of Indian Elegance"
            fill
            priority
            className="object-cover object-center brightness-95 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A1724] via-[#4A1724]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A1724]/85 via-[#4A1724]/30 to-transparent" />
        </div>

        {/* Top Spacer / Kicker */}
        <div className="relative z-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D7B982] font-semibold">
            TRADITION LIVES BEAUTIFULLY
          </p>
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end justify-between gap-8 pb-4">
          <div className="max-w-2xl space-y-4">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight leading-[1.02] text-[#F6F0E6]">
              THE ART <br />
              <span className="italic font-normal text-[#D7B982]">OF BEING HER</span>
            </h1>
            <p className="text-xs sm:text-sm font-light text-[#E8DDCE] max-w-md leading-relaxed">
              Contemporary silhouettes, rooted in Indian heritage.
            </p>

            <div className="pt-2 flex items-center gap-6">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#E8DDCE] text-[#4A1724] font-bold text-xs uppercase tracking-widest hover:bg-[#F6F0E6] transition-all shadow-xl border border-[#D7B982] group"
              >
                <span>EXPLORE COLLECTIONS</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Slider Indicators */}
            <div className="pt-6 flex items-center gap-3 text-[10px] text-[#D7B982] tracking-widest font-mono">
              <span className="font-bold text-[#F6F0E6]">01</span>
              <div className="w-12 h-px bg-[#D7B982]" />
              <span>02</span>
              <span>03</span>
            </div>
          </div>

          {/* Right Kicker & Emblem */}
          <div className="hidden lg:flex flex-col items-end gap-12 text-right">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#E8DDCE]/70 space-y-1 font-mono">
              <p>TIMELESS</p>
              <p>FEMININE</p>
              <p>ARTISTIC</p>
              <p>INDIAN</p>
              <p className="text-[#D7B982]">ALWAYS YOU</p>
            </div>

            <div className="flex flex-col items-center p-5 rounded-2xl bg-[#4A1724]/80 backdrop-blur-md border border-[#D7B982]/40 text-center max-w-[160px] space-y-1.5 shadow-2xl">
              <div className="w-9 h-9 rounded-full border border-[#D7B982]/50 flex items-center justify-center text-[#D7B982] text-sm">
                ❀
              </div>
              <p className="text-[8px] uppercase tracking-[0.3em] text-[#D7B982] font-bold">
                MORE THAN FASHION
              </p>
              <p className="font-serif italic text-xs text-[#E8DDCE]">
                A feeling
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. SECTION: A NEW CHAPTER IN INDIAN DRESSING ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Cream Card */}
          <div className="lg:col-span-5 bg-[#E8DDCE]/60 p-10 sm:p-12 rounded-2xl border border-[#D7B982]/40 flex flex-col justify-between space-y-8 relative overflow-hidden">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[9px] uppercase tracking-[0.35em] text-[#B98282] font-bold hidden sm:block whitespace-nowrap">
              WEAR YOUR STORY
            </div>

            <div className="space-y-6 pl-0 sm:pl-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B98282] font-bold block">
                OUR STORY
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A1724] leading-[1.1]">
                A NEW <br />
                CHAPTER IN <br />
                <span className="italic font-normal text-[#21191A]">INDIAN DRESSING.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#21191A]/80 font-light leading-relaxed max-w-md">
                Rooted in tradition. Reimagined for the woman of today — where heritage meets modern elegance.
              </p>
            </div>

            <div className="pl-0 sm:pl-4 pt-4">
              <Link
                href="/catalog"
                className="px-6 py-3 rounded-full border border-[#4A1724] text-[#4A1724] font-bold text-xs uppercase tracking-widest hover:bg-[#4A1724] hover:text-[#F6F0E6] transition-all inline-block"
              >
                DISCOVER THE EDIT →
              </Link>
            </div>
          </div>

          {/* Center Arched Image Cutout */}
          <div className="lg:col-span-4 relative min-h-[440px] rounded-t-full overflow-hidden shadow-xl border border-[#D7B982]/30 group">
            <Image
              src="/images/anarkali_luxe.jpg"
              alt="NOORÉ Arched Couture"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Right Sage Green Line-Art Panel */}
          <div className="lg:col-span-3 bg-[#69705A] text-[#F6F0E6] p-8 sm:p-10 rounded-2xl flex flex-col justify-between border border-[#69705A] relative overflow-hidden shadow-lg">
            <div className="absolute right-[-20px] bottom-[-20px] text-[#F6F0E6]/10 text-9xl font-serif pointer-events-none select-none">
              ❀
            </div>
            <div className="relative z-10 space-y-4">
              <div className="w-8 h-8 rounded-full border border-[#D7B982]/50 flex items-center justify-center text-[#D7B982] text-xs">
                ❀
              </div>
              <h3 className="font-serif text-2xl font-normal leading-snug text-[#F6F0E6]">
                TIMELESS PIECES FOR A MORE BEAUTIFUL TOMORROW
              </h3>
            </div>
            <div className="relative z-10 pt-8 border-t border-[#F6F0E6]/20">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D7B982] font-bold">
                NOORÉ HERITAGE
              </span>
            </div>
          </div>
        </div>
      </section>



      {/* ─── 3. SECTION: THE COLLECTIONS (3 CARDS MATCHING MOCK) ─────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#D7B982]/50 flex items-center justify-center text-[#4A1724] text-xs">
              ❀
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1724]">
                THE COLLECTIONS
              </h2>
              <p className="text-xs text-[#21191A]/70 font-light">
                Curated edits for every chapter of you.
              </p>
            </div>
          </div>
          <Link href="/catalog" className="text-xs uppercase tracking-widest font-bold text-[#4A1724] hover:underline">
            VIEW ALL →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="relative h-[340px] rounded-2xl overflow-hidden group shadow-lg border border-[#D7B982]/30">
            <Image
              src="/images/hero_palace.jpg"
              alt="The Heritage Edit"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#21191A]/95 via-[#21191A]/30 to-transparent p-6 flex flex-col justify-end">
              <h3 className="font-serif text-xl font-bold text-[#F6F0E6]">THE HERITAGE EDIT</h3>
              <p className="text-[11px] text-[#D7B982] uppercase tracking-wider mb-2">Embroidery • Silk • Tradition</p>
              <Link href="/catalog?category=sarees" className="w-9 h-9 rounded-full border border-[#F6F0E6]/40 flex items-center justify-center text-[#F6F0E6] group-hover:bg-[#4A1724] transition-all self-end">
                →
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative h-[340px] rounded-2xl overflow-hidden group shadow-lg border border-[#D7B982]/30">
            <Image
              src="/images/lehenga_royal.jpg"
              alt="After Dark"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#21191A]/95 via-[#21191A]/30 to-transparent p-6 flex flex-col justify-end">
              <h3 className="font-serif text-xl font-bold text-[#F6F0E6]">AFTER DARK</h3>
              <p className="text-[11px] text-[#D7B982] uppercase tracking-wider mb-2">Evening • Drama • Opulence</p>
              <Link href="/catalog?category=lehengas" className="w-9 h-9 rounded-full border border-[#F6F0E6]/40 flex items-center justify-center text-[#F6F0E6] group-hover:bg-[#4A1724] transition-all self-end">
                →
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative h-[340px] rounded-2xl overflow-hidden group shadow-lg border border-[#D7B982]/30">
            <Image
              src="/images/anarkali_luxe.jpg"
              alt="Modern Heirlooms"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#21191A]/95 via-[#21191A]/30 to-transparent p-6 flex flex-col justify-end">
              <h3 className="font-serif text-xl font-bold text-[#F6F0E6]">MODERN HEIRLOOMS</h3>
              <p className="text-[11px] text-[#D7B982] uppercase tracking-wider mb-2">Contemporary • Minimal • Indian</p>
              <Link href="/catalog?category=co-ords" className="w-9 h-9 rounded-full border border-[#F6F0E6]/40 flex items-center justify-center text-[#F6F0E6] group-hover:bg-[#4A1724] transition-all self-end">
                →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. SECTION: THE NOORÉ EDIT (CURATED 4-COLUMN HERO PRODUCT DISPLAY) ─ */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-[#D7B982]/25">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#D7B982]/50 flex items-center justify-center text-[#4A1724] text-xs">
              ❀
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A1724]">
                THE NOORÉ EDIT
              </h2>
              <p className="text-xs text-[#21191A]/70 font-light">
                4 Hand-picked hero silhouettes for the season.
              </p>
            </div>
          </div>
          <Link href="/catalog" className="text-xs uppercase tracking-widest font-bold text-[#4A1724] hover:underline">
            EXPLORE ALL ({products.length > 0 ? '12+' : '4'}) →
          </Link>
        </div>

        {/* 4 Column Curated Hero Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-[#E8DDCE] animate-pulse rounded-xl border border-[#D7B982]/30" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product, idx) => {
              const tag = (product as unknown as { tag?: string }).tag || MOCKUP_PRODUCTS[idx % 4].tag;
              return <ProductCard key={product.id} product={product} tag={tag} />;
            })}
          </div>
        )}
      </section>

      {/* ─── 5. SECTION: YOUR PERSONAL STYLE ASSISTANT (MATCHING MOCK ARCH) ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-[#69705A] text-[#F6F0E6] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-[#D7B982]/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Arched Model Cutout */}
            <div className="lg:col-span-4 relative h-80 rounded-t-full overflow-hidden border-2 border-[#D7B982]/40 shadow-xl">
              <Image
                src="/images/hero_palace.jpg"
                alt="NOORÉ AI Stylist"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Middle Assistant Intro */}
            <div className="lg:col-span-4 space-y-4">
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#D7B982] font-bold">
                MEET NOORÉ EDIT
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-[#F6F0E6]">
                Your Personal <br />
                Style Assistant
              </h2>
              <p className="text-xs font-light text-[#E8DDCE] leading-relaxed">
                Not sure what to wear? Tell us your occasion, style or mood — Nooré will suggest looks just for you.
              </p>


            </div>

            {/* Right Occasion Selector & Input Bar */}
            <div className="lg:col-span-4 bg-[#4A1724]/70 backdrop-blur-md p-6 rounded-2xl border border-[#D7B982]/30 space-y-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#F6F0E6]">
                  What are you dressing for?
                </h3>
                <p className="text-[11px] italic font-serif text-[#D7B982]">
                  &quot;Style advice that feels like a friend.&quot;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Wedding', icon: '💍' },
                  { label: 'Festive', icon: '✨' },
                  { label: 'Date Night', icon: '🍷' },
                  { label: 'Work', icon: '💼' },
                  { label: 'Everyday', icon: '🌸' },
                  { label: 'Something else', icon: '🔍' },
                ].map((occ, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedOccasion(occ.label);
                      openChat();
                      sendMessage(`Show me outfits for ${occ.label}`);
                    }}
                    className={`px-3 py-2 rounded-lg border text-[11px] font-medium tracking-wider transition-all flex items-center gap-1.5 ${
                      selectedOccasion === occ.label
                        ? 'bg-[#D7B982] text-[#4A1724] border-[#D7B982] font-bold shadow'
                        : 'bg-[#F6F0E6]/10 border-[#D7B982]/30 text-[#E8DDCE] hover:bg-[#F6F0E6]/20'
                    }`}
                  >
                    <span>{occ.icon}</span>
                    <span className="truncate">{occ.label}</span>
                  </button>
                ))}
              </div>

              {/* Interactive Input */}
              <form onSubmit={handleAiSubmit} className="relative pt-2">
                <input
                  type="text"
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  placeholder="Tell Nooré what you're looking for..."
                  className="w-full pl-4 pr-10 py-3 rounded-full bg-[#F6F0E6] text-[#21191A] text-xs placeholder-[#21191A]/60 focus:outline-none focus:ring-2 focus:ring-[#D7B982]"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-[11px] w-7 h-7 rounded-full bg-[#4A1724] text-[#F6F0E6] flex items-center justify-center text-xs font-bold shadow"
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEW INTERACTIVE FEATURE: ROYAL TESTIMONIALS SLIDER ───────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-[#E8DDCE]/50 p-8 sm:p-12 rounded-3xl border border-[#D7B982]/40 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#B98282] font-bold block">
              LOVED BY WOMEN OF GRACE
            </span>
            
            {/* Stars */}
            <div className="flex items-center justify-center gap-1 text-[#D7B982]">
              {'★'.repeat(TESTIMONIALS[testimonialIdx].rating)}
            </div>

            {/* Quote */}
            <p className="font-serif text-xl sm:text-2xl text-[#4A1724] italic leading-relaxed">
              &quot;{TESTIMONIALS[testimonialIdx].quote}&quot;
            </p>

            {/* Author */}
            <div className="space-y-1 pt-2">
              <h4 className="font-serif text-base font-bold text-[#21191A]">
                {TESTIMONIALS[testimonialIdx].name}
              </h4>
              <p className="text-xs text-[#21191A]/70">
                {TESTIMONIALS[testimonialIdx].city} • <span className="text-[#B98282] font-medium">{TESTIMONIALS[testimonialIdx].occasion}</span>
              </p>
            </div>

            {/* Dots Pagination */}
            <div className="flex items-center justify-center gap-3 pt-4">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    testimonialIdx === i ? 'bg-[#4A1724] w-8' : 'bg-[#D7B982]/60 hover:bg-[#4A1724]/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. SECTION: STORIES IN FABRIC (LOOKBOOK SPLIT MATCHING MOCK) ────── */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-[#D7B982]/25">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Lookbook Story */}
          <div className="lg:col-span-5 bg-[#E8DDCE]/60 p-10 rounded-2xl border border-[#D7B982]/40 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B98282] font-bold block">
                THE LOOKBOOK
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1724]">
                Stories <br />
                in Fabric.
              </h2>
              <p className="text-xs text-[#21191A]/80 font-light leading-relaxed max-w-sm">
                A closer look at the pieces, people and inspirations behind our collections.
              </p>
            </div>

            <div>
              <Link
                href="/journal"
                className="px-6 py-3 rounded-full border border-[#4A1724] text-[#4A1724] font-bold text-xs uppercase tracking-widest hover:bg-[#4A1724] hover:text-[#F6F0E6] transition-all inline-block"
              >
                EXPLORE THE JOURNAL →
              </Link>
            </div>
          </div>

          {/* Right Wide Editorial Image & Story Banner */}
          <div className="lg:col-span-7 relative min-h-[360px] rounded-2xl overflow-hidden shadow-xl group border border-[#D7B982]/30">
            <Image
              src="/images/lehenga_royal.jpg"
              alt="Autumn in Jaipur"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#21191A]/95 via-[#21191A]/30 to-transparent p-8 flex flex-col justify-end text-[#F6F0E6]">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">AUTUMN IN JAIPUR</h3>
              <p className="text-xs text-[#E8DDCE] font-light max-w-md mt-1 mb-4">
                A celebration of colour, craft and contemporary grace.
              </p>
              <div className="flex items-center justify-between">
                <Link href="/journal" className="text-xs uppercase tracking-widest text-[#D7B982] font-bold hover:underline">
                  READ THE STORY →
                </Link>
                <span className="text-xs text-[#D7B982] font-mono">► 01 / 03</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. SECTION: MADE WITH MEMORY (CRAFTSMANSHIP BAR MATCHING MOCK) ─── */}
      <section className="bg-[#4A1724] text-[#F6F0E6] py-20 my-12 border-y border-[#D7B982]/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left Title */}
          <div className="max-w-md space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F6F0E6]">
              MADE <br />
              WITH MEMORY.
            </h2>
            <p className="text-xs text-[#E8DDCE] font-light leading-relaxed">
              From handwoven textiles to intricate embroidery, every Nooré piece carries a fragment of India&apos;s rich heritage.
            </p>
            <Link href="/craftsmanship" className="inline-block text-xs uppercase tracking-widest text-[#D7B982] font-bold hover:underline pt-2">
              OUR CRAFT →
            </Link>
          </div>

          {/* Right 4 Craft Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
            {[
              { title: 'ZARI', img: '/images/hero_palace.jpg' },
              { title: 'HAND EMBROIDERY', img: '/images/lehenga_royal.jpg' },
              { title: 'SILK', img: '/images/anarkali_luxe.jpg' },
              { title: 'HAND BLOCK PRINT', img: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=400' },
            ].map((craft, i) => (
              <div key={i} className="group text-center space-y-2">
                <div className="relative aspect-square w-32 sm:w-36 rounded-lg overflow-hidden border border-[#D7B982]/30 mx-auto shadow-md">
                  <Image src={craft.img} alt={craft.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h4 className="font-serif text-xs font-bold text-[#D7B982] tracking-wider">{craft.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW INTERACTIVE FEATURE: #WomenOfNooré SOCIAL COMMUNITY FEED ───── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#B98282] font-bold block">
            OUR COMMUNITY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1724]">
            #WomenOfNooré
          </h2>
          <p className="text-xs text-[#21191A]/70 font-light">
            Real celebrations, real grace. Tag @NooreOfficial to be featured.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { tag: '@ananya.royal', img: '/images/lehenga_royal.jpg', caption: 'Sangeet night in Zara Velvet' },
            { tag: '@priya_desai', img: '/images/hero_palace.jpg', caption: 'Palace wedding in Gulnaar' },
            { tag: '@meera.london', img: '/images/anarkali_luxe.jpg', caption: 'Diwali in Arohi Sage' },
            { tag: '@radhika_stuns', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800', caption: 'Tissue silk elegance' },
          ].map((item, idx) => (
            <div key={idx} className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-md border border-[#D7B982]/30 cursor-pointer">
              <Image src={item.img} alt={item.tag} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#21191A]/90 via-transparent to-transparent p-4 flex flex-col justify-end text-[#F6F0E6]">
                <p className="text-[11px] font-bold text-[#D7B982]">{item.tag}</p>
                <p className="text-[10px] text-[#E8DDCE] font-light truncate">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 8. SECTION: NEWSLETTER SIGNUP (MATCHING MOCK) ──────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center relative overflow-hidden">
        <div className="max-w-xl mx-auto space-y-4 relative z-10">
          <div className="w-8 h-8 rounded-full border border-[#D7B982]/50 flex items-center justify-center text-[#4A1724] text-xs mx-auto">
            ❀
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1724]">
            LET&apos;S KEEP IN TOUCH.
          </h2>
          <p className="text-xs text-[#21191A]/70 font-light">
            Notes on style, craft and everything beautiful.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              addToast('Thank you for subscribing to NOORÉ Notes.', 'success');
            }}
            className="flex flex-col sm:flex-row gap-3 pt-4"
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 px-6 py-3.5 rounded-full bg-[#E8DDCE] border border-[#D7B982]/60 text-xs text-[#21191A] placeholder-[#21191A]/50 focus:outline-none focus:border-[#4A1724]"
            />
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold text-xs uppercase tracking-widest hover:bg-[#331019] transition-all shadow-md"
            >
              JOIN →
            </button>
          </form>
        </div>
      </section>

      {/* ─── 9. FOOTER (MATCHING MOCK EXACTLY) ───────────────────────────────── */}
      <footer className="bg-[#21261D] text-[#F6F0E6] pt-16 pb-8 border-t border-[#D7B982]/20 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#F6F0E6]/10 text-xs">
          {/* Brand Logo & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-3xl font-bold text-[#D7B982] tracking-wider block">
              NOORÉ
            </span>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#D7B982] font-semibold">
              WEAR YOUR STORY
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <p className="font-bold text-[#D7B982] uppercase tracking-wider text-[10px]">SHOP</p>
            <ul className="space-y-2 text-[#E8DDCE]/80 font-light">
              <li><Link href="/catalog" className="hover:text-[#D7B982] transition-colors">New In</Link></li>
              <li><Link href="/catalog?category=sarees" className="hover:text-[#D7B982] transition-colors">Collections</Link></li>
              <li><Link href="/catalog?category=lehengas" className="hover:text-[#D7B982] transition-colors">Bestsellers</Link></li>
              <li><Link href="/catalog?category=accessories" className="hover:text-[#D7B982] transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-3">
            <p className="font-bold text-[#D7B982] uppercase tracking-wider text-[10px]">ABOUT</p>
            <ul className="space-y-2 text-[#E8DDCE]/80 font-light">
              <li><Link href="/about" className="hover:text-[#D7B982] transition-colors">Our Story</Link></li>
              <li><Link href="/craftsmanship" className="hover:text-[#D7B982] transition-colors">Craftsmanship</Link></li>
              <li><Link href="/journal" className="hover:text-[#D7B982] transition-colors">Journal</Link></li>
              <li><Link href="/careers" className="hover:text-[#D7B982] transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-3">
            <p className="font-bold text-[#D7B982] uppercase tracking-wider text-[10px]">HELP</p>
            <ul className="space-y-2 text-[#E8DDCE]/80 font-light">
              <li><Link href="/contact" className="hover:text-[#D7B982] transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-[#D7B982] transition-colors">Shipping</Link></li>
              <li><Link href="/returns" className="hover:text-[#D7B982] transition-colors">Returns</Link></li>
              <li><Link href="/faq" className="hover:text-[#D7B982] transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Socials & Rights Bar */}
        <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E8DDCE]/60 gap-4">
          <p>© 2026 Nooré. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <span className="text-[#B98282]">♥</span> in India
          </p>
        </div>


      </footer>
    </div>
  );
}

