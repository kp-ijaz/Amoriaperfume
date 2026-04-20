'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gift, ArrowRight } from 'lucide-react';
import { products } from '@/lib/data/products';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useCart } from '@/lib/hooks/useCart';
import { toast } from 'sonner';

const occasions = [
  { label: 'Eid Gifts',      icon: '🌙', href: '/products?category=gift-sets&occasion=eid' },
  { label: 'Weddings',       icon: '💍', href: '/products?category=gift-sets&occasion=wedding' },
  { label: 'Birthdays',      icon: '🎂', href: '/products?category=gift-sets&occasion=birthday' },
  { label: 'Corporate',      icon: '🤝', href: '/products?category=gift-sets&occasion=corporate' },
];

export default function GiftSetsPage() {
  const { addItem } = useCart();
  const giftProducts = products.filter((p) => p.category === 'Gift Sets');

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* Hero */}
      <div
        className="relative py-16 px-4 text-center overflow-hidden"
        style={{ backgroundColor: '#1A0A2E' }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
            <Gift size={22} style={{ color: '#C9A84C' }} />
          </div>
          <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: 'rgba(201,168,76,0.7)' }}>For Every Occasion</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Gift <em style={{ color: '#C9A84C' }}>Sets</em>
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Curated fragrance gifts that make every moment unforgettable. Beautifully packaged and ready to gift.
          </p>
        </motion.div>
      </div>

      {/* Occasion strip */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E3DC' }}>
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-3">
          {occasions.map((occ) => (
            <Link
              key={occ.label}
              href={occ.href}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all border hover:border-[#1A0A2E]"
              style={{ borderColor: '#E8E3DC', backgroundColor: '#FAF8F5', color: '#1A0A2E' }}
            >
              <span>{occ.icon}</span>
              {occ.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Gift set products */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        {giftProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
                All Gift Sets
              </h2>
              <Link href="/products?category=gift-sets" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:gap-2.5 transition-all" style={{ color: '#C9A84C' }}>
                View All <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {giftProducts.map((product, i) => {
                const primary = product.images.find((img) => img.isPrimary) ?? product.images[0];
                const variant = product.variants[0];
                const price   = variant?.salePrice ?? variant?.price ?? 0;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="group"
                    style={{ backgroundColor: 'white', border: '1px solid #E8E3DC' }}
                  >
                    <Link href={`/products/${product.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      <Image src={primary.url} alt={primary.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                      <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 text-[9px] font-black uppercase tracking-wider"
                        style={{ backgroundColor: '#C9A84C', color: '#1A0A2E' }}>
                        <Gift size={9} /> Gift Set
                      </div>
                    </Link>
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#A89880' }}>{product.brand}</p>
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-base font-medium mb-2 hover:text-[#C9A84C] transition-colors" style={{ color: '#1C1C1C' }}>{product.name}</h3>
                      </Link>
                      <p className="text-sm font-bold mb-3" style={{ color: '#C9A84C' }}>{formatCurrency(price)}</p>
                      <button
                        onClick={() => {
                          if (variant) {
                            addItem(product, variant, 1);
                            toast.success(`${product.name} added to cart`);
                          }
                        }}
                        className="w-full py-2.5 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90"
                        style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          /* Fallback if no gift products yet */
          <div className="text-center py-20">
            <Gift size={48} className="mx-auto mb-4" style={{ color: '#E8E3DC' }} />
            <h2 className="text-xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>Gift Sets Coming Soon</h2>
            <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>We are curating the perfect gift collection. Browse our full range in the meantime.</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
              style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}>
              Browse All Fragrances <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* Gift wrapping note */}
      <div style={{ backgroundColor: '#1A0A2E' }}>
        <div className="max-w-3xl mx-auto px-4 py-10 text-center">
          <p className="text-xs tracking-[0.28em] uppercase mb-3" style={{ color: 'rgba(201,168,76,0.6)' }}>Complimentary Service</p>
          <h3 className="text-2xl font-light text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Free Gift <em style={{ color: '#C9A84C' }}>Wrapping</em>
          </h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Every gift set comes beautifully wrapped in our signature gold and purple packaging — at no extra charge.
          </p>
        </div>
      </div>

    </div>
  );
}
