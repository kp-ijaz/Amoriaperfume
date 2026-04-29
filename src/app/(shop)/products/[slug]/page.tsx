'use client';

import { useState, use, useEffect, useRef } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, Heart, CheckCircle, Minus, Plus, RotateCcw, Shield, Truck, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { useApiProductBySlug, useProductReviews, useProductsByLimit } from '@/lib/hooks/useApiProducts';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductVariantSelector } from '@/components/product/ProductVariantSelector';
import { FragranceNotes } from '@/components/product/FragranceNotes';
import { ReviewsSection } from '@/components/product/ReviewsSection';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { PeopleAlsoBought } from '@/components/product/PeopleAlsoBought';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { RatingStars } from '@/components/product/RatingStars';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { useDispatch } from 'react-redux';
import { addToRecentlyViewed } from '@/lib/store/uiSlice';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { ProductVariant } from '@/types/product';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { data: product, isLoading, error } = useApiProductBySlug(slug);

  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const dispatch = useDispatch();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedState, setAddedState] = useState<'idle' | 'loading' | 'success'>('idle');
  const addToCartRef = useRef<HTMLButtonElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(true);

  // Set default variant once product loads
  useEffect(() => {
    if (product && !selectedVariant) {
      setSelectedVariant(product.variants[0] ?? null);
    }
  }, [product, selectedVariant]);

  // Track recently viewed
  useEffect(() => {
    if (product?.id) dispatch(addToRecentlyViewed(product.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Hide sticky bar when in-page Add to Cart button is visible
  useEffect(() => {
    const el = addToCartRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product]);

  // Product reviews from API
  const { data: apiReviews = [] } = useProductReviews(slug);

  // Related / People also bought
  const { data: moreProducts = [] } = useProductsByLimit(6);
  const relatedProducts = moreProducts.filter((p) => p.id !== slug).slice(0, 4);
  const alsoBoought = moreProducts.filter((p) => p.id !== slug).slice(0, 6);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>Loading product…</p>
        </div>
      </div>
    );
  }

  if (error || !product) return notFound();

  const variant = selectedVariant ?? product.variants[0];
  const price = variant?.salePrice ?? variant?.price ?? 0;
  const originalPrice = variant?.salePrice ? variant.price : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
  const wishlisted = isInWishlist(product.id);

  async function handleAddToCart() {
    if (!product || !variant) return;
    setAddedState('loading');
    await new Promise((r) => setTimeout(r, 400));
    addItem(product, variant, quantity);
    setAddedState('success');
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAddedState('idle'), 1500);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-[140px] md:pt-8 md:pb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
        <Link href="/" className="hover:opacity-80">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:opacity-80">Products</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-amoria-text)' }}>{product.name}</span>
      </nav>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* Left: Gallery */}
        <ProductImageGallery images={product.images} productName={product.name} />

        {/* Right: Details */}
        <div>
          {/* Brand */}
          <span className="text-xs uppercase tracking-wider font-medium" style={{ color: 'var(--color-amoria-text-muted)' }}>
            {product.brand}
          </span>

          {/* Name */}
          <h1
            className="text-3xl md:text-4xl font-light mt-1 mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
          >
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <RatingStars rating={product.rating} size={16} />
            <a href="#reviews" className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </a>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-3xl font-semibold"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)', fontSize: '1.75rem' }}
            >
              {formatCurrency(price)}
            </span>
            {originalPrice && (
              <>
                <span className="text-xl line-through" style={{ color: 'var(--color-amoria-text-muted)' }}>
                  {formatCurrency(originalPrice)}
                </span>
                <span className="text-sm font-bold px-2 py-0.5 bg-red-600 text-white">
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Gold divider */}
          <div className="h-px mb-5" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />

          {/* Variant selector */}
          {product.variants.length > 1 && variant && (
            <div className="mb-5">
              <ProductVariantSelector
                variants={product.variants}
                selectedVariant={variant}
                onSelect={setSelectedVariant}
              />
            </div>
          )}

          {/* Stock */}
          {variant && (
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: variant.stock > 5 ? '#22c55e' : variant.stock > 0 ? '#f59e0b' : '#ef4444' }}
              />
              <span className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>
                {variant.stock > 5 ? 'In Stock' : variant.stock > 0 ? `Only ${variant.stock} left!` : 'Out of Stock'}
              </span>
            </div>
          )}

          {/* Qty + add to cart */}
          <div className="flex gap-3 mb-4">
            <div className="flex items-center border" style={{ borderColor: 'var(--color-amoria-border)' }}>
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-12 flex items-center justify-center hover:bg-gray-50">
                <Minus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(variant?.stock ?? 1, q + 1))}
                className="w-10 h-12 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              ref={addToCartRef}
              onClick={handleAddToCart}
              disabled={addedState !== 'idle' || !variant || variant.stock === 0}
              className="flex-1 h-12 flex items-center justify-center gap-2 text-sm font-semibold tracking-wide transition-all disabled:opacity-70"
              style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
            >
              {addedState === 'loading' ? (
                <span className="animate-spin">⟳</span>
              ) : addedState === 'success' ? (
                <><CheckCircle size={16} /> Added!</>
              ) : (
                <><ShoppingBag size={16} /> Add to Cart</>
              )}
            </button>
          </div>

          <button
            onClick={() => { toggleWishlist(product.id); toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist'); }}
            className="w-full h-11 border text-sm font-medium flex items-center justify-center gap-2 transition-colors mb-5 hover:bg-gray-50"
            style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text)' }}
          >
            <Heart size={16} fill={wishlisted ? '#ef4444' : 'transparent'} style={{ color: wishlisted ? '#ef4444' : 'inherit' }} />
            {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>

          {/* Free shipping badge */}
          {price >= 200 && (
            <div className="flex items-center gap-2 py-2.5 px-3 mb-4 bg-green-50 border border-green-200 text-sm text-green-700">
              <Truck size={14} />
              ✓ Free Delivery on this order
            </div>
          )}

          {/* Gold divider */}
          <div className="h-px mb-4" style={{ backgroundColor: 'rgba(201,168,76,0.3)' }} />

          {/* Quick info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { icon: <RotateCcw size={18} />, label: 'Easy Returns' },
              { icon: <Shield size={18} />, label: '100% Authentic' },
              { icon: <Truck size={18} />, label: 'Fast Delivery' },
              { icon: <Gift size={18} />, label: 'Gift Wrapping' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                <span style={{ color: 'var(--color-amoria-accent)' }}>{icon}</span>
                <span className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Info pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            {product.concentration && (
              <span className="px-3 py-1 border rounded-full" style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text-muted)' }}>
                {product.concentration}
              </span>
            )}
            {product.fragranceFamily && (
              <span className="px-3 py-1 border rounded-full" style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text-muted)' }}>
                {product.fragranceFamily}
              </span>
            )}
            {product.gender && (
              <span className="px-3 py-1 border rounded-full" style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text-muted)' }}>
                {product.gender}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div id="reviews" className="mb-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0" style={{ borderColor: 'var(--color-amoria-border)' }}>
            {['description', 'fragrance-notes', 'reviews'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--color-amoria-accent)] data-[state=active]:bg-transparent px-4 py-3 text-sm font-medium capitalize"
              >
                {tab.replace('-', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="description" className="pt-6">
            <p className="text-base leading-relaxed max-w-2xl" style={{ color: 'var(--color-amoria-text)' }}>
              {product.description}
            </p>
          </TabsContent>
          <TabsContent value="fragrance-notes" className="pt-6 max-w-xl">
            <FragranceNotes
              topNotes={product.topNotes}
              heartNotes={product.heartNotes}
              baseNotes={product.baseNotes}
            />
          </TabsContent>
          <TabsContent value="reviews" className="pt-6">
            <ReviewsSection
              productId={product.id}
              reviews={apiReviews}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          </TabsContent>
        </Tabs>
      </div>

      <PeopleAlsoBought products={alsoBoought} />
      <RelatedProducts products={relatedProducts} />
      <RecentlyViewed />

      {/* Mobile sticky bottom bar */}
      {showStickyBar && variant && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3"
          style={{
            backgroundColor: 'rgba(250,248,245,0.97)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--color-amoria-border)',
            paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
          }}
        >
          <div className="flex-1">
            <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)' }}>
              {price >= 200 ? (
                <>{formatCurrency(price)} <span className="text-xs font-normal text-green-600 ml-1">Free Delivery</span></>
              ) : formatCurrency(price)}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={addedState !== 'idle' || variant.stock === 0}
            className="flex-1 h-12 flex items-center justify-center gap-2 text-sm font-semibold tracking-wide transition-all disabled:opacity-70"
            style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}
          >
            {addedState === 'loading' ? (
              <span className="animate-spin">⟳</span>
            ) : addedState === 'success' ? (
              <><CheckCircle size={16} /> Added!</>
            ) : (
              <><ShoppingBag size={16} /> Add to Cart</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
