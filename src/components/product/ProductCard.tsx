'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useDispatch } from 'react-redux';
import { addToRecentlyViewed } from '@/lib/store/uiSlice';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, items: cartItems } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const dispatch = useDispatch();

  const [hovered, setHovered]                   = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [justAdded, setJustAdded]               = useState(false);
  const [imgLoaded, setImgLoaded]               = useState(false);
  const [showSecondary, setShowSecondary]       = useState(false); // mobile image tap
  const [isMobile, setIsMobile]                 = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const wishlisted    = isInWishlist(product.id);
  const primaryVariant = product.variants[selectedVariantIndex] ?? product.variants[0];

  const inCart = cartItems.some(
    (i) => i.product.id === product.id && i.variant.id === primaryVariant?.id
  );

  const price = primaryVariant?.salePrice ?? primaryVariant?.price ?? 0;
  const originalPrice =
    primaryVariant?.salePrice && primaryVariant.price > primaryVariant.salePrice
      ? primaryVariant.price
      : null;
  const primaryImage   = product.images.find((i) => i.isPrimary)?.url ?? product.images[0]?.url ?? '';
  const secondaryImage = product.images.find((i) => !i.isPrimary)?.url;
  const discountPercent =
    originalPrice && price < originalPrice
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;
  const hasMultipleVariants = product.variants.length > 1;

  // On desktop: hover controls secondary image swap
  const desktopShowSecondary = !isMobile && hovered && !!secondaryImage;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inCart || justAdded) return;
    addItem(product, primaryVariant);
    setJustAdded(true);
    toast.success(`${product.name} added to cart`, {
      style: { background: '#1A0A2E', color: '#FAF8F5', border: '1px solid rgba(201,168,76,0.25)', fontSize: '13px' },
      duration: 2500,
    });
    setTimeout(() => setJustAdded(false), 800);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const nowWishlisted = !wishlisted;
    toggleWishlist(product.id);
    toast(nowWishlisted ? 'Saved to wishlist' : 'Removed from wishlist', {
      style: { background: '#1A0A2E', color: '#FAF8F5', border: '1px solid rgba(201,168,76,0.2)', fontSize: '13px' },
      duration: 2000,
    });
  }

  function handleVariantSelect(e: React.MouseEvent, idx: number) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVariantIndex(idx);
  }

  function handleImageTap(e: React.MouseEvent) {
    if (!isMobile || !secondaryImage) return;
    e.preventDefault();
    setShowSecondary((v) => !v);
  }

  // The add panel is always visible on mobile, hover-triggered on desktop
  const showPanel = isMobile || hovered;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
    >
      {/* ── IMAGE BLOCK ─────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '3 / 4', backgroundColor: '#F5F2EE' }}
      >
        <Link
          href={`/products/${product.slug}`}
          onClick={(e) => {
            dispatch(addToRecentlyViewed(product.id));
            if (isMobile && secondaryImage) handleImageTap(e);
          }}
          className="block w-full h-full"
        >
          {/* Loading shimmer */}
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: '#EDEBE7' }} />
          )}

          {/* Primary image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            style={{
              opacity: imgLoaded ? (desktopShowSecondary || (isMobile && showSecondary) ? 0 : 1) : 0,
              transform: hovered && !isMobile ? 'scale(1.05)' : 'scale(1)',
              transition: 'opacity 0.45s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            onLoad={() => setImgLoaded(true)}
          />

          {/* Secondary image */}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              style={{
                opacity: desktopShowSecondary || (isMobile && showSecondary) ? 1 : 0,
                transform: hovered && !isMobile ? 'scale(1.05)' : 'scale(1)',
                transition: 'opacity 0.45s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          )}
        </Link>

        {/* Mobile image dots indicator */}
        {isMobile && secondaryImage && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            <div
              className="rounded-full transition-all duration-300"
              style={{ width: showSecondary ? 6 : 8, height: showSecondary ? 6 : 8, backgroundColor: showSecondary ? 'rgba(255,255,255,0.5)' : '#fff' }}
            />
            <div
              className="rounded-full transition-all duration-300"
              style={{ width: showSecondary ? 8 : 6, height: showSecondary ? 8 : 6, backgroundColor: showSecondary ? '#fff' : 'rgba(255,255,255,0.5)' }}
            />
          </div>
        )}

        {/* Badges */}
        {(discountPercent || product.isNewArrival || product.isBestseller) && (
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
            {discountPercent && (
              <span className="text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5" style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}>
                −{discountPercent}%
              </span>
            )}
            {product.isNewArrival && !discountPercent && (
              <span className="text-[9px] font-medium tracking-[0.12em] uppercase px-2 py-0.5" style={{ backgroundColor: 'rgba(250,248,245,0.92)', color: '#1A0A2E' }}>
                New
              </span>
            )}
            {product.isBestseller && !discountPercent && !product.isNewArrival && (
              <span className="text-[9px] font-medium tracking-[0.12em] uppercase px-2 py-0.5" style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>
                Best Seller
              </span>
            )}
          </div>
        )}

        {/* Wishlist — always visible on mobile, hover on desktop */}
        <AnimatePresence>
          {(hovered || wishlisted || isMobile) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={handleWishlist}
              className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center bg-white rounded-full"
              style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.12)' }}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={14} fill={wishlisted ? '#ef4444' : 'none'} style={{ color: wishlisted ? '#ef4444' : '#1C1C1C' }} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── ADD PANEL — always visible on mobile, slide-up on desktop ── */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={isMobile ? false : { y: '100%' }}
              animate={{ y: 0 }}
              exit={isMobile ? undefined : { y: '100%' }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between gap-2 px-3 py-2"
                style={{
                  backgroundColor: 'rgba(250,248,245,0.96)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                {/* Variant size pills */}
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  {hasMultipleVariants ? (
                    product.variants.map((v, idx) => (
                      <button
                        key={v.id}
                        onClick={(e) => handleVariantSelect(e, idx)}
                        className="text-[9px] font-semibold tracking-wider uppercase px-2 py-1 transition-all duration-150 shrink-0"
                        style={{
                          backgroundColor: selectedVariantIndex === idx ? '#1A0A2E' : 'transparent',
                          color: selectedVariantIndex === idx ? 'white' : '#6B6B6B',
                          border: `1px solid ${selectedVariantIndex === idx ? '#1A0A2E' : '#D1CBC1'}`,
                        }}
                      >
                        {v.sizeMl > 0 ? `${v.sizeMl}ml` : v.concentration}
                      </button>
                    ))
                  ) : (
                    <span className="text-[10px] tracking-wide" style={{ color: '#6B6B6B' }}>
                      {product.variants[0]?.sizeMl > 0
                        ? `${product.variants[0].sizeMl}ml`
                        : product.variants[0]?.concentration ?? ''}
                    </span>
                  )}
                </div>

                {/* Circular add / in-cart button */}
                <motion.button
                  onClick={handleAddToCart}
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                  style={{
                    backgroundColor: inCart || justAdded ? '#16a34a' : '#1A0A2E',
                    color: 'white',
                    cursor: inCart ? 'default' : 'pointer',
                  }}
                  whileTap={inCart ? {} : { scale: 0.88 }}
                  aria-label={inCart ? 'Already in cart' : 'Add to cart'}
                >
                  <AnimatePresence mode="wait">
                    {inCart || justAdded ? (
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── TEXT DETAILS ────────────────────────────── */}
      <div className="pt-3">
        <p className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: '#A89880' }}>
          {product.brand}
        </p>
        <Link href={`/products/${product.slug}`} className="block group/name">
          <h3
            className="text-sm font-normal leading-tight line-clamp-1 transition-opacity duration-200 group-hover/name:opacity-50"
            style={{ color: '#1C1C1C' }}
          >
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-medium tabular-nums" style={{ color: originalPrice ? '#1A0A2E' : '#1C1C1C' }}>
            {formatCurrency(price)}
          </span>
          {originalPrice && (
            <span className="text-xs line-through tabular-nums" style={{ color: '#B8B0A5' }}>
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
