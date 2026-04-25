'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { removeItem } from '@/lib/store/wishlistSlice';
import { addItem as addToCart } from '@/lib/store/cartSlice';
import { useProductsByIds } from '@/lib/hooks/useApiProducts';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, Check, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useState } from 'react';

import { Product } from '@/types/product';

// Per-card stateful add button — same circular style as ProductCard
function WishlistAddButton({ product, inCart }: { product: Product; inCart: boolean }) {
  const dispatch = useDispatch();
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCart || justAdded) return;
    dispatch(addToCart({ product, variant: product.variants[0], quantity: 1 }));
    setJustAdded(true);
    toast.success(`Added to cart`, {
      description: product.name,
      style: { background: '#1A0A2E', color: '#FAF8F5', border: '1px solid rgba(201,168,76,0.25)', fontSize: '13px' },
      duration: 2500,
    });
    setTimeout(() => setJustAdded(false), 800);
  }

  const checked = inCart || justAdded;

  return (
    <motion.button
      onClick={handleAdd}
      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
      style={{ backgroundColor: checked ? '#16a34a' : '#1A0A2E', color: 'white', cursor: inCart ? 'default' : 'pointer' }}
      whileTap={inCart ? {} : { scale: 0.88 }}
      aria-label={inCart ? 'Already in cart' : 'Add to cart'}
    >
      <AnimatePresence mode="wait">
        {checked ? (
          <motion.span key="check" initial={{ scale: 0, rotate: -60 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.22, ease: 'backOut' }}>
            <Check size={15} strokeWidth={2.5} />
          </motion.span>
        ) : (
          <motion.span key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.15 }}>
            <Plus size={15} strokeWidth={2} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function WishlistPage() {
  const dispatch    = useDispatch();
  const wishlistIds = useSelector((state: RootState) => state.wishlist.items);
  const cartItems   = useSelector((state: RootState) => state.cart.items);
  const { products: wishlistProducts, isLoading } = useProductsByIds(wishlistIds);

  // Check if a specific variant is already in cart
  function isVariantInCart(productId: string, variantId: string) {
    return cartItems.some((i) => i.product.id === productId && i.variant.id === variantId);
  }

  function handleRemove(productId: string, name: string) {
    dispatch(removeItem(productId));
    toast(`Removed from wishlist`, { description: name });
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
                {wishlistIds.length} {wishlistIds.length === 1 ? 'item' : 'items'} saved
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
        {/* Loading skeletons */}
        {isLoading && wishlistIds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlistIds.map((id) => (
              <div key={id} className="aspect-[3/4] bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && wishlistIds.length === 0 && (
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
        {!isLoading && wishlistProducts.length > 0 && (
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

                      {/* Add to Cart — same circular button as ProductCard */}
                      {(() => {
                        const defaultVariant = product.variants[0];
                        const variantInCart  = isVariantInCart(product.id, defaultVariant?.id);
                        return (
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] uppercase tracking-wider" style={{ color: variantInCart ? '#16a34a' : 'transparent' }}>
                              {variantInCart ? '✓ In cart' : ''}
                            </span>
                            <WishlistAddButton product={product} inCart={variantInCart} />
                          </div>
                        );
                      })()}
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
