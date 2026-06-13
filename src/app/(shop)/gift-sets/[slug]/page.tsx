'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Gift, Package, ShoppingBag, Zap, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useGiftSetBySlug } from '@/lib/hooks/useGiftSets';
import { useCart } from '@/lib/hooks/useCart';
import { giftSetToPackageCartItem } from '@/lib/cart/packageCartItem';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { resolveCmsMediaUrl } from '@/lib/utils/cmsMediaUrl';
import {
  giftSetOccasionLabel,
  isGiftSetInStock,
  resolveGiftSetItemDetails,
} from '@/lib/gift-set/giftSetItemDetails';
import { PackageGallery } from '@/components/package/PackageGallery';
import { OutlineSkeleton } from '@/components/loading';

export default function GiftSetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: giftSet, isLoading, isError } = useGiftSetBySlug(slug);
  const { addPackageItem } = useCart();
  const [addedState, setAddedState] = useState<'idle' | 'loading' | 'success'>('idle');

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="aspect-square bg-gray-100" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-100 rounded w-2/3" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-12 bg-gray-100 rounded w-1/3 mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !giftSet) {
    notFound();
  }

  const activeGiftSet = giftSet;

  const hasDiscount = activeGiftSet.mrp > activeGiftSet.giftSetPrice;
  const savings = hasDiscount ? activeGiftSet.mrp - activeGiftSet.giftSetPrice : 0;
  const itemDetails = (activeGiftSet.items ?? []).map(resolveGiftSetItemDetails);
  const inStock = isGiftSetInStock(activeGiftSet.items ?? []);
  const canAddToCart = inStock && itemDetails.length > 0;
  const giftSetName = activeGiftSet.name;

  const detailsText =
    activeGiftSet.description?.trim() ||
    `This curated gift set includes ${itemDetails.length} ${
      itemDetails.length === 1 ? 'fragrance' : 'fragrances'
    }, beautifully packaged and ready to gift.`;

  async function addGiftSetToCart() {
    if (!canAddToCart) return;
    setAddedState('loading');
    await new Promise((r) => setTimeout(r, 350));
    addPackageItem(giftSetToPackageCartItem(activeGiftSet));
    setAddedState('success');
    toast.success(`${giftSetName} added to cart`, {
      style: {
        background: '#1A0A2E',
        color: '#FAF8F5',
        border: '1px solid rgba(201,168,76,0.25)',
        fontSize: '13px',
      },
      duration: 2500,
    });
    setTimeout(() => setAddedState('idle'), 2000);
  }

  function handleBuyNow() {
    if (!canAddToCart) return;
    addPackageItem(giftSetToPackageCartItem(activeGiftSet));
    router.push('/checkout');
  }

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <nav className="flex items-center gap-1.5 text-xs mb-8" style={{ color: '#6B6B6B' }}>
          <Link href="/" className="hover:underline">Home</Link>
          <ChevronRight size={12} />
          <Link href="/gift-sets" className="hover:underline">Gift Sets</Link>
          <ChevronRight size={12} />
          <span style={{ color: '#1A0A2E' }}>{giftSet.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PackageGallery images={giftSet.images ?? []} name={giftSet.name} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 mb-4"
              style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}
            >
              <Gift size={12} />
              {giftSetOccasionLabel(giftSet.occasion)}
            </span>

            <div className="flex items-start gap-2 mb-2">
              <h1
                className="text-3xl md:text-4xl font-light"
                style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}
              >
                {giftSet.name}
              </h1>
              {inStock && (
                <span className="w-3 h-3 rounded-full bg-green-500 shrink-0 mt-3" />
              )}
            </div>

            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B6B6B' }}>
              {detailsText}
            </p>

            <p className="text-xs mb-4" style={{ color: '#78716C' }}>
              {itemDetails.length} {itemDetails.length === 1 ? 'item' : 'items'} included
              {hasDiscount ? ` · Save ${formatCurrency(savings)}` : ''}
            </p>

            <div
              className="p-5 mb-4"
              style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: '#9B9B9B' }}>
                Package Price
              </p>
              <div className="flex items-end gap-3 flex-wrap">
                <p className="text-3xl font-semibold" style={{ color: '#1A0A2E' }}>
                  {formatCurrency(giftSet.giftSetPrice)}
                </p>
                {hasDiscount && (
                  <>
                    <p className="text-sm line-through pb-1" style={{ color: '#9B9B9B' }}>
                      {formatCurrency(giftSet.mrp)}
                    </p>
                    <p className="text-xs font-semibold pb-1" style={{ color: '#C9A84C' }}>
                      You save {formatCurrency(savings)}
                    </p>
                  </>
                )}
              </div>
              <p className="text-xs mt-2" style={{ color: '#6B6B6B' }}>
                SKU: {giftSet.sku}
              </p>
              {!inStock && (
                <p className="text-xs mt-2 font-medium" style={{ color: '#DC2626' }}>
                  One or more items in this gift set are currently out of stock.
                </p>
              )}
            </div>

            <div className="h-px my-4" style={{ backgroundColor: '#EEEBE6' }} />

            <button
              type="button"
              onClick={addGiftSetToCart}
              disabled={addedState !== 'idle' || !canAddToCart}
              className="w-full flex items-center justify-center gap-2.5 font-semibold transition-all duration-300 disabled:opacity-50 mb-2.5 hover:bg-gray-50"
              style={{
                height: 48,
                border: '2px solid #1A0A2E',
                backgroundColor: addedState === 'success' ? '#F0FDF4' : '#fff',
                color: addedState === 'success' ? '#15803d' : '#1A0A2E',
                fontSize: 14,
                borderRadius: 4,
              }}
            >
              <AnimatePresence mode="wait">
                {addedState === 'loading' && (
                  <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <span className="w-4 h-4 border-2 border-[#1A0A2E]/30 border-t-[#1A0A2E] rounded-full animate-spin block" />
                  </motion.span>
                )}
                {addedState === 'success' && (
                  <motion.span
                    key="s"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CheckCircle size={17} /> Added to Cart
                  </motion.span>
                )}
                {addedState === 'idle' && (
                  <motion.span
                    key="i"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ShoppingBag size={17} /> Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!canAddToCart}
              className="w-full flex items-center justify-center gap-2 font-semibold transition-all hover:opacity-90 disabled:opacity-50 mb-4"
              style={{ height: 48, backgroundColor: '#1A0A2E', color: '#fff', fontSize: 14, borderRadius: 4 }}
            >
              <Zap size={17} />
              Buy Now
            </button>

            <div
              className="grid grid-cols-2 gap-0 rounded overflow-hidden mb-6"
              style={{ border: '1px solid #EEEBE6' }}
            >
              {[
                { icon: '🎁', label: 'Gift Wrapping', sub: 'Complimentary' },
                { icon: '✨', label: '100% Authentic', sub: 'Original guaranteed' },
                { icon: '💵', label: 'Cash On Delivery', sub: 'Available' },
                { icon: '🎧', label: '24/7 Support', sub: 'Always here' },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2.5 px-3 py-3"
                  style={{ backgroundColor: '#FAFAF8', borderRight: '1px solid #EEEBE6', borderBottom: '1px solid #EEEBE6' }}
                >
                  <span className="text-base">{badge.icon}</span>
                  <div>
                    <p className="text-[11px] font-semibold" style={{ color: '#1A0A2E' }}>{badge.label}</p>
                    <p className="text-[10px]" style={{ color: '#78716C' }}>{badge.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/gift-sets"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
              style={{ color: '#1A0A2E' }}
            >
              Back to Gift Sets <ChevronRight size={13} />
            </Link>
          </motion.div>
        </div>

        <section className="mt-14">
          <div className="flex items-center gap-2 mb-6">
            <Package size={18} style={{ color: '#C9A84C' }} />
            <h2
              className="text-2xl font-light"
              style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}
            >
              What&apos;s <em style={{ color: '#C9A84C' }}>Included</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {itemDetails.map((item, index) => {
              const imageUrl = resolveCmsMediaUrl(item.image);
              const detailLabel = [item.variantName, item.size].filter(Boolean).join(' · ');

              return (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex gap-4 p-4"
                  style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
                >
                  <div
                    className="relative w-20 h-20 shrink-0 overflow-hidden"
                    style={{ backgroundColor: '#FAF8F5' }}
                  >
                    {imageUrl ? (
                      <Image src={imageUrl} alt={item.name} fill className="object-cover" unoptimized />
                    ) : (
                      <OutlineSkeleton className="absolute inset-0 rounded-none border-0" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.16em] mb-1" style={{ color: '#9B9B9B' }}>
                      Qty {item.quantity}
                      {!item.inStock ? (
                        <span className="ml-2" style={{ color: '#DC2626' }}>Out of stock</span>
                      ) : null}
                    </p>
                    {item.slug ? (
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-semibold hover:underline line-clamp-2"
                        style={{ color: '#1A0A2E' }}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <p className="text-sm font-semibold line-clamp-2" style={{ color: '#1A0A2E' }}>
                        {item.name}
                      </p>
                    )}
                    {item.brand && (
                      <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>
                        {item.brand}
                      </p>
                    )}
                    {detailLabel && (
                      <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
                        {detailLabel}
                      </p>
                    )}
                    {item.unitPrice > 0 && (
                      <p className="text-xs mt-2 font-medium" style={{ color: '#1A0A2E' }}>
                        {formatCurrency(item.unitPrice)} each
                        {item.quantity > 1 ? ` · ${formatCurrency(item.lineTotal)} total` : ''}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
