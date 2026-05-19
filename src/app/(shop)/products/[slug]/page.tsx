'use client';

import { useState, use, useEffect, useRef } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag, Heart, CheckCircle, Truck,
  Copy, Check, Star, ChevronRight,
  ZoomIn, Share2, ChevronDown, ChevronUp, Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { ReviewCard } from '@/components/product/ReviewCard';
import { RelatedProductsFromApi, PeopleAlsoBoughtFromApi } from '@/components/product/ProductRecommendations';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { useDispatch } from 'react-redux';
import { addToRecentlyViewed } from '@/lib/store/uiSlice';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { ProductVariant } from '@/types/product';
import { useApiProductBySlug, useProductReviews } from '@/lib/hooks/useApiProducts';
import { usePromotions } from '@/lib/hooks/useApiPromotions';
import { ApiPromotion } from '@/lib/api/types';

/* ── helpers ── */
function getLongevity(c: string) {
  if (c === 'Parfum') return '7+ Hrs*';
  if (c === 'EDP') return '6+ Hrs*';
  if (c === 'Attar') return '10+ Hrs*';
  return '4+ Hrs*';
}
function getSeason(f: string) {
  const s = f.toLowerCase();
  if (s.includes('oud') || s.includes('wood') || s.includes('leather') || s.includes('amber')) return 'Autumn and Winter';
  if (s.includes('floral') || s.includes('citrus') || s.includes('fresh')) return 'Spring and Summer';
  return 'All Seasons';
}
function getOccasion(f: string) {
  const s = f.toLowerCase();
  if (s.includes('oud') || s.includes('leather')) return 'Evening Wear';
  if (s.includes('fresh') || s.includes('citrus')) return 'Daily Wear';
  return 'Evening and Special Occasions';
}
function getSillage(c: string) {
  if (c === 'Parfum') return 'Heavy';
  if (c === 'EDP') return 'Moderate';
  return 'Moderate';
}

