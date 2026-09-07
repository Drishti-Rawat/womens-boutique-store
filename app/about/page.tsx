'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';

export default function AboutPage() {
  const openModal = useUIStore((state) => state.openModal);

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A] font-sans antialiased selection:bg-[#4A1724] selection:text-[#F6F0E6]">
      {/* ─── 1. HERO HEADER BANNER ────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#4A1724] text-[#F6F0E6] py-20 px-6 sm:px-12 overflow-hidden border-b border-[#D7B982]/40 shadow-xl">
        {/* Background Palace Watermark */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Image
            src="/images/hero_palace.jpg"
            alt="Palace Background"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A1724] via-[#4A1724]/70 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#D7B982] text-sm">❀</span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D7B982] font-semibold">
              WEAR YOUR STORY • HERITAGE & CRAFT
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#F6F0E6]">
            The Soul of <span className="italic text-[#D7B982] font-normal">Nooré</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#E8DDCE] font-light max-w-2xl mx-auto leading-relaxed pt-2">
            An ode to Indian heritage, centuries of artisan mastery, and the modern woman who carries her roots with effortless grace.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4 text-xs font-mono text-[#D7B982]">
            <span>SINCE 2026</span>
            <span>•</span>
            <span>HANDMADE IN INDIA</span>
            <span>•</span>
            <span>100% ETHICAL</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {/* ─── 2. CHAPTER 1: THE ORIGIN (SPLIT 3-PANEL LAYOUT) ───────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Panel: The Philosophy */}
          <div className="lg:col-span-5 bg-[#E8DDCE]/60 p-10 sm:p-12 rounded-3xl border border-[#D7B982]/40 flex flex-col justify-between space-y-8 shadow-sm">
            <div className="space-y-6">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#B98282] font-bold block">
                CHAPTER I — THE ORIGIN
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1724] leading-[1.15]">
                Born in the Heart <br />
                of Rajasthan & <br />
                <span className="italic font-normal text-[#21191A]">Varanasi.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#21191A]/80 font-light leading-relaxed">
                Nooré was born from a simple realization: Indian clothing is not mere fashion — it is living art. Every thread woven on a handloom carries a fragment of history, a family legacy, and hundreds of hours of patient artisan dedication.
              </p>
              <p className="text-xs sm:text-sm text-[#21191A]/80 font-light leading-relaxed">
                We bridge the gap between ancient royal ateliers and the global modern woman who seeks timeless silhouettes without sacrificing comfort or authenticity.
              </p>
            </div>

            <div className="pt-4 border-t border-[#D7B982]/30 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#69705A] font-bold">HERITAGE ATELIERS</span>
              <span className="text-xs text-[#4A1724] font-serif font-bold italic">Jaipur • Varanasi • Chanderi</span>
            </div>
          </div>

          {/* Center Arched Portrait Image */}
          <div className="lg:col-span-4 relative min-h-[480px] rounded-t-full overflow-hidden shadow-2xl border-2 border-[#D7B982]/40 group">
            <Image
              src="/images/anarkali_luxe.jpg"
              alt="NOORÉ Master Artisan Craft"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Right Panel: Sage Green Craft Statement */}
          <div className="lg:col-span-3 bg-[#69705A] text-[#F6F0E6] p-8 sm:p-10 rounded-3xl flex flex-col justify-between border border-[#69705A] relative overflow-hidden shadow-xl">
            <div className="absolute right-[-20px] bottom-[-20px] text-[#F6F0E6]/10 text-9xl font-serif pointer-events-none select-none">
              ❀
            </div>
            <div className="relative z-10 space-y-6">
              <div className="w-10 h-10 rounded-full border border-[#D7B982]/50 flex items-center justify-center text-[#D7B982] text-sm">
                ❀
              </div>
              <h3 className="font-serif text-2xl font-normal leading-snug text-[#F6F0E6]">
                CRAFTING HEIRLOOMS, NOT FAST FASHION.
              </h3>
              <p className="text-xs font-light text-[#E8DDCE] leading-relaxed">
                Every Nooré piece is slow fashion in its purest form. Designed to be passed down through generations like prized jewelry.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-[#F6F0E6]/20">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D7B982] font-bold block">
                NOORÉ GUARANTEE
              </span>
              <span className="text-xs text-[#E8DDCE] font-light">100% Pure Natural Fibers</span>
            </div>
          </div>
        </section>

        {/* ─── 3. CHAPTER 2: THE 4 CRAFT LEGACIES ──────────────────────────── */}
        <section className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#B98282] font-bold block">
              CHAPTER II — CRAFT LEGACY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1724]">
              Handmade by Human Hands
            </h2>
            <p className="text-xs text-[#21191A]/70 font-light">
              We work directly with over 150 master artisan families across 4 historic textile clusters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'ZARI WEAVING',
                cluster: 'Varanasi, UP',
                desc: 'Pure metallic filaments woven on wooden handlooms along the sacred Ganges, creating lustrous Banarasi sarees and lehengas.',
                img: '/images/hero_palace.jpg',
              },
              {
                title: 'ZARDOZI & MARODI',
                cluster: 'Jaipur, Rajasthan',
                desc: 'Intricate needlework incorporating zari threads, pearls, and sequins practiced by imperial court embroiderers for centuries.',
                img: '/images/lehenga_royal.jpg',
              },
              {
                title: 'PURE RAW SILKS',
                cluster: 'Chanderi & Kanchipuram',
                desc: 'Sustainably harvested Mulberry and Tissue silks woven with sheer metallic sheen and unmatched fluid drape.',
                img: '/images/anarkali_luxe.jpg',
              },
              {
                title: 'HAND BLOCK PRINTING',
                cluster: 'Bagru, Rajasthan',
                desc: 'Hand-carved teak wood blocks dipped in organic indigo, madder root, and botanical dyes to print delicate floral motifs.',
                img: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=400',
              },
            ].map((craft, i) => (
              <div key={i} className="bg-[#E8DDCE]/40 p-6 rounded-2xl border border-[#D7B982]/30 space-y-4 shadow-sm group hover:border-[#D7B982] hover:shadow-xl transition-all">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#E8DDCE]">
                  <Image src={craft.img} alt={craft.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-widest text-[#B98282] font-bold block">{craft.cluster}</span>
                  <h3 className="font-serif text-lg font-bold text-[#4A1724]">{craft.title}</h3>
                  <p className="text-xs text-[#21191A]/80 font-light leading-relaxed">{craft.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 4. CHAPTER 3: FOUNDER'S VISION BANNER ───────────────────────── */}
        <section className="bg-[#4A1724] text-[#F6F0E6] rounded-3xl p-10 sm:p-16 border border-[#D7B982]/40 relative overflow-hidden shadow-2xl">
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <div className="w-12 h-12 rounded-full border border-[#D7B982]/50 flex items-center justify-center text-[#D7B982] text-xl mx-auto">
              ❀
            </div>

            <blockquote className="font-serif italic text-2xl sm:text-4xl text-[#E8DDCE] leading-relaxed">
              &quot;We didn&apos;t start Nooré to make clothing. We started Nooré to give women a feeling — the feeling of stepping into a palace, wrapped in the memories and pride of our ancestors.&quot;
            </blockquote>

            <div className="space-y-1">
              <p className="font-serif text-base font-bold text-[#D7B982]">THE FOUNDERS OF NOORÉ</p>
              <p className="text-xs text-[#E8DDCE]/70 font-mono uppercase tracking-widest">House of Indian Elegance</p>
            </div>
          </div>
        </section>

        {/* ─── 5. CHAPTER 4: THE 3 PILLARS OF NOORÉ ─────────────────────────── */}
        <section className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#B98282] font-bold block">
              OUR COMMITMENT
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1724]">
              The 3 Pillars of Nooré
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#E8DDCE]/50 p-8 rounded-3xl border border-[#D7B982]/40 space-y-4 shadow-sm hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-full bg-[#4A1724] text-[#D7B982] flex items-center justify-center text-base font-bold">
                👑
              </div>
              <h3 className="font-serif text-xl font-bold text-[#4A1724]">Ethical Artisan Wages</h3>
              <p className="text-xs text-[#21191A]/80 font-light leading-relaxed">
                Every artisan family receives fair, dignified wages and healthcare support. By preserving historic weaving clusters, we ensure ancient techniques are passed down to future generations.
              </p>
            </div>

            <div className="bg-[#E8DDCE]/50 p-8 rounded-3xl border border-[#D7B982]/40 space-y-4 shadow-sm hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-full bg-[#4A1724] text-[#D7B982] flex items-center justify-center text-base font-bold">
                🌿
              </div>
              <h3 className="font-serif text-xl font-bold text-[#4A1724]">Zero Polyester Luxury</h3>
              <p className="text-xs text-[#21191A]/80 font-light leading-relaxed">
                We strictly use 100% natural Mulberry silk, organza, linen, and organic cotton. Zero synthetic polyesters are used, making every garment breathable and biodegradable.
              </p>
            </div>

            <div className="bg-[#E8DDCE]/50 p-8 rounded-3xl border border-[#D7B982]/40 space-y-4 shadow-sm hover:shadow-lg transition-all">
              <div className="w-10 h-10 rounded-full bg-[#4A1724] text-[#D7B982] flex items-center justify-center text-base font-bold">
                ✨
              </div>
              <h3 className="font-serif text-xl font-bold text-[#4A1724]">AI Sizing Precision</h3>
              <p className="text-xs text-[#21191A]/80 font-light leading-relaxed">
                Combining traditional royal draping with state-of-the-art AI body fitting so your silhouette feels custom-tailored the moment it arrives at your doorstep.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 6. CALL TO ACTION ────────────────────────────────────────────── */}
        <section className="bg-[#E8DDCE]/70 rounded-3xl p-10 sm:p-16 border border-[#D7B982]/40 text-center space-y-6">
          <div className="w-10 h-10 rounded-full border border-[#D7B982] flex items-center justify-center text-[#4A1724] text-lg mx-auto">
            ❀
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#4A1724]">
            Ready to Find Your <span className="italic text-[#21191A] font-normal">Silhouette?</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#21191A]/80 font-light max-w-md mx-auto leading-relaxed">
            Explore our curated collections of Banarasi sarees, royal velvet lehengas, and contemporary co-ords.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="px-8 py-3.5 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold text-xs uppercase tracking-widest hover:bg-[#331019] transition-all shadow-xl border border-[#D7B982]"
            >
              EXPLORE COLLECTIONS →
            </Link>

            <button
              onClick={() => openModal('login')}
              className="px-8 py-3.5 rounded-full bg-[#F6F0E6] border border-[#4A1724] text-[#4A1724] font-bold text-xs uppercase tracking-widest hover:bg-[#4A1724] hover:text-[#F6F0E6] transition-all shadow"
            >
              ASK NOORÉ STYLIST 💬
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
