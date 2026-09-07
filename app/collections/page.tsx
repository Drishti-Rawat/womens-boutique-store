'use client';

import Image from 'next/image';
import Link from 'next/link';

const COLLECTIONS = [
  {
    id: 'heritage',
    title: 'The Heritage Edit',
    categorySlug: 'sarees',
    subtitle: 'Embroidery • Silk • Tradition',
    description: 'Centuries of Varanasi craftsmanship woven into deep burgundy silks, intricate zari motifs, and heavy heirloom drapes.',
    img: '/images/hero_palace.jpg',
    itemCount: '12 Silhouettes',
  },
  {
    id: 'after-dark',
    title: 'After Dark',
    categorySlug: 'lehengas',
    subtitle: 'Evening • Drama • Opulence',
    description: 'Deep plum velvets, zardozi needlework, and regal bridal silhouettes designed for palace receptions and sangeet galas.',
    img: '/images/lehenga_royal.jpg',
    itemCount: '8 Silhouettes',
  },
  {
    id: 'modern-heirlooms',
    title: 'Modern Heirlooms',
    categorySlug: 'anarkalis',
    subtitle: 'Contemporary • Minimal • Indian',
    description: 'Sage olive raw silks, lightweight Chanderi flairs, and refined threadwork tailored for the modern woman of grace.',
    img: '/images/anarkali_luxe.jpg',
    itemCount: '15 Silhouettes',
  },
  {
    id: 'organza-tissue',
    title: 'Tissue & Organza Suite',
    categorySlug: 'sarees',
    subtitle: 'Delicate • Metallic • Sheen',
    description: 'Ethereal tissue organza sarees featuring hand-block floral motifs, soft metallic sheen, and delicate borders.',
    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    itemCount: '6 Silhouettes',
  },
  {
    id: 'couture-coords',
    title: 'Couture Co-ords',
    categorySlug: 'co-ords',
    subtitle: 'Tailored • Silk • Effortless',
    description: 'Minimalist raw silk two-piece ensembles with embroidered collars and tailored trousers for modern festivities.',
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    itemCount: '10 Silhouettes',
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A]">
      {/* Banner */}
      <div className="bg-[#4A1724] text-[#F6F0E6] py-16 px-6 text-center border-b border-[#D7B982]/30">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D7B982] font-semibold">
            CURATED BOUTIQUE EDITS
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light">The Collections</h1>
          <p className="text-xs text-[#E8DDCE] font-light max-w-md mx-auto">
            Curated edits for every chapter of you — from royal bridal lehengas to minimal raw silk co-ords.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              className="group bg-[#E8DDCE]/50 rounded-3xl overflow-hidden border border-[#D7B982]/40 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={col.img}
                  alt={col.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-[#4A1724]/90 backdrop-blur-md text-[#D7B982] text-[9px] font-bold px-3 py-1 rounded-full border border-[#D7B982]/40 uppercase tracking-widest shadow">
                  {col.itemCount}
                </div>
              </div>

              {/* Description & Link */}
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#B98282] font-bold block">
                    {col.subtitle}
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-[#4A1724]">
                    {col.title}
                  </h2>
                  <p className="text-xs text-[#21191A]/80 font-light leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D7B982]/30">
                  <Link
                    href={`/catalog?category=${col.categorySlug}`}
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold text-xs uppercase tracking-widest hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow"
                  >
                    <span>EXPLORE COLLECTION</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