/* ══════════════════════════════════════
   GALLERY
══════════════════════════════════════ */
function Gallery({ images, name }: { images: { url: string; alt: string }[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-2.5">
      {/* Vertical thumbnail strip */}
      <div className="flex flex-col gap-2 flex-shrink-0" style={{ width: 60 }}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="relative overflow-hidden flex-shrink-0 transition-all"
            style={{
              width: 60, height: 60,
              border: i === active ? '2px solid #1A0A2E' : '1.5px solid #E0DBDA',
              backgroundColor: '#F8F8F8',
            }}
          >
            <Image src={img.url} alt={`${name} ${i + 1}`} fill className="object-contain p-1" unoptimized />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: '#F8F8F8' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <Image
                src={images[active]?.url ?? ''}
                alt={name}
                fill
                className="object-contain p-10"
                priority
                unoptimized
              />
            </motion.div>
          </AnimatePresence>

          {/* Top-right icons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
              onClick={() => navigator.share?.({ title: name, url: window.location.href })}
            >
              <Share2 size={14} style={{ color: '#555' }} />
            </button>
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <Heart size={14} style={{ color: '#555' }} />
            </button>
          </div>

          {/* Bottom-right zoom */}
          <button className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
            <ZoomIn size={14} style={{ color: '#555' }} />
          </button>
        </div>

        {/* Mobile dots */}
        {images.length > 1 && (
          <div className="flex md:hidden justify-center gap-2 mt-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-full transition-all"
                style={{ width: i === active ? 18 : 6, height: 6, backgroundColor: i === active ? '#1A0A2E' : '#D4CAC0' }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   COUPON CARD  (2-column grid style)
══════════════════════════════════════ */
function CouponCard({ code, discount, type, description, accent }: {
  code: string; discount: number; type: string; description: string; accent?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(`Code "${code}" copied!`);
  }

  const label = type === 'freeshipping' ? 'Free Shipping' : `Flat Discount AED ${Math.round(discount * 500)}`;
  const subLabel = type === 'freeshipping' ? 'On all orders' : description;

  return (
    <div
      className="flex flex-col justify-between p-2.5 rounded cursor-pointer hover:opacity-90 transition-opacity"
      style={{
        border: `1px solid ${accent ? '#F5C842' : '#E0DBDA'}`,
        backgroundColor: accent ? '#FFF8DC' : '#fff',
        minHeight: 80,
      }}
      onClick={copy}
    >
      <div className="flex items-start gap-2 mb-2">
        <div
          className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold"
          style={{ backgroundColor: accent ? '#D97706' : '#1A0A2E' }}
        >
          {type === 'freeshipping' ? <Truck size={12} /> : '%'}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold leading-tight" style={{ color: '#1A0A2E' }}>{label}</p>
          <p className="text-[10px] leading-tight mt-0.5" style={{ color: '#78716C' }}>{subLabel}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <code className="text-[10px] font-bold tracking-wider" style={{ color: accent ? '#92400E' : '#44403C' }}>
          {code}
        </code>
        <button
          className="flex items-center gap-1 text-[10px] font-semibold"
          style={{ color: copied ? '#16a34a' : '#1A0A2E' }}
        >
          {copied ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   RATING BARS
══════════════════════════════════════ */
function RatingBars({ reviews }: { reviews: { rating: number }[] }) {
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const pct = reviews.length ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-2">
            <span className="text-[12px] w-3 text-right flex-shrink-0" style={{ color: '#78716C' }}>{star}</span>
            <Star size={10} fill="#F59E0B" stroke="#F59E0B" strokeWidth={1} />
            <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-100">
              <motion.div className="h-full rounded-full bg-amber-400" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }} />
            </div>
            <span className="text-[11px] w-7 text-right flex-shrink-0" style={{ color: '#78716C' }}>{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
function promotionToCoupon(p: ApiPromotion) {
  const type =
    p.kind === 'free_shipping' ? 'freeshipping' : p.kind === 'percent_off' ? 'percentage' : 'fixed';
  const discount = p.kind === 'percent_off' ? p.value / 100 : p.value;
  return { code: p.code, discount, type, description: p.name };
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: product, isLoading, isError } = useApiProductBySlug(slug);
  const { data: apiReviews = [] } = useProductReviews(product?.id ?? '');
  const { data: promotions = [] } = usePromotions();

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const dispatch = useDispatch();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity] = useState(1);
  const [addedState, setAddedState] = useState<'idle' | 'loading' | 'success'>('idle');
  const addToCartRef = useRef<HTMLButtonElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(true);
  const [couponOpen, setCouponOpen] = useState(true);
  const [deliveryTab, setDeliveryTab] = useState<'standard' | 'express'>('standard');
  const [activeTab, setActiveTab] = useState<'specs' | 'notes' | 'about' | 'howtouse' | 'reviews' | 'faqs'>('specs');
  const [visibleReviews, setVisibleReviews] = useState(4);

  useEffect(() => {
    if (product?.variants[0]) setSelectedVariant(product.variants[0]);
  }, [product?.id, product?.variants]);

  useEffect(() => {
    if (product?.id) dispatch(addToRecentlyViewed(product.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  useEffect(() => {
    const el = addToCartRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setShowStickyBar(!e.isIntersecting), { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (isLoading) {
    return (
      <motion.div className="min-h-screen flex items-center justify-center bg-white">
        <span className="w-10 h-10 border-2 border-[#1A0A2E]/20 border-t-[#1A0A2E] rounded-full animate-spin" />
      </motion.div>
    );
  }

  if (isError || !product) return notFound();

  const displayReviews = apiReviews;
  const couponList = promotions.slice(0, 4).map(promotionToCoupon);
  const brandHref = product.brandSlug
    ? `/brands/${product.brandSlug}`
    : `/products?search=${encodeURIComponent(product.brand)}`;

  const variant = selectedVariant ?? product.variants[0];
  const price = variant?.salePrice ?? variant?.price ?? 0;
  const originalPrice = variant?.salePrice && variant.salePrice < variant.price ? variant.price : null;
  const discountPct = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
  const wishlisted = isInWishlist(product.id);
  const uniqueSizes = Array.from(new Map(product.variants.map((v) => [v.sizeMl, v])).values());
  const inStock = (variant?.stock ?? 0) > 0;

  // Derived spec fields
  const longevity = getLongevity(product.concentration);
  const season = getSeason(product.fragranceFamily);
  const occasion = getOccasion(product.fragranceFamily);
  const sillage = getSillage(product.concentration);

  const specs = [
    { label: 'Design House', value: product.brand },
    { label: 'Perfumer', value: 'In-house Perfumer' },
    { label: 'Release Year', value: '2023' },
    { label: 'Volume', value: `${variant?.sizeMl ?? uniqueSizes[0]?.sizeMl}ML` },
    { label: 'Concentration', value: product.concentration },
    { label: 'Fragrance Family', value: product.fragranceFamily },
    { label: 'Gender', value: product.gender.charAt(0).toUpperCase() + product.gender.slice(1) },
    { label: 'Projection/Longevity', value: longevity },
    { label: 'Occasion', value: occasion },
    { label: 'Best Before', value: 'Recommended use within 36 months of opening for optimal quality and freshness.*' },
    { label: 'Age Group', value: '25+' },
    { label: 'Season', value: season },
    { label: 'Scent Sillage', value: sillage },
  ];

  const TABS = [
    { id: 'specs' as const, label: 'KEY SPECIFICATIONS' },
    { id: 'notes' as const, label: 'NOTES' },
    { id: 'about' as const, label: 'ABOUT' },
    { id: 'howtouse' as const, label: 'HOW TO USE' },
    { id: 'reviews' as const, label: 'REVIEWS' },
    { id: 'faqs' as const, label: "FAQ'S" },
  ];

  async function handleAddToCart() {
    if (!product || !variant) return;
    setAddedState('loading');
    await new Promise((r) => setTimeout(r, 350));
    addItem(product, variant, quantity);
    setAddedState('success');
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAddedState('idle'), 2000);
  }

  function handleBuyNow() {
    if (!product || !variant) return;
    addItem(product, variant, quantity);
    router.push('/checkout');
  }

  /* ── Delivery date helper ── */
  const today = new Date();
  const d1 = new Date(today); d1.setDate(today.getDate() + 2);
  const d2 = new Date(today); d2.setDate(today.getDate() + 5);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const deliveryRange = `${fmt(d1)} - ${fmt(d2)}`;

  /* ══════════════════════════════════════
     RIGHT PANEL (reused desktop+mobile)
  ══════════════════════════════════════ */
  const RightPanel = () => (
    <div className="flex flex-col">

      {/* Brand */}
      <Link
        href={brandHref}
        className="text-[13px] font-semibold mb-1 hover:underline inline-block"
        style={{ color: '#1A0A2E' }}
      >
        {product.brand}
      </Link>

      {/* Name + in-stock dot */}
      <div className="flex items-start gap-2 mb-1">
        <h1 className="text-[1.4rem] font-bold leading-snug" style={{ color: '#1A0A2E' }}>
          {product.name}
        </h1>
        {inStock && (
          <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0 mt-2" />
        )}
      </div>

      {/* Short description */}
      <p className="text-[13px] mb-2 leading-relaxed" style={{ color: '#78716C' }}>
        {product.description.split('.')[0]}.
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mb-4">
        <Star size={13} fill="#F59E0B" stroke="#F59E0B" strokeWidth={1.5} />
        <span className="text-[13px]" style={{ color: '#44403C' }}>{product.rating.toFixed(1)}</span>
        <a href="#tab-reviews" onClick={() => setActiveTab('reviews')} className="text-[13px] hover:underline" style={{ color: '#78716C' }}>
          ({product.reviewCount.toLocaleString()} reviews)
        </a>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 mb-1">
        <span className="text-[1.8rem] font-bold leading-none" style={{ color: '#1A0A2E' }}>
          {formatCurrency(price)}
        </span>
        {originalPrice && (
          <span className="text-base line-through" style={{ color: '#A8A29E' }}>
            {formatCurrency(originalPrice)}
          </span>
        )}
        {discountPct && (
          <span className="text-[12px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
            {discountPct}% OFF
          </span>
        )}
      </div>
      {product.isBestseller && (
        <p className="text-[11px] mb-3" style={{ color: '#D97706' }}>🏆 Bestseller · {product.reviewCount}+ sold</p>
      )}

      {/* Divider */}
      <div className="h-px my-3" style={{ backgroundColor: '#EEEBE6' }} />

      {/* Size selector */}
      {uniqueSizes.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {uniqueSizes.map((v) => {
              const sel = variant?.sizeMl === v.sizeMl;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className="px-4 py-1.5 text-[13px] font-semibold transition-all"
                  style={{
                    border: sel ? '2px solid #1A0A2E' : '1.5px solid #D6D3D1',
                    backgroundColor: sel ? '#1A0A2E' : '#fff',
                    color: sel ? '#fff' : '#44403C',
                    borderRadius: 4,
                  }}
                >
                  {v.sizeMl}ML
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px mb-3" style={{ backgroundColor: '#EEEBE6' }} />

      {/* Deliver to row */}
      <div className="flex flex-wrap items-center gap-1.5 text-[12px] mb-3" style={{ color: '#44403C' }}>
        <span className="font-medium">Deliver to:</span>
        <span className="flex items-center gap-0.5 font-semibold cursor-pointer hover:underline" style={{ color: '#1A0A2E' }}>
          UAE <ChevronDown size={12} />
        </span>
        <span style={{ color: '#D6D3D1' }}>·</span>
        <span className="flex items-center gap-0.5 cursor-pointer hover:underline" style={{ color: '#1A0A2E' }}>
          State: Dubai <ChevronDown size={12} />
        </span>
        <span style={{ color: '#D6D3D1' }}>·</span>
        <span className="flex items-center gap-0.5 cursor-pointer hover:underline" style={{ color: '#1A0A2E' }}>
          City: Dubai City <ChevronDown size={12} />
        </span>
      </div>

      {/* Delivery Type collapsible */}
      <div className="mb-3 rounded overflow-hidden" style={{ border: '1px solid #EEEBE6' }}>
        <button
          onClick={() => setDeliveryOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-white hover:bg-gray-50 transition-colors"
        >
          <span className="text-[13px] font-semibold" style={{ color: '#1A0A2E' }}>Delivery Type</span>
          {deliveryOpen ? <ChevronUp size={14} style={{ color: '#78716C' }} /> : <ChevronDown size={14} style={{ color: '#78716C' }} />}
        </button>
        <AnimatePresence>
          {deliveryOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
              transition={{ duration: 0.2 }}
            >
              <div className="px-3 pb-3 bg-white">
                {/* Tabs */}
                <div className="flex gap-0 mb-2 border-b" style={{ borderColor: '#EEEBE6' }}>
                  {(['standard', 'express'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setDeliveryTab(t)}
                      className="px-4 py-2 text-[12px] font-semibold capitalize transition-colors relative"
                      style={{ color: deliveryTab === t ? '#1A0A2E' : '#78716C' }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                      {deliveryTab === t && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A0A2E]" />
                      )}
                    </button>
                  ))}
                </div>
                {deliveryTab === 'standard' ? (
                  <div className="flex items-center gap-2">
                    <Truck size={14} style={{ color: '#16a34a' }} />
                    <span className="text-[12px]" style={{ color: '#16a34a' }}>
                      {price >= 200 ? 'Free · ' : 'AED 25 · '}
                      Delivered between {deliveryRange}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Truck size={14} style={{ color: '#D97706' }} />
                    <span className="text-[12px]" style={{ color: '#D97706' }}>
                      AED 35 · Same day / Next day delivery
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save Extra with Coupons */}
      <div className="mb-4 rounded overflow-hidden" style={{ border: '1px solid #EEEBE6' }}>
        <button
          onClick={() => setCouponOpen((v) => !v)}
          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors"
          style={{ backgroundColor: '#fff' }}
        >
          <span className="text-[13px] font-semibold" style={{ color: '#1A0A2E' }}>
            💰 Save Extra with Coupons
          </span>
          {couponOpen ? <ChevronUp size={14} style={{ color: '#78716C' }} /> : <ChevronDown size={14} style={{ color: '#78716C' }} />}
        </button>
        <AnimatePresence>
          {couponOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
              transition={{ duration: 0.2 }}
            >
              <div className="p-2.5 bg-white">
                <div className="grid grid-cols-2 gap-2">
                  {couponList.map((data, i) => (
                    <CouponCard
                      key={data.code}
                      code={data.code}
                      discount={data.discount}
                      type={data.type}
                      description={data.description}
                      accent={i % 2 === 1}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add to Cart — outlined */}
      <button
        ref={addToCartRef}
        onClick={handleAddToCart}
        disabled={addedState !== 'idle' || !inStock}
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
            <motion.span key="s" className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <CheckCircle size={17} /> Added to Cart
            </motion.span>
          )}
          {addedState === 'idle' && (
            <motion.span key="i" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ShoppingBag size={17} /> Add to cart
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Buy Now — solid black */}
      <button
        onClick={handleBuyNow}
        disabled={!inStock}
        className="w-full flex items-center justify-center gap-2 font-semibold transition-all hover:opacity-90 disabled:opacity-50 mb-3"
        style={{ height: 48, backgroundColor: '#1A0A2E', color: '#fff', fontSize: 14, borderRadius: 4 }}
      >
        <Zap size={17} />
        Buy Now
      </button>

      {/* Wishlist */}
      <button
        onClick={() => { toggleWishlist(product.id); toast.success(wishlisted ? 'Removed' : 'Saved to wishlist'); }}
        className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold transition-all hover:bg-gray-50 mb-4"
        style={{ height: 40, border: '1.5px solid #D6D3D1', color: wishlisted ? '#b91c1c' : '#44403C', borderRadius: 4 }}
      >
        <Heart size={15} fill={wishlisted ? '#b91c1c' : 'none'} style={{ color: wishlisted ? '#b91c1c' : '#78716C' }} />
        {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
      </button>

      {/* BNPL — Tamara + Tabby */}
      <div className="rounded p-3 mb-4 flex flex-col gap-2" style={{ backgroundColor: '#FAFAF8', border: '1px solid #EEEBE6' }}>
        {/* Tamara */}
        <div className="flex items-center gap-2 text-[12px]" style={{ color: '#44403C' }}>
          <span>Or split in 4 payments of</span>
          <span className="font-bold" style={{ color: '#1A0A2E' }}>{formatCurrency(price / 4)}</span>
          <span>— No late fees.</span>
          <span className="font-black text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: '#00A67E', color: '#fff' }}>tamara</span>
        </div>
        {/* Tabby */}
        <div className="flex items-center gap-2 text-[12px]" style={{ color: '#44403C' }}>
          <span>As low as</span>
          <span className="font-bold" style={{ color: '#1A0A2E' }}>{formatCurrency(price / 4)}</span>
          <span>or 4 interest-free payments.</span>
          <a href="#" className="text-[11px] underline mr-1" style={{ color: '#78716C' }}>Learn more</a>
          <span className="font-black text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: '#3D1152', color: '#fff' }}>tabby</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-4 gap-0 rounded overflow-hidden" style={{ border: '1px solid #EEEBE6' }}>
        {[
          { icon: '🚚', label: 'Free Shipping', sub: 'AED 200+' },
          { icon: '💵', label: 'Cash On Delivery', sub: 'Available' },
          { icon: '🔄', label: '7-Day Returns', sub: 'Money back' },
          { icon: '🎧', label: '24/7 Support', sub: 'Always here' },
        ].map(({ icon, label, sub }, i) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 py-3 px-1 text-center"
            style={{ borderRight: i < 3 ? '1px solid #EEEBE6' : 'none', backgroundColor: '#FAFAF8' }}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-[9.5px] font-bold leading-tight" style={{ color: '#1A0A2E' }}>{label}</span>
            <span className="text-[9px]" style={{ color: '#9A8E80' }}>{sub}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">

      {/* ── Breadcrumb ── */}
      <div className="border-b" style={{ borderColor: '#E8E3DC' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-9 flex items-center">
          <nav className="flex items-center gap-1.5 text-[12px]" style={{ color: '#78716C' }}>
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight size={11} />
            <Link href="/products" className="hover:underline">Fragrances</Link>
            <ChevronRight size={11} />
            <span className="font-medium truncate max-w-[220px]" style={{ color: '#1A0A2E' }}>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] gap-6 lg:gap-10 items-start">

          {/* LEFT — Gallery (scrolls) */}
          <div>
            <Gallery images={product.images} name={product.name} />

            {/* Mobile: purchase panel below gallery */}
            <div className="lg:hidden mt-6 pt-6 border-t" style={{ borderColor: '#EEEBE6' }}>
              <RightPanel />
            </div>
          </div>

          {/* RIGHT — Sticky purchase panel */}
          <div
            className="hidden lg:block sticky"
            style={{ top: 108, maxHeight: 'calc(100vh - 116px)', overflowY: 'auto', scrollbarWidth: 'none' }}
          >
            <RightPanel />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          TABS — full width, below main grid
      ════════════════════════════════════════════════════════ */}
      <div className="border-t" style={{ borderColor: '#E8E3DC' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">

          {/* Tab bar */}
          <div className="flex border-b overflow-x-auto" style={{ borderColor: '#E8E3DC' }}>
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                id={id === 'reviews' ? 'tab-reviews' : undefined}
                onClick={() => setActiveTab(id)}
                className="relative px-5 py-4 text-[12px] font-bold tracking-wider whitespace-nowrap transition-colors flex-shrink-0"
                style={{ color: activeTab === id ? '#1A0A2E' : '#9A8E80' }}
              >
                {label}
                {activeTab === id && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A0A2E]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="py-8">
            <AnimatePresence mode="wait">

              {/* KEY SPECIFICATIONS */}
              {activeTab === 'specs' && (
                <motion.div key="specs" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  {/* Intro paragraph */}
                  <p className="text-[14px] leading-relaxed mb-6 max-w-3xl" style={{ color: '#44403C' }}>
                    <strong style={{ color: '#1A0A2E' }}>{product.name} by {product.brand}</strong>{' '}
                    {product.description}
                  </p>

                  {/* Key Information */}
                  <h3 className="text-[15px] font-bold mb-3" style={{ color: '#1A0A2E' }}>Key Information</h3>
                  <div className="rounded overflow-hidden max-w-2xl" style={{ border: '1px solid #E0DBDA' }}>
                    <div className="grid grid-cols-2 border-b" style={{ borderColor: '#E0DBDA', backgroundColor: '#F7F7F7' }}>
                      <div className="px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider" style={{ color: '#78716C' }}>Specification</div>
                      <div className="px-4 py-2.5 text-[12px] font-bold uppercase tracking-wider border-l" style={{ color: '#78716C', borderColor: '#E0DBDA' }}>Details</div>
                    </div>
                    {specs.map(({ label, value }, i) => (
                      <div
                        key={label}
                        className="grid grid-cols-2"
                        style={{ borderBottom: i < specs.length - 1 ? '1px solid #E0DBDA' : 'none' }}
                      >
                        <div className="px-4 py-2.5 text-[13px]" style={{ color: '#44403C', backgroundColor: '#FAFAFA' }}>
                          {label}
                        </div>
                        <div className="px-4 py-2.5 text-[13px] border-l" style={{ color: '#1A0A2E', borderColor: '#E0DBDA' }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-6 max-w-2xl p-4 rounded" style={{ backgroundColor: '#FAFAFA', border: '1px solid #E0DBDA' }}>
                    <p className="text-[12px] font-semibold mb-1.5" style={{ color: '#44403C' }}>Disclaimer:</p>
                    <p className="text-[11.5px] leading-relaxed" style={{ color: '#78716C' }}>
                      * The lasting power of perfumes can vary based on skin type, environment, and usage.<br />
                      * The expiration of perfumes varies depending on storage conditions and usage.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* NOTES */}
              {activeTab === 'notes' && (
                <motion.div key="notes" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="max-w-2xl">
                  <p className="text-[13px] mb-6 leading-relaxed" style={{ color: '#78716C' }}>
                    Every fragrance is composed of three layers of scent — top, heart, and base notes — that evolve on the skin over time.
                  </p>
                  <div className="flex flex-col gap-4">
                    {[
                      { label: 'Top Notes', notes: product.topNotes, sub: 'First impression — fades within 15–30 min', bg: '#FAFAFA' },
                      { label: 'Heart Notes', notes: product.heartNotes, sub: 'The core — develops after 30 min, lasts 2–4 hrs', bg: '#F5F5F0' },
                      { label: 'Base Notes', notes: product.baseNotes, sub: 'The foundation — lasts 4–8+ hours on skin', bg: '#F0EFEA' },
                    ].map(({ label, notes, sub, bg }) => notes.length > 0 && (
                      <div key={label} className="p-4 rounded" style={{ border: '1px solid #E0DBDA', backgroundColor: bg }}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[13px] font-bold" style={{ color: '#1A0A2E' }}>{label}</p>
                          <p className="text-[11px]" style={{ color: '#9A8E80' }}>{sub}</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {notes.map((n) => (
                            <span key={n} className="text-[12px] px-3 py-1 rounded-full border bg-white" style={{ borderColor: '#E0DBDA', color: '#44403C' }}>
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ABOUT */}
              {activeTab === 'about' && (
                <motion.div key="about" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="max-w-2xl">
                  <p className="text-[14.5px] leading-[1.85]" style={{ color: '#44403C' }}>{product.description}</p>
                  <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t" style={{ borderColor: '#E0DBDA' }}>
                    {[
                      { label: 'Concentration', value: product.concentration },
                      { label: 'Family', value: product.fragranceFamily },
                      { label: 'Gender', value: product.gender },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9A8E80' }}>{label}</p>
                        <p className="text-[13px] font-semibold capitalize" style={{ color: '#1A0A2E' }}>{value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* HOW TO USE */}
              {activeTab === 'howtouse' && (
                <motion.div key="howtouse" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="max-w-xl">
                  <div className="space-y-4">
                    {[
                      { n: '01', t: 'Apply to Pulse Points', d: 'Spray 2–3 times on wrists, neck, and behind the ears where the skin is warm.' },
                      { n: '02', t: 'Correct Distance', d: 'Hold the bottle 10–15 cm from your skin for an even, fine mist.' },
                      { n: '03', t: 'Moisturise First', d: 'For best longevity, apply to moisturised skin or on top of an unscented body lotion.' },
                      { n: '04', t: 'Storage', d: 'Store in a cool, dry place away from direct sunlight and heat to preserve the fragrance.' },
                    ].map(({ n, t, d }) => (
                      <div key={n} className="flex gap-4 p-4 rounded" style={{ border: '1px solid #E0DBDA' }}>
                        <span className="text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}>
                          {n}
                        </span>
                        <div>
                          <p className="text-[13px] font-bold mb-0.5" style={{ color: '#1A0A2E' }}>{t}</p>
                          <p className="text-[13px] leading-relaxed" style={{ color: '#44403C' }}>{d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* REVIEWS */}
              {activeTab === 'reviews' && (
                <motion.div key="reviews" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <div className="flex flex-col sm:flex-row gap-6 p-5 rounded mb-6 max-w-2xl" style={{ border: '1px solid #E0DBDA', backgroundColor: '#FAFAFA' }}>
                    <div className="flex flex-col items-center justify-center gap-1.5 flex-shrink-0">
                      <span className="text-5xl font-light" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>{product.rating.toFixed(1)}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={15} fill={i < Math.round(product.rating) ? '#F59E0B' : 'none'} stroke={i < Math.round(product.rating) ? '#F59E0B' : '#D1D5DB'} strokeWidth={1.5} />
                        ))}
                      </div>
                      <span className="text-[12px]" style={{ color: '#78716C' }}>{product.reviewCount.toLocaleString()} ratings</span>
                    </div>
                    <div className="flex-1 flex items-center"><RatingBars reviews={displayReviews} /></div>
                  </div>
                  {displayReviews.length > 0 ? (
                    <>
                      {displayReviews.slice(0, visibleReviews).map((review, i) => (
                        <motion.div key={review.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                          <ReviewCard review={review} />
                        </motion.div>
                      ))}
                      {visibleReviews < displayReviews.length && (
                        <button onClick={() => setVisibleReviews((v) => v + 4)} className="mt-5 px-8 py-2.5 text-[13px] font-semibold border transition-colors hover:bg-[#1A0A2E] hover:text-white" style={{ borderColor: '#1A0A2E', color: '#1A0A2E' }}>
                          Load More Reviews
                        </button>
                      )}
                    </>
                  ) : <p className="text-[13px]" style={{ color: '#78716C' }}>No reviews yet.</p>}
                </motion.div>
              )}

              {/* FAQ'S */}
              {activeTab === 'faqs' && (
                <motion.div key="faqs" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="max-w-2xl">
                  <div className="space-y-0 divide-y" style={{ borderColor: '#E0DBDA' }}>
                    {[
                      { q: 'Is this product 100% authentic?', a: 'Yes. All products at Amoria are 100% genuine and sourced directly from authorised brand distributors.' },
                      { q: 'What is the return policy?', a: 'We accept returns within 7 days of delivery for unused, unopened products in their original packaging.' },
                      { q: 'How long does delivery take?', a: 'Standard delivery takes 2–5 business days. Express same-day or next-day delivery is available for Dubai and Abu Dhabi.' },
                      { q: 'Is Cash on Delivery available?', a: 'Yes, Cash on Delivery (COD) is available across all Emirates.' },
                      { q: 'Do you offer gift wrapping?', a: 'Yes, gift wrapping and personalised gift messages are available at checkout.' },
                    ].map(({ q, a }) => (
                      <div key={q} className="py-4">
                        <p className="text-[13.5px] font-semibold mb-1" style={{ color: '#1A0A2E' }}>Q: {q}</p>
                        <p className="text-[13px] leading-relaxed" style={{ color: '#44403C' }}>{a}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Below fold ── */}
      <div className="border-t" style={{ borderColor: '#E8E3DC', backgroundColor: '#FAFAF8' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-14">
          <PeopleAlsoBoughtFromApi product={product} />
          <RelatedProductsFromApi product={product} />
          <RecentlyViewed />
        </div>
      </div>

      {/* ── Mobile sticky bar ── */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ duration: 0.2 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t bg-white"
            style={{ borderColor: '#E8E3DC', paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="px-4 py-3 flex flex-col justify-center flex-shrink-0 border-r" style={{ borderColor: '#E8E3DC' }}>
              <p className="text-[10px] uppercase tracking-widest" style={{ color: '#78716C' }}>{variant?.sizeMl}ML</p>
              <p className="text-[17px] font-bold" style={{ color: '#1A0A2E' }}>{formatCurrency(price)}</p>
            </div>
            <div className="flex flex-1">
              <button onClick={handleAddToCart} disabled={addedState !== 'idle' || !inStock}
                className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-semibold border-r disabled:opacity-50"
                style={{ borderColor: '#E8E3DC', backgroundColor: '#fff', color: '#1A0A2E' }}>
                <ShoppingBag size={15} /> Cart
              </button>
              <button onClick={handleBuyNow} disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-1.5 text-[13px] font-semibold disabled:opacity-50"
                style={{ backgroundColor: '#1A0A2E', color: '#fff' }}>
                <Zap size={15} /> Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
