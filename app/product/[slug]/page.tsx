'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { productService } from '@/services/productService';
import type { Product } from '@/types';
import { useUIStore } from '@/store/uiStore';

export default function ProductDetailPage() {
  const params = useParams();
  const slugParam = (params?.slug as string) || 'suhani-velvet-anarkali';

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Active View States
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [qty, setQty] = useState(1);
  const [wishlist, setWishlist] = useState(false);

  const addToast = useUIStore((state) => state.addToast);

  // Fetch product data from DB
  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        const res = await productService.getBySlug(slugParam);
        if (res.product) {
          setProduct(res.product);
          setActiveImgIndex(0);

          if (res.product.variants && res.product.variants.length > 0) {
            setSelectedSize(res.product.variants[0].size);
          }

          // Fetch related items from DB
          try {
            const relatedRes = await productService.getAll({ limit: 4 });
            if (relatedRes.products) {
              setRelatedProducts(
                relatedRes.products.filter((p) => p.id !== res.product.id).slice(0, 4)
              );
            }
          } catch (e) {
            console.error('Failed to fetch related products:', e);
          }
        }
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    }

    if (slugParam) {
      loadProductData();
    }
  }, [slugParam]);

  const handleAddToCart = () => {
    if (!product) return;
    addToast(`Added ${qty}x "${product.name}" (Size: ${selectedSize}) to your bag 🛍️`, 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F0E6] text-[#21191A] flex items-center justify-center font-mono text-xs text-[#4A1724]">
        LOADING SILHOUETTE DETAILS FROM NOORÉ VAULT...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F6F0E6] text-[#21191A] py-20 px-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border border-[#D7B982] flex items-center justify-center text-[#4A1724] text-xl mx-auto">
          ❀
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#4A1724]">Silhouette Not Found</h1>
        <p className="text-xs text-[#21191A]/70">The piece you are looking for may have been archived or moved.</p>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 rounded-full bg-[#4A1724] text-[#F6F0E6] text-xs font-bold uppercase tracking-widest"
        >
          RETURN TO CATALOG →
        </Link>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : ['/images/hero_palace.jpg', '/images/lehenga_royal.jpg', '/images/anarkali_luxe.jpg'];
  const activeImageSrc = images[activeImgIndex] || images[0];

  const availableVariants = product.variants || [];
  const selectedVariant = availableVariants.find((v) => v.size === selectedSize);
  const stockCount = selectedVariant ? selectedVariant.stock : undefined;

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#21191A] font-sans antialiased selection:bg-[#4A1724] selection:text-[#F6F0E6]">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#21191A]/70 flex items-center gap-2 font-light border-b border-[#D7B982]/25 pb-4">
          <Link href="/" className="hover:text-[#4A1724]">Home</Link>
          <span>›</span>
          <Link href="/catalog" className="hover:text-[#4A1724]">Collections</Link>
          <span>›</span>
          {product.category && (
            <>
              <Link href={`/catalog?category=${product.category.slug}`} className="hover:text-[#4A1724]">
                {product.category.name}
              </Link>
              <span>›</span>
            </>
          )}
          <span className="font-bold text-[#21191A]">{product.name}</span>
        </nav>

        {/* ─── UNBOXED HERO PRODUCT LAYOUT ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Image Viewport + Vertical Thumbnails + Image Count Badge */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 sticky top-24">
            {/* Vertical Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[480px] scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImgIndex === i
                        ? 'border-[#4A1724] shadow-md ring-1 ring-[#D7B982]'
                        : 'border-[#D7B982]/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${i}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Viewport */}
            <div className="relative aspect-[3/4] w-full max-h-[480px] rounded-2xl overflow-hidden shadow-xl bg-[#E8DDCE] border border-[#D7B982]/30 group">
              <Image
                src={activeImageSrc}
                alt={product.name}
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />

              {/* Prev / Next Carousel Controls */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#F6F0E6]/80 backdrop-blur-md flex items-center justify-center text-[#4A1724] hover:bg-[#4A1724] hover:text-[#F6F0E6] transition-colors shadow text-xs font-bold"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#F6F0E6]/80 backdrop-blur-md flex items-center justify-center text-[#4A1724] hover:bg-[#4A1724] hover:text-[#F6F0E6] transition-colors shadow text-xs font-bold"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Image Count Indicator Badge (e.g. 1 / 3) */}
              <div className="absolute bottom-3 right-3 bg-[#21191A]/80 text-[#F6F0E6] text-[10px] font-mono px-3 py-1 rounded-full backdrop-blur-md shadow border border-[#D7B982]/40">
                {activeImgIndex + 1} / {images.length}
              </div>

              {/* Bestseller Badge */}
              {product.isFeatured && (
                <div className="absolute top-3 left-3 bg-[#4A1724] text-[#D7B982] text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow border border-[#D7B982]/30">
                  BESTSELLER
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Natural Flow Product Info (Unboxed) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header Info */}
            <div className="space-y-2 pb-4 border-b border-[#D7B982]/30">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-[#D7B982] flex items-center justify-center text-[#4A1724] text-[9px]">
                  ❀
                </span>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#B98282] font-bold">
                  {product.category?.name || 'NOORÉ HERITAGE'}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#21191A] leading-tight">
                {product.name}
              </h1>

              {product.fabric && (
                <p className="text-xs text-[#21191A]/70 font-light">
                  {product.fabric}
                </p>
              )}
            </div>

            {/* Price & Stock Display */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#4A1724]">
                  ₹ {product.price.toLocaleString('en-IN')}
                </span>
                {product.salePrice && product.salePrice > product.price && (
                  <span className="text-lg text-[#21191A]/40 line-through font-light">
                    ₹ {product.salePrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#21191A]/50">Inclusive of all taxes</p>

              {stockCount !== undefined && (
                <div className="pt-2">
                  <span className="text-[11px] font-mono font-bold text-[#69705A]">
                    ✓ {stockCount > 0 ? `${stockCount} Pieces Available` : 'Out of Stock'}
                  </span>
                </div>
              )}
            </div>

            {/* Description Paragraph */}
            <p className="text-xs text-[#21191A]/80 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="space-y-2 pt-2 border-t border-[#D7B982]/25">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#21191A]">Size</span>
                <button
                  onClick={() => addToast('Standard Fitting: S (36), M (38), L (40), XL (42)', 'info')}
                  className="text-xs text-[#21191A]/70 underline hover:text-[#4A1724]"
                >
                  📐 Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {['S', 'M', 'L', 'XL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-12 h-10 rounded-lg text-xs font-bold transition-all border ${
                      selectedSize === sz
                        ? 'bg-[#4A1724] text-[#F6F0E6] border-[#4A1724] shadow'
                        : 'bg-[#F6F0E6] text-[#21191A] border-[#D7B982]/40 hover:border-[#4A1724]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-[#21191A]">Quantity</span>
                <div className="flex items-center border border-[#D7B982]/60 rounded-full bg-[#F6F0E6] px-3 py-1 gap-4">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-sm font-bold text-[#4A1724]">-</button>
                  <span className="text-xs font-bold text-[#21191A] font-mono">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="text-sm font-bold text-[#4A1724]">+</button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 rounded-lg bg-[#4A1724] text-[#F6F0E6] font-bold text-xs uppercase tracking-widest hover:bg-[#331019] transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <span>ADD TO BAG • ₹ {(product.price * qty).toLocaleString('en-IN')}</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => {
                    setWishlist(!wishlist);
                    addToast(wishlist ? 'Removed from Wishlist' : 'Saved to Wishlist ♡', 'info');
                  }}
                  className={`w-12 h-12 rounded-lg border flex items-center justify-center text-lg transition-colors ${
                    wishlist ? 'bg-[#4A1724] text-[#F6F0E6] border-[#4A1724]' : 'bg-[#F6F0E6] border-[#D7B982]/60 text-[#21191A] hover:border-[#4A1724]'
                  }`}
                >
                  {wishlist ? '♥' : '♡'}
                </button>
              </div>
            </div>

            {/* Value Proposition Perks Bar */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#D7B982]/25 text-[10px] text-[#21191A]/80">
              <div className="flex items-center gap-2">
                <span className="text-base">🚚</span>
                <div>
                  <p className="font-bold text-[#21191A]">Free Shipping</p>
                  <p className="text-[9px] text-[#21191A]/50">on orders above ₹5,000</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base">🔄</span>
                <div>
                  <p className="font-bold text-[#21191A]">Easy Returns</p>
                  <p className="text-[9px] text-[#21191A]/50">within 7 days</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base">🔒</span>
                <div>
                  <p className="font-bold text-[#21191A]">Secure Payments</p>
                  <p className="text-[9px] text-[#21191A]/50">100% safe & secure</p>
                </div>
              </div>
            </div>

            {/* Clean Specifications & Care Section (Visible & Unboxed) */}
            <div className="pt-4 border-t border-[#D7B982]/25 space-y-3 text-xs text-[#21191A]/80">
              <h4 className="font-serif font-bold text-[#4A1724] text-sm">Product Specifications & Care</h4>
              <ul className="space-y-1.5 list-disc list-inside font-light">
                <li>Crafted with authentic hand-embroidered detailing</li>
                <li>Fabric: {product.fabric || 'Pure Heritage Silk'}</li>
                <li>Dry clean only with organic solvents</li>
                <li>Store in muslin cloth away from direct sunlight</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ─── REAL DB RELATED PRODUCTS ────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="pt-10 border-t border-[#D7B982]/30 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#4A1724]">You May Also Like</h2>
              <Link href="/catalog" className="text-xs uppercase tracking-widest font-bold text-[#4A1724] hover:underline">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug || item.id}`}
                  className="bg-[#E8DDCE]/30 p-3 rounded-2xl border border-[#D7B982]/30 space-y-2 flex flex-col justify-between group hover:border-[#D7B982] hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#E8DDCE]">
                    <Image src={item.images[0] || '/images/hero_palace.jpg'} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-widest text-[#B98282] font-bold block truncate">
                      {item.fabric || 'Heritage Piece'}
                    </span>
                    <h3 className="font-serif text-xs font-bold text-[#21191A] truncate">{item.name}</h3>
                    <p className="text-xs font-bold text-[#4A1724]">₹ {item.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
