'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/types';

interface ChatProductCardProps {
  productId: string;
}

export function ChatProductCard({ productId }: ChatProductCardProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setProduct(data.product ?? null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="flex-shrink-0 w-32 h-44 rounded-lg bg-[#E8DDCE] animate-pulse" />
    );
  }

  if (!product) return null;

  const displayPrice = product.salePrice ?? product.price;
  const isOnSale = !!product.salePrice && product.salePrice < product.price;
  const image = product.images?.[0] ?? '';

  return (
    <button
      onClick={() => router.push(`/product/${product.slug}`)}
      className="flex-shrink-0 w-32 rounded-lg overflow-hidden border border-[#D7B982]/40 bg-[#FAF6EF] hover:border-[#4A1724]/50 hover:shadow-md transition-all duration-200 group text-left"
      style={{ minWidth: '128px' }}
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className="w-full h-[96px] bg-[#E8DDCE] overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#B98282] text-2xl">
            🪡
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 space-y-1">
        <p className="text-[11px] font-medium text-[#21191A] leading-tight line-clamp-2 font-serif">
          {product.name}
        </p>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[11px] font-semibold text-[#4A1724]">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
          {isOnSale && (
            <span className="text-[10px] text-[#B98282] line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
        <span className="inline-block text-[9px] uppercase tracking-wider text-[#4A1724] border border-[#D7B982] px-1.5 py-0.5 rounded-sm font-sans mt-0.5">
          View →
        </span>
      </div>
    </button>
  );
}
