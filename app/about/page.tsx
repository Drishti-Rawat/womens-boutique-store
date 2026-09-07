'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A]">
      {/* Banner */}
      <div className="bg-[#4A1724] text-[#F6F0E6] py-20 px-6 text-center relative overflow-hidden border-b border-[#D7B982]/30">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D7B982] font-semibold">
            WEAR YOUR STORY
          </p>
          <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight">
            Our Story & Heritage
          </h1>
          <p className="text-xs sm:text-sm text-[#E8DDCE] font-light max-w-xl mx-auto leading-relaxed">
            Rooted in Indian tradition. Reimagined for the woman of today — where centuries of artisan craft meet contemporary elegance.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
        {/* Section 1: The Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#B98282] font-bold block">
              THE NOORÉ PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1724]">
              More Than Fashion. <br />
              <span className="italic font-normal text-[#21191A]">A Feeling.</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#21191A]/80 font-light leading-relaxed">
              Founded with a passion to honor India’s textile legacy, Nooré weaves stories into every thread. From hand-loom Banarasi silks woven along the Ganges to intricate zardozi needlework crafted in ancient Rajasthan ateliers, our garments carry a soul.
            </p>
            <p className="text-xs sm:text-sm text-[#21191A]/80 font-light leading-relaxed">
              We believe that luxury should not compromise dignity. Every piece is ethically created by master weavers and women embroiderers who receive fair wages and honor ancient royal techniques.
            </p>

            <div className="pt-4">
              <Link
                href="/catalog"
                className="px-8 py-3.5 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold text-xs uppercase tracking-widest hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow-md"
              >
                EXPLORE OUR COLLECTIONS →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative min-h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-[#D7B982]/40">
            <Image
              src="/images/hero_palace.jpg"
              alt="NOORÉ Heritage Philosophy"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Section 2: Core Pillars */}
        <div className="bg-[#69705A] text-[#F6F0E6] rounded-3xl p-10 sm:p-16 border border-[#D7B982]/40 shadow-2xl relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#D7B982] font-bold block">
                OUR COMMITMENT
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">The Pillars of Nooré</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="bg-[#4A1724]/70 p-6 rounded-2xl border border-[#D7B982]/30 space-y-3">
                <div className="w-9 h-9 rounded-full border border-[#D7B982] flex items-center justify-center text-[#D7B982] text-sm">
                  ❀
                </div>
                <h3 className="font-serif text-lg font-bold text-[#F6F0E6]">Artisan Honor</h3>
                <p className="text-xs text-[#E8DDCE] font-light leading-relaxed">
                  Preserving 500-year-old weaving guilds by providing steady livelihoods to over 150 master artisan families.
                </p>
              </div>

              <div className="bg-[#4A1724]/70 p-6 rounded-2xl border border-[#D7B982]/30 space-y-3">
                <div className="w-9 h-9 rounded-full border border-[#D7B982] flex items-center justify-center text-[#D7B982] text-sm">
                  ✨
                </div>
                <h3 className="font-serif text-lg font-bold text-[#F6F0E6]">Unrivaled Quality</h3>
                <p className="text-xs text-[#E8DDCE] font-light leading-relaxed">
                  Pure mulberry silks, authentic zari filaments, and organic botanical dyes sourced directly from accredited clusters.
                </p>
              </div>

              <div className="bg-[#4A1724]/70 p-6 rounded-2xl border border-[#D7B982]/30 space-y-3">
                <div className="w-9 h-9 rounded-full border border-[#D7B982] flex items-center justify-center text-[#D7B982] text-sm">
                  👑
                </div>
                <h3 className="font-serif text-lg font-bold text-[#F6F0E6]">Personalized Fit</h3>
                <p className="text-xs text-[#E8DDCE] font-light leading-relaxed">
                  Combining custom sizing with our AI Style Assistant so every silhouette fits like a tailored heirloom.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
