'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';

interface Article {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  readTime: string;
  img: string;
  content: string[];
  featuredProducts: {
    name: string;
    slug: string;
    price: number;
    img: string;
  }[];
}

const ARTICLES: Article[] = [
  {
    id: 'autumn-jaipur',
    title: 'Autumn in Jaipur',
    subtitle: 'A celebration of colour, craft and contemporary grace.',
    author: 'Aanya Sen • Fashion Director',
    date: 'September 2026',
    readTime: '4 min read',
    img: '/images/lehenga_royal.jpg',
    content: [
      'Wandering through the sunlit, pink-hued archways of Jaipur’s ancient palaces, our design team set out to capture the timeless dignity of Rajasthan heritage.',
      'Every stitch on the Zara Velvet Bridal Lehenga reflects hours of hand-guided zardozi embroidery by artisans whose families have preserved the royal court craft for five generations.',
      'Paired with rich organza dupattas and antique gold threadwork, this collection reimagines grand occasion wear for the modern woman who embraces her roots.',
    ],
    featuredProducts: [
      {
        name: 'Zara Velvet Bridal Lehenga',
        slug: 'zara-bridal-lehenga',
        price: 14990,
        img: '/images/lehenga_royal.jpg',
      },
      {
        name: 'Gulnaar Banarasi Saree',
        slug: 'gulnaar-banarasi-saree',
        price: 6890,
        img: '/images/hero_palace.jpg',
      },
    ],
  },
  {
    id: 'art-of-zardozi',
    title: 'The Art of Zardozi Embroidery',
    subtitle: 'Inside the secret workshops of master weavers.',
    author: 'Devika Roy • Textiles Curator',
    date: 'August 2026',
    readTime: '6 min read',
    img: '/images/hero_palace.jpg',
    content: [
      'Zardozi embroidery, derived from the Persian words "Zar" (gold) and "Dozi" (embroidery), was once crafted exclusively for emperors and royal courtiers.',
      'Using real metallic gold filaments, pearls, and metallic wire (dabka), our artisans spend over 300 hours on a single bridal silhouette.',
      'We invite you behind the scenes to appreciate the patience, skill, and soul embedded in every Nooré creation.',
    ],
    featuredProducts: [
      {
        name: 'Gulnaar Banarasi Saree',
        slug: 'gulnaar-banarasi-saree',
        price: 6890,
        img: '/images/hero_palace.jpg',
      },
      {
        name: 'Arohi Sage Silk Anarkali',
        slug: 'arohi-silk-anarkali',
        price: 5290,
        img: '/images/anarkali_luxe.jpg',
      },
    ],
  },
  {
    id: 'draping-banarasi',
    title: 'Draping the Banarasi Saree',
    subtitle: 'Modern silhouettes for timeless silk weaves.',
    author: 'Nisha K. • Senior Stylist',
    date: 'July 2026',
    readTime: '3 min read',
    img: '/images/anarkali_luxe.jpg',
    content: [
      'The traditional Banarasi saree is no longer confined to classic drapes. Today’s fashion icon is pairing pure silk weaves with structured leather jackets, corset belts, and minimal gold chokers.',
      'Whether attending an intimate sangeet or a international gala, the Banarasi commands instant respect and understated luxury.',
    ],
    featuredProducts: [
      {
        name: 'Arohi Sage Silk Anarkali',
        slug: 'arohi-silk-anarkali',
        price: 5290,
        img: '/images/anarkali_luxe.jpg',
      },
    ],
  },
];

export default function JournalPage() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const addToast = useUIStore((state) => state.addToast);

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A]">
      {/* Banner */}
      <div className="bg-[#4A1724] text-[#F6F0E6] py-16 px-6 text-center border-b border-[#D7B982]/30">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D7B982] font-semibold">
            THE NOORÉ EDITORIAL
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light">The Journal</h1>
          <p className="text-xs text-[#E8DDCE] font-light max-w-md mx-auto">
            Notes on style, heritage craft, and the inspirations behind our collections.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="group bg-[#E8DDCE]/40 rounded-2xl overflow-hidden border border-[#D7B982]/30 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={article.img}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-[#B98282] font-bold uppercase tracking-wider">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-[#4A1724] group-hover:text-[#69705A] transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-xs text-[#21191A]/80 font-light leading-relaxed line-clamp-3">
                    {article.content[0]}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D7B982]/30 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="text-xs font-bold text-[#4A1724] uppercase tracking-widest hover:underline"
                  >
                    READ FULL STORY →
                  </button>
                  <span className="text-[10px] text-[#69705A] font-semibold">{article.featuredProducts.length} Looks</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ─── FULL STORY READER OVERLAY MODAL ─────────────────────────────────── */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-[#21191A]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#F6F0E6] text-[#21191A] rounded-3xl max-w-3xl w-full border border-[#D7B982] shadow-2xl relative overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-[#4A1724] text-[#F6F0E6] flex items-center justify-between border-b border-[#D7B982]/30 flex-shrink-0">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[#D7B982] font-bold">
                  NOORÉ EDITORIAL • {selectedArticle.readTime}
                </p>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F6F0E6]">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-9 h-9 rounded-full bg-[#F6F0E6]/10 hover:bg-[#F6F0E6] text-[#F6F0E6] hover:text-[#4A1724] flex items-center justify-center font-bold transition-all text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              {/* Cover Image */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md border border-[#D7B982]/30">
                <Image src={selectedArticle.img} alt={selectedArticle.title} fill className="object-cover" />
              </div>

              {/* Author & Subtitle */}
              <div className="border-b border-[#D7B982]/30 pb-4">
                <p className="text-sm font-serif italic text-[#4A1724] font-bold">
                  {selectedArticle.subtitle}
                </p>
                <p className="text-xs text-[#21191A]/60 font-mono pt-1">
                  By {selectedArticle.author} • {selectedArticle.date}
                </p>
              </div>

              {/* Story Content Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm font-light text-[#21191A]/90 leading-relaxed">
                {selectedArticle.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Shop the Look in this Story */}
              <div className="bg-[#E8DDCE]/60 p-6 rounded-2xl border border-[#D7B982]/40 space-y-4 pt-4">
                <h3 className="font-serif text-lg font-bold text-[#4A1724] flex items-center gap-2">
                  <span>🛍️</span>
                  <span>Shop Silhouettes Featured in this Story</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedArticle.featuredProducts.map((prod, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-[#F6F0E6] p-3 rounded-xl border border-[#D7B982]/30">
                      <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={prod.img} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4 className="font-serif text-xs font-bold text-[#21191A] truncate">{prod.name}</h4>
                        <p className="text-xs font-bold text-[#4A1724]">₹ {prod.price.toLocaleString('en-IN')}</p>
                        <div className="flex items-center gap-2 pt-1">
                          <Link
                            href={`/product/${prod.slug}`}
                            onClick={() => setSelectedArticle(null)}
                            className="text-[10px] font-bold text-[#4A1724] uppercase tracking-wider underline"
                          >
                            VIEW DETAILS
                          </Link>
                          <button
                            onClick={() => addToast(`Added "${prod.name}" to shopping bag!`, 'success')}
                            className="text-[10px] font-bold bg-[#4A1724] text-[#F6F0E6] px-2.5 py-0.5 rounded-full uppercase"
                          >
                            ADD +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
