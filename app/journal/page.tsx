'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';

interface FeaturedProduct {
  name: string;
  slug: string;
  price: number;
  img: string;
  fabric: string;
}

interface Article {
  id: string;
  category: 'Heritage & Craft' | 'Style & Draping' | 'Atelier Stories' | 'Royal Archives' | 'Sustainability';
  title: string;
  subtitle: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  img: string;
  pullQuote?: string;
  content: string[];
  featuredProducts: FeaturedProduct[];
}

const ARTICLES: Article[] = [
  {
    id: 'autumn-jaipur-royal-renaissance',
    category: 'Heritage & Craft',
    title: 'Autumn in Jaipur: A Royal Renaissance of Zardozi',
    subtitle: 'Inside the sunlit, pink-hued archways of Rajasthan where centuries of real gold filigree embroidery come alive for the modern muse.',
    author: 'Aanya Sen',
    authorRole: 'Head of Creative & Heritage Research',
    date: 'September 2026',
    readTime: '6 min read',
    img: '/images/lehenga_royal.jpg',
    pullQuote: 'Zardozi is not merely decorative threadwork—it is architecture rendered in metallic gold filament.',
    content: [
      'Wandering through the sunlit, pink-hued archways of Jaipur’s ancient courtyards, our design atelier set out to capture the quiet grandeur of Rajasthan royal heritage.',
      'Every stitch on the Zara Velvet Bridal Lehenga reflects over 320 hours of intricate hand-guided zardozi needlework by master craftspeople whose lineages served royal courts for five generations.',
      'By coupling heavy silk velvet with feather-light tissue organza dupattas, this collection reimagines grand ceremony attire for the contemporary woman who commands space with regal poise.',
      'From the precise weight of the metallic embroidery to the hand-dyed crimson hues, every detail honors ancestral techniques while speaking directly to today’s celebratory moments.'
    ],
    featuredProducts: [
      {
        name: 'Zara Velvet Bridal Lehenga',
        slug: 'zara-bridal-lehenga',
        price: 14990,
        img: '/images/lehenga_royal.jpg',
        fabric: 'Royal Velvet & Zardozi',
      },
      {
        name: 'Gulnaar Banarasi Brocade Saree',
        slug: 'gulnaar-banarasi-saree',
        price: 8990,
        img: '/images/hero_palace.jpg',
        fabric: 'Pure Katan Silk',
      },
    ],
  },
  {
    id: 'art-of-varanasi-zardozi',
    category: 'Atelier Stories',
    title: 'The Varanasi Loom Archives: 500 Years of Katan Silk',
    subtitle: 'Behind closed doors in the historic alleyways of Varanasi where master weavers spin gold zari into timeless heirlooms.',
    author: 'Devika Roy',
    authorRole: 'Textiles Curator & Craft Conservator',
    date: 'August 2026',
    readTime: '7 min read',
    img: '/images/hero_palace.jpg',
    pullQuote: 'A single Banarasi saree contains thousands of interlocked silk threads, each holding a fragment of Varanasi history.',
    content: [
      'Along the sacred banks of the Ganges, the steady rhythmic clatter of handlooms has resonated for half a millennium. Here, the art of Katan silk weaving remains untouched by industrial speed.',
      'Using pure silver wire wrapped in 24k gold leaf—known traditionally as zari—weavers spend up to eight weeks crafting a single length of fabric.',
      'We invite you inside our partner workshops in Varanasi to witness the patience, skill, and reverence woven into every thread of the Nooré bridal lineage.'
    ],
    featuredProducts: [
      {
        name: 'Gulnaar Banarasi Brocade Saree',
        slug: 'gulnaar-banarasi-saree',
        price: 8990,
        img: '/images/hero_palace.jpg',
        fabric: 'Handwoven Banarasi Silk',
      },
      {
        name: 'Arohi Sage Silk Anarkali',
        slug: 'arohi-silk-anarkali',
        price: 5290,
        img: '/images/anarkali_luxe.jpg',
        fabric: 'Chanderi & Raw Silk',
      },
    ],
  },
  {
    id: 'modern-draping-banarasi-silks',
    category: 'Style & Draping',
    title: 'Modern Draping: Reimagining Royal Silk Silhouettes',
    subtitle: 'From structured blazer pairings to fluid pleated drapes, discover contemporary ways to style classic royal heritage sarees.',
    author: 'Nisha K.',
    authorRole: 'Senior Editorial Stylist',
    date: 'August 2026',
    readTime: '5 min read',
    img: '/images/anarkali_luxe.jpg',
    pullQuote: 'Heritage garments shine brightest when worn with individual attitude and contemporary ease.',
    content: [
      'The traditional Indian saree is no longer confined to classic drapes. Today’s style icon pairs pure Banarasi silk weaves with sharp tailored corsets, belt accents, and minimalist gold chokers.',
      'Whether attending an intimate sangeet sunset gathering or an international gala, the structured fluidity of silk commands instant respect.',
      'Discover four signature styling edits curated by our head stylists to bring heirloom textiles into your modern evening wardrobe.'
    ],
    featuredProducts: [
      {
        name: 'Arohi Sage Silk Anarkali',
        slug: 'arohi-silk-anarkali',
        price: 5290,
        img: '/images/anarkali_luxe.jpg',
        fabric: 'Sage Chanderi Silk',
      },
    ],
  },
  {
    id: 'organic-botanical-dye-rituals',
    category: 'Sustainability',
    title: 'Botanical Alchemy: Natural Indigo & Madder Root',
    subtitle: 'How our Bagru artisans extract rich crimsons and midnight blues using centuries-old flower dye rituals.',
    author: 'Kabir V.',
    authorRole: 'Sustainability & Supply Lead',
    date: 'July 2026',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800',
    pullQuote: 'True luxury respects the earth—our botanical dyes return cleanly to the soil.',
    content: [
      'Our commitment to zero synthetic polymers extends deep into our dye houses. Hand-carved teak blocks are pressed into natural indigo, madder root, and recycled marigold flower vats.',
      'This chemical-free process leaves textiles infinitely soft, skin-friendly, and naturally antibacterial.',
      'Each batch yields subtle color variations that make every Nooré garment a one-of-a-kind art piece.'
    ],
    featuredProducts: [
      {
        name: 'Meher Ivory Silk Co-ord',
        slug: 'meher-ivory-coord',
        price: 4490,
        img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
        fabric: 'Hand-dyed Mulmul Silk',
      },
    ],
  },
  {
    id: 'royal-archives-mughal-motifs',
    category: 'Royal Archives',
    title: 'Deciphering Mughal Floral Motifs in Imperial Textiles',
    subtitle: 'A historical exploration of the iris, poppy, and cypress tree symbols preserved in royal museum collections.',
    author: 'Dr. Meera Vasudev',
    authorRole: 'Royal Textile Historian',
    date: 'June 2026',
    readTime: '8 min read',
    img: '/images/lehenga_royal.jpg',
    pullQuote: 'Every flower rendered in zari was a coded prayer for fertility, prosperity, and eternal bloom.',
    content: [
      'The imperial court ateliers of 17th-century India transformed floral portraiture into intricate metallic embroideries.',
      'Motifs like the bel (creeper vine) and booti (single flower motif) symbolized continuous life and spiritual symmetry.',
      'At Nooré, our designers study original museum archives to recreate these historic proportions with meticulous fidelity.'
    ],
    featuredProducts: [
      {
        name: 'Zara Velvet Bridal Lehenga',
        slug: 'zara-bridal-lehenga',
        price: 14990,
        img: '/images/lehenga_royal.jpg',
        fabric: 'Royal Velvet & Zardozi',
      },
    ],
  },
];

