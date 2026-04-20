'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { removeItem } from '@/lib/store/wishlistSlice';
import { addItem as addToCart } from '@/lib/store/cartSlice';
import { products } from '@/lib/data/products';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function WishlistPage() {
  const dispatch     = useDispatch();
  const wishlistIds  = useSelector((state: RootState) => state.wishlist.items);
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  function handleRemove(productId: string, name: string) {
    dispatch(removeItem(productId));
    toast(`Removed from wishlist`, { description: name });
  }

  function handleAddToCart(product: typeof products[0]) {
    const variant = product.variants[0];
    dispatch(addToCart({ product, variant, quantity: 1 }));
    toast.success(`Added to cart`, { description: product.name });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F5' }}>
      {/* Page header */}
      <div
        className="py-12 px-5"
        style={{
          background: 'linear-gradient(135deg, #1A0A2E 0%, #0D0A08 100%)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <p className="text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(201,168,76,0.55)' }}>
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <span className="mx-2 opacity-40">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Wishlist</span>
          </p>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Heart size={18} style={{ color: '#C9A84C' }} />
                <h1
                  className="text-3xl md:text-4xl font-light text-white"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  My Wishlist
                </h1>
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>

            {wishlistProducts.length > 0 && (
              <Link
                href="/products"
                className="hidden sm:flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase px-5 py-2.5 transition-all hover:brightness-110"
                style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
              >
                Continue Shopping
                <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Empty state */}
        {wishlistProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}
            >
              <Heart size={32} style={{ color: 'rgba(201,168,76,0.5)' }} />
            </div>
            <h2
              className="text-2xl font-light mb-2"
              style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}
            >
              Your wishlist is empty
            </h2>
            <p className="text-sm mb-8 max-w-xs" style={{ color: '#6B6B6B' }}>
              Save fragrances you love by tapping the heart icon on any product.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 text-[11px] font-bold tracking-[0.2em] uppercase transition-all hover:brightness-110"
              style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
            >
              Browse Collection
              <ArrowRight size={13} />
            </Link>
          </motion.div>
        )}

        {/* Product grid */}
        {wishlistProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {wishlistProducts.map((product, i) => {
                const primary  = product.images.find((img) => img.isPrimary) ?? product.images[0];
                const variant  = product.variants[0];
                const price    = variant?.salePrice ?? variant?.price ?? 0;
                const original = variant?.price ?? 0;
                const onSale   = original > price;
                const discount = onSale ? Math.round(((original - price) / original) * 100) : 0;

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="group bg-white flex flex-col"
                    style={{ border: '1px solid #E8E3DC' }}
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#F5F2EE' }}>
                      <Link href={`/products/${product.slug}`}>
                        <Image
                          src={primary.url}
                          alt={primary.alt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      </Link>

                      {/* Badges */}
                      {onSale && (
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-black" style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}>
                          -{discount}%
                        </div>
                      )}
                      {product.isNewArrival && !onSale && (
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-black bg-emerald-600 text-white">
                          NEW
                        </div>
                      )}

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(product.id, product.name)}
                        className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                        style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1" style={{ color: '#A89880' }}>
                        {product.brand}
                      </p>
                      <Link href={`/products/${product.slug}`} className="flex-1">
                        <p className="text-sm font-medium leading-snug line-clamp-2 hover:text-[#C9A84C] transition-colors" style={{ color: '#1C1C1C' }}>
                          {product.name}
                        </p>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <svg key={s} width="11" height="11" viewBox="0 0 12 12">
                              <polygon
                                points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5"
                                fill={s < Math.round(product.rating) ? '#C9A84C' : 'none'}
                                stroke="#C9A84C"
                                strokeWidth="0.8"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[10px]" style={{ color: '#A89880' }}>({product.reviewCount})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-2 mb-3">
                        <span className="text-base font-bold" style={{ color: '#C9A84C', fontFamily: 'var(--font-heading)' }}>
                          {formatCurrency(price)}
                        </span>
                        {onSale && (
                          <span className="text-xs line-through" style={{ color: '#A89880' }}>
                            {formatCurrency(original)}
                          </span>
                        )}
                      </div>

                      {/* Add to cart */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-bold tracking-[0.16em] uppercase transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                        style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
                      >
                        <ShoppingBag size={13} />
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
