'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Flame } from 'lucide-react';
import { products } from '@/lib/data/products';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { useCart } from '@/lib/hooks/useCart';
import { toast } from 'sonner';

const aboutPoints = [
  {
    icon: '🪵',
    title: 'Natural Wood Base',
    desc: 'Traditional bakhoor begins with fragrant wood chips, often agarwood, soaked in aromatic oils and resins.',
  },
  {
    icon: '🔥',
    title: 'The Burning Ritual',
    desc: 'Placed on a mabkhara (incense burner), the smoke rises and fills your space with a warm, spiritual fragrance.',
  },
  {
    icon: '🏡',
    title: 'For Home & Soul',
    desc: 'Used to scent homes, clothing, and spaces across the Arabian Peninsula for centuries. A tradition of welcome.',
  },
];

export default function BakhoorPage() {
  const { addItem } = useCart();
  const bakhoorProducts = products.filter((p) => p.category === 'Bakhoor');

  return (
    <div style={{ backgroundColor: '#FAF8F5', minHeight: '100vh' }}>

      {/* Hero */}
      <div
        className="relative py-20 px-4 text-center overflow-hidden"
        style={{ backgroundColor: '#0D0A08' }}
      >
        {/* Smoke/texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #C9A84C 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-4xl mb-4"
          >
            🪔
          </motion.div>
          <p className="text-xs tracking-[0.35em] uppercase mb-3" style={{ color: 'rgba(201,168,76,0.7)' }}>Arabian Tradition</p>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            <em style={{ color: '#C9A84C' }}>Bakhoor</em>
          </h1>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            The ancient art of Arabian home fragrance — where sacred smoke carries blessings and fills every corner with warmth.
          </p>
        </motion.div>
      </div>

      {/* About bakhoor */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #E8E3DC' }}>
        <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutPoints.map((pt, i) => (
            <motion.div
              key={pt.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <div className="text-3xl mb-3">{pt.icon}</div>
              <h3 className="text-base font-semibold mb-2" style={{ color: '#1A0A2E' }}>{pt.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6B6B' }}>{pt.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        {bakhoorProducts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-light" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>
                Our Bakhoor Selection
              </h2>
              <Link href="/products?category=bakhoor" className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:gap-2.5 transition-all" style={{ color: '#C9A84C' }}>
                View All <ArrowRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bakhoorProducts.map((product, i) => {
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
                        style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}>
                        <Flame size={9} /> Bakhoor
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
                            addItem({ product, variant, quantity: 1 });
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
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🪔</div>
            <h2 className="text-xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: '#1A0A2E' }}>Bakhoor Collection Coming Soon</h2>
            <p className="text-sm mb-6" style={{ color: '#6B6B6B' }}>We are sourcing the finest bakhoor for you. Browse our full range in the meantime.</p>
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
              style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}>
              Browse All Fragrances <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* How to use */}
      <div style={{ backgroundColor: '#1A0A2E' }}>
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-xs tracking-[0.28em] uppercase mb-3" style={{ color: 'rgba(201,168,76,0.6)' }}>Guide</p>
          <h3 className="text-2xl font-light text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            How to Use <em style={{ color: '#C9A84C' }}>Bakhoor</em>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { step: '01', title: 'Heat the Burner', desc: 'Light a charcoal disc in your mabkhara and let it become grey-white before placing bakhoor on it.' },
              { step: '02', title: 'Place the Bakhoor', desc: 'Add a small piece of bakhoor onto the hot charcoal. The smoke will begin rising immediately.' },
              { step: '03', title: 'Let it Breathe', desc: 'Move the burner around your home or hold clothing over the smoke for 30–60 seconds to scent fabric.' },
            ].map((s) => (
              <div key={s.step}>
                <p className="text-3xl font-light mb-2" style={{ color: 'rgba(201,168,76,0.3)', fontFamily: 'var(--font-heading)' }}>{s.step}</p>
                <p className="text-sm font-semibold text-white mb-1">{s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
