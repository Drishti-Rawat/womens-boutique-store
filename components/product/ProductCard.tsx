'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
  tag?: string;
  isWishlistPage?: boolean;
}

export function ProductCard({ product, tag, isWishlistPage = false }: ProductCardProps) {
  const { addToast, openModal } = useUIStore();
  const { user } = useAuthStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  const isSaved = isInWishlist(product.id);
  const displayTag = tag || (product.isFeatured ? 'BESTSELLER' : null);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product, user, openModal, addToast);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images?.[0] || '/images/hero_palace.jpg',
      size: 'M',
      quantity: 1,
      fabric: product.fabric,
    });
    addToast(`Added "${product.name}" to shopping bag!`, 'success');
  };

  return (
    <div className="group flex flex-col justify-between bg-[#E8DDCE]/30 p-3 rounded-2xl border border-[#D7B982]/30 hover:border-[#D7B982] transition-all shadow-sm hover:shadow-lg h-full">
      <div>
        {/* Product Image Container */}
        <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] w-full overflow-hidden bg-[#E8DDCE] rounded-xl border border-[#D7B982]/20 mb-3">
          <Image
            src={product.images?.[0] || '/images/hero_palace.jpg'}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />

          {/* Craft / Scarcity Badge */}
          {displayTag && (
            <div className="absolute top-2.5 left-2.5 bg-[#4A1724] text-[#D7B982] text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow border border-[#D7B982]/30">
              {displayTag}
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={handleHeartClick}
            className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center text-xs shadow transition-all ${
              isSaved
                ? 'bg-[#4A1724] text-[#F6F0E6]'
                : 'bg-[#F6F0E6]/90 text-[#4A1724] hover:bg-[#4A1724] hover:text-[#F6F0E6]'
            }`}
            title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            {isSaved ? '♥' : '♡'}
          </button>
        </Link>

        {/* Product Metadata */}
        <div className="space-y-0.5 px-1">
          <span className="text-[9px] uppercase tracking-widest text-[#B98282] font-bold block truncate">
            {product.fabric || 'Royal Heritage Craft'}
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="font-serif text-xs font-bold text-[#21191A] group-hover:text-[#4A1724] transition-colors block truncate"
          >
            {product.name}
          </Link>

          <div className="pt-0.5 flex items-baseline justify-between">
            <span className="text-xs font-bold text-[#4A1724]">
              ₹ {product.price ? product.price.toLocaleString('en-IN') : '0'}
            </span>
            {product.salePrice && product.salePrice > product.price && (
              <span className="text-[10px] text-[#21191A]/40 line-through">
                ₹ {product.salePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Row */}
      <div className="pt-3 border-t border-[#D7B982]/20 mt-3 flex items-center gap-2">
        <Link
          href={`/product/${product.slug}`}
          className="flex-1 py-2 rounded-full border border-[#4A1724] text-[#4A1724] text-center font-bold text-[9px] uppercase tracking-wider hover:bg-[#E8DDCE] transition-all"
        >
          DETAILS
        </Link>
        <button
          onClick={handleAddToCart}
          className="flex-1 py-2 rounded-full bg-[#4A1724] text-[#F6F0E6] text-center font-bold text-[9px] uppercase tracking-wider hover:bg-[#D7B982] hover:text-[#4A1724] transition-all shadow"
        >
          ADD +
        </button>
      </div>
    </div>
  );
}