const ARTISAN_SPOTLIGHTS = [
  {
    name: 'Ustad Rahat Ali',
    craft: 'Master Zardozi Embroiderer',
    experience: '42 Years Experience',
    location: 'Jaipur Atelier',
    quote: 'When my needle passes through silk velvet, I feel the breath of generations before me.',
    img: '/images/hero_palace.jpg',
  },
  {
    name: 'Priya & Mohan Sharma',
    craft: 'Katan Silk Loom Masters',
    experience: '35 Years Experience',
    location: 'Varanasi Guild',
    quote: 'A true Banarasi weave cannot be rushed. Patience is our finest yarn.',
    img: '/images/anarkali_luxe.jpg',
  },
];

export default function JournalPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [fontSizeClass, setFontSizeClass] = useState<'text-xs' | 'text-sm' | 'text-base'>('text-sm');
  const [savedArticles, setSavedArticles] = useState<string[]>([]);
  
  const addToast = useUIStore((state) => state.addToast);
  const { addItem } = useCartStore();

  const categories = ['All', 'Heritage & Craft', 'Style & Draping', 'Atelier Stories', 'Royal Archives', 'Sustainability'];

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const coverArticle = ARTICLES[0];

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedArticles.includes(id)) {
      setSavedArticles(savedArticles.filter((item) => item !== id));
      addToast('Removed from saved bookmarks', 'info');
    } else {
      setSavedArticles([...savedArticles, id]);
      addToast('Saved to your reading list!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A] font-sans antialiased selection:bg-[#4A1724] selection:text-[#F6F0E6]">
      {/* ─── 1. JOURNAL ISSUE MASTHEAD BANNER ────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#4A1724] text-[#F6F0E6] py-14 px-6 sm:px-12 border-b border-[#D7B982]/40 shadow-2xl overflow-hidden">
        {/* Ambient Palace Overlay */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <Image
            src="/images/hero_palace.jpg"
            alt="Palace Background"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A1724] via-[#4A1724]/80 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D7B982]/60" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#D7B982] font-semibold">
              VOL. IV • AUTUMN / WINTER EDITORIAL ISSUE
            </span>
            <span className="h-px w-8 bg-[#D7B982]/60" />
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#F6F0E6]">
            The Nooré <span className="italic text-[#D7B982] font-normal">Journal</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#E8DDCE] font-light max-w-xl mx-auto leading-relaxed">
            Dispatches on Indian royal style, handloom conservation, master weaver lineages, and the stories woven into every silhouette.
          </p>

          {/* Search bar & quick category counts */}
          <div className="pt-4 max-w-md mx-auto relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories, crafts, or fabrics..."
              className="w-full px-5 py-2.5 rounded-full bg-[#F6F0E6]/10 backdrop-blur-md border border-[#D7B982]/50 text-xs text-[#F6F0E6] placeholder-[#E8DDCE]/60 focus:outline-none focus:border-[#D7B982] focus:bg-[#F6F0E6]/20 transition-all text-center"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-2.5 text-xs text-[#D7B982] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* ─── 2. FEATURED COVER STORY BANNER ───────────────────────────────── */}
        {!searchQuery && (
          <section
            onClick={() => setSelectedArticle(coverArticle)}
            className="bg-[#E8DDCE]/60 rounded-3xl overflow-hidden border border-[#D7B982]/40 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 cursor-pointer group hover:border-[#D7B982] hover:shadow-2xl transition-all"
          >
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[460px] overflow-hidden bg-[#E8DDCE]">
              <Image
                src={coverArticle.img}
                alt={coverArticle.title}
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#21191A]/80 via-transparent to-transparent lg:hidden" />
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6 bg-[#E8DDCE]/40">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="bg-[#4A1724] text-[#D7B982] text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#D7B982]/40 shadow">
                    ✦ COVER STORY • {coverArticle.category}
                  </span>
                  <button
                    onClick={(e) => toggleBookmark(coverArticle.id, e)}
                    className="text-[#4A1724] hover:text-[#D7B982] transition-colors text-sm"
                    title="Bookmark article"
                  >
                    {savedArticles.includes(coverArticle.id) ? '★ Saved' : '☆ Save'}
                  </button>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A1724] group-hover:text-[#69705A] transition-colors leading-tight">
                  {coverArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#21191A]/80 font-light leading-relaxed">
                  {coverArticle.subtitle}
                </p>

                {coverArticle.pullQuote && (
                  <blockquote className="border-l-2 border-[#D7B982] pl-4 italic text-xs text-[#4A1724] font-serif py-1">
                    "{coverArticle.pullQuote}"
                  </blockquote>
                )}
              </div>

              <div className="pt-6 border-t border-[#D7B982]/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#4A1724]">{coverArticle.author}</p>
                  <p className="text-[10px] text-[#21191A]/60 font-mono">
                    {coverArticle.date} • {coverArticle.readTime}
                  </p>
                </div>

                <span className="px-5 py-2.5 rounded-full bg-[#4A1724] text-[#F6F0E6] text-xs font-bold uppercase tracking-widest group-hover:bg-[#D7B982] group-hover:text-[#4A1724] transition-all shadow">
                  READ STORY →
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ─── 3. CATEGORY FILTER PILLS ───────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 border-b border-[#D7B982]/30 pb-6 text-xs">
          {categories.map((cat) => {
            const count = cat === 'All' ? ARTICLES.length : ARTICLES.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium tracking-wide transition-all flex items-center gap-2 border ${
                  selectedCategory === cat
                    ? 'bg-[#4A1724] text-[#F6F0E6] border-[#4A1724] font-bold shadow-md'
                    : 'bg-[#E8DDCE]/50 text-[#21191A]/80 border-[#D7B982]/40 hover:bg-[#E8DDCE] hover:border-[#D7B982]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedCategory === cat ? 'bg-[#D7B982] text-[#4A1724]' : 'bg-[#D7B982]/30 text-[#4A1724]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ─── 4. EDITORIAL ARTICLES GRID ───────────────────────────────────── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#4A1724]">
              {selectedCategory === 'All' ? 'Latest Journal Editions' : `${selectedCategory} Stories`}
            </h3>
            <span className="text-xs text-[#69705A] font-mono">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'editorial' : 'editorials'}
            </span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="bg-[#E8DDCE]/40 rounded-3xl p-12 text-center border border-[#D7B982]/30 space-y-3">
              <p className="font-serif text-lg text-[#4A1724] font-bold">No stories match your criteria</p>
              <p className="text-xs text-[#21191A]/60">Try searching for a different keyword or select another category.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-2 text-xs font-bold text-[#4A1724] underline uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group bg-[#E8DDCE]/40 rounded-3xl overflow-hidden border border-[#D7B982]/30 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#D7B982] transition-all duration-300 cursor-pointer relative"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E8DDCE]">
                    <Image
                      src={article.img}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <span className="bg-[#4A1724]/90 backdrop-blur-md text-[#D7B982] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow pointer-events-auto">
                        {article.category}
                      </span>
                      <button
                        onClick={(e) => toggleBookmark(article.id, e)}
                        className="bg-[#F6F0E6]/90 backdrop-blur-md text-[#4A1724] hover:text-[#D7B982] p-1.5 rounded-full text-xs shadow pointer-events-auto transition-transform hover:scale-110"
                      >
                        {savedArticles.includes(article.id) ? '★' : '☆'}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-[#69705A] font-bold uppercase tracking-wider font-mono">
                        <span>{article.date}</span>
                        <span>{article.readTime}</span>
                      </div>

                      <h4 className="font-serif text-xl font-bold text-[#4A1724] group-hover:text-[#69705A] transition-colors leading-snug">
                        {article.title}
                      </h4>

                      <p className="text-xs text-[#21191A]/80 font-light leading-relaxed line-clamp-3">
                        {article.subtitle}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#D7B982]/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4A1724] uppercase tracking-widest group-hover:underline">
                        READ ARTICLE →
                      </span>
                      {article.featuredProducts.length > 0 && (
                        <span className="text-[10px] bg-[#D7B982]/30 text-[#4A1724] px-2 py-0.5 rounded-full font-bold">
                          🛍️ {article.featuredProducts.length} Looks
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* ─── 5. PULL-QUOTE BANNER ────────────────────────────────────────── */}
        <section className="bg-[#4A1724] text-[#F6F0E6] rounded-3xl p-10 sm:p-14 border border-[#D7B982]/40 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-4 relative z-10">
            <span className="text-[#D7B982] text-3xl font-serif">“</span>
            <p className="font-serif text-2xl sm:text-3xl italic font-light text-[#F6F0E6] leading-relaxed">
              In every metallic zari filament of a Banarasi weave lives the patience of five generations of master weavers. We do not just preserve craft—we honor living ancestry.
            </p>
            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-[#D7B982]">
                DEVICKA ROY • SENIOR TEXTILE HISTORIAN
              </p>
            </div>
          </div>
        </section>

        {/* ─── 6. ARTISAN GUILD SPOTLIGHT ─────────────────────────────────── */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#69705A] font-bold">
              BEHIND THE WEAVE
            </span>
            <h3 className="font-serif text-3xl font-bold text-[#4A1724]">
              Artisan Guild Spotlight
            </h3>
            <p className="text-xs text-[#21191A]/70 font-light">
              Meet the master craftspeople whose ancestral techniques define the soul of Nooré.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ARTISAN_SPOTLIGHTS.map((artisan, idx) => (
              <div
                key={idx}
                className="bg-[#E8DDCE]/50 rounded-3xl p-6 border border-[#D7B982]/40 flex flex-col sm:flex-row gap-6 items-center shadow-md hover:border-[#D7B982] transition-all"
              >
                <div className="relative w-28 h-36 rounded-2xl overflow-hidden flex-shrink-0 border border-[#D7B982]">
                  <Image src={artisan.img} alt={artisan.name} fill className="object-cover" />
                </div>
                <div className="space-y-2 flex-1 text-center sm:text-left">
                  <span className="text-[9px] uppercase tracking-widest text-[#4A1724] font-bold bg-[#D7B982]/30 px-2.5 py-0.5 rounded-full">
                    {artisan.location}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#4A1724] pt-1">{artisan.name}</h4>
                  <p className="text-xs font-bold text-[#69705A]">{artisan.craft} • {artisan.experience}</p>
                  <p className="text-xs font-serif italic text-[#21191A]/80 pt-1">
                    "{artisan.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 7. NEWSLETTER SUBSCRIPTION ───────────────────────────────── */}
        <section className="bg-[#E8DDCE]/60 rounded-3xl p-10 sm:p-14 border border-[#D7B982]/50 text-center relative overflow-hidden shadow-lg">
          <div className="max-w-xl mx-auto space-y-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#4A1724] border border-[#D7B982] flex items-center justify-center text-[#D7B982] text-xs mx-auto shadow">
              ❀
            </div>
            <h3 className="font-serif text-3xl font-bold text-[#4A1724]">
              Subscribe to The Nooré Gazette
            </h3>
            <p className="text-xs text-[#21191A]/80 font-light leading-relaxed">
              Receive monthly invitations to private heritage launches, textile conservation essays, and personal styling edits.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addToast('Thank you for subscribing to The Nooré Gazette.', 'success');
              }}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-full bg-[#F6F0E6] border border-[#D7B982]/60 text-xs text-[#21191A] placeholder-[#21191A]/50 focus:outline-none focus:border-[#4A1724]"
              />
              <button
                type="submit"
                className="px-8 py-3 rounded-full bg-[#4A1724] text-[#F6F0E6] font-bold text-xs uppercase tracking-widest hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow-md"
              >
                JOIN GAZETTE →
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* ─── 8. FULL STORY READER OVERLAY MODAL ────────────────────────────── */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-[#21191A]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#F6F0E6] text-[#21191A] rounded-3xl max-w-3xl w-full border border-[#D7B982] shadow-2xl relative overflow-hidden my-6 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-[#4A1724] text-[#F6F0E6] flex items-center justify-between border-b border-[#D7B982]/30 flex-shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-[#D7B982] font-bold">
                    {selectedArticle.category} • {selectedArticle.readTime}
                  </span>
                  <div className="flex items-center gap-1 bg-[#F6F0E6]/10 px-2 py-0.5 rounded text-[10px] font-mono">
                    <button
                      onClick={() => setFontSizeClass('text-xs')}
                      className={`px-1 rounded ${fontSizeClass === 'text-xs' ? 'bg-[#D7B982] text-[#4A1724] font-bold' : 'text-white'}`}
                    >
                      A-
                    </button>
                    <button
                      onClick={() => setFontSizeClass('text-sm')}
                      className={`px-1 rounded ${fontSizeClass === 'text-sm' ? 'bg-[#D7B982] text-[#4A1724] font-bold' : 'text-white'}`}
                    >
                      A
                    </button>
                    <button
                      onClick={() => setFontSizeClass('text-base')}
                      className={`px-1 rounded ${fontSizeClass === 'text-base' ? 'bg-[#D7B982] text-[#4A1724] font-bold' : 'text-white'}`}
                    >
                      A+
                    </button>
                  </div>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#F6F0E6] leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-9 h-9 rounded-full bg-[#F6F0E6]/10 hover:bg-[#F6F0E6] text-[#F6F0E6] hover:text-[#4A1724] flex items-center justify-center font-bold transition-all text-sm ml-4 flex-shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              {/* Main Image */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md border border-[#D7B982]/30">
                <Image src={selectedArticle.img} alt={selectedArticle.title} fill className="object-cover" />
              </div>

              {/* Author & Subtitle */}
              <div className="border-b border-[#D7B982]/30 pb-4 space-y-1">
                <p className="font-serif italic text-base sm:text-lg text-[#4A1724] font-bold leading-relaxed">
                  {selectedArticle.subtitle}
                </p>
                <div className="flex items-center justify-between text-xs text-[#21191A]/70 font-mono pt-1">
                  <span>By {selectedArticle.author} ({selectedArticle.authorRole})</span>
                  <span>{selectedArticle.date}</span>
                </div>
              </div>

              {/* Pull Quote callout if available */}
              {selectedArticle.pullQuote && (
                <div className="bg-[#E8DDCE] border-l-4 border-[#4A1724] p-5 rounded-r-2xl my-4">
                  <p className="font-serif italic text-sm sm:text-base text-[#4A1724] font-bold">
                    "{selectedArticle.pullQuote}"
                  </p>
                </div>
              )}

              {/* Story Content */}
              <div className={`space-y-4 font-light text-[#21191A]/90 leading-relaxed ${fontSizeClass}`}>
                {selectedArticle.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Featured Silhouettes (Shop the Look) */}
              {selectedArticle.featuredProducts.length > 0 && (
                <div className="bg-[#E8DDCE]/70 p-6 rounded-2xl border border-[#D7B982]/40 space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#4A1724] flex items-center gap-2">
                      <span>🛍️</span>
                      <span>Featured Silhouettes in this Story</span>
                    </h3>
                    <span className="text-[10px] text-[#69705A] font-bold uppercase tracking-wider">
                      DIRECT FROM ATELIER
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedArticle.featuredProducts.map((prod, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-[#F6F0E6] p-3 rounded-xl border border-[#D7B982]/30 shadow-sm hover:border-[#D7B982] transition-all">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#D7B982]/30">
                          <Image src={prod.img} alt={prod.name} fill className="object-cover" />
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="font-serif text-xs font-bold text-[#21191A] truncate">{prod.name}</h4>
                          <p className="text-[10px] text-[#69705A] font-mono">{prod.fabric}</p>
                          <p className="text-xs font-bold text-[#4A1724]">₹ {prod.price.toLocaleString('en-IN')}</p>
                          <div className="flex items-center gap-2 pt-1">
                            <Link
                              href={`/product/${prod.slug}`}
                              onClick={() => setSelectedArticle(null)}
                              className="text-[10px] font-bold text-[#4A1724] uppercase tracking-wider underline hover:text-[#D7B982]"
                            >
                              VIEW DETAILS
                            </Link>
                            <button
                              onClick={() => {
                                addItem({
                                  productId: prod.slug,
                                  name: prod.name,
                                  slug: prod.slug,
                                  price: prod.price,
                                  image: prod.img,
                                  size: 'M',
                                  quantity: 1,
                                  fabric: prod.fabric,
                                });
                                addToast(`Added "${prod.name}" to shopping bag!`, 'success');
                              }}
                              className="text-[10px] font-bold bg-[#4A1724] text-[#F6F0E6] px-2.5 py-0.5 rounded-full uppercase hover:bg-[#D7B982] hover:text-[#4A1724] transition-all"
                            >
                              ADD +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
