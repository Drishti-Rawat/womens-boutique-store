'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function CraftsmanshipPage() {
  const crafts = [
    {
      title: 'Zari Weaving',
      desc: 'Intricate metallic threads woven into rich Banarasi silk, carrying centuries of royal heritage.',
      img: '/images/hero_palace.jpg',
    },
    {
      title: 'Zardozi Hand Embroidery',
      desc: 'Opulent gold and silver needlework crafted by master artisans over hundreds of painstaking hours.',
      img: '/images/lehenga_royal.jpg',
    },
    {
      title: 'Pure Chanderi & Raw Silk',
      desc: 'Lightweight, lustrous silk textiles sourced directly from traditional artisan clusters in India.',
      img: '/images/anarkali_luxe.jpg',
    },
    {
      title: 'Hand Block Printing',
      desc: 'Carved wooden block motifs pressed onto organic cotton and organza using natural botanical dyes.',
      img: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A]">
      <div className="bg-[#4A1724] text-[#F6F0E6] py-16 px-6 text-center border-b border-[#D7B982]/30">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D7B982] font-semibold">
            MADE WITH MEMORY
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light">Heritage Craftsmanship</h1>
          <p className="text-xs text-[#E8DDCE] font-light max-w-md mx-auto">
            Celebrating the master weavers, embroiderers, and artisans of India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {crafts.map((craft, i) => (
            <div key={i} className="bg-[#E8DDCE]/50 rounded-2xl overflow-hidden border border-[#D7B982]/40 p-6 flex flex-col sm:flex-row gap-6 items-center shadow-md">
              <div className="relative w-full sm:w-44 h-48 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={craft.img} alt={craft.title} fill className="object-cover" />
              </div>
              <div className="space-y-3">
                <span className="text-[9px] uppercase tracking-widest text-[#D7B982] font-bold bg-[#4A1724] px-3 py-1 rounded-full inline-block">
                  NOORÉ ARTISAN CRAFT
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#4A1724]">{craft.title}</h2>
                <p className="text-xs text-[#21191A]/80 font-light leading-relaxed">{craft.desc}</p>
                <Link href="/catalog" className="inline-block text-xs font-bold text-[#4A1724] uppercase tracking-widest hover:underline pt-1">
                  VIEW CRAFT PIECES →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
