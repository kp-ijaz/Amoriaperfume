'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils/formatCurrency';

const INSPIRED_PRODUCTS = [
  {
    id: 'insp-1',
    slug: 'club-de-nuit-intense',
    name: 'Club de Nuit Intense',
    brand: 'Armaf',
    inspiredBy: 'Creed Aventus',
    image: 'https://images.unsplash.com/photo-1619994121345-b61cd610c5a6?w=600&q=90',
    price: 119,
    originalPrice: 149,
  },
  {
    id: 'insp-2',
    slug: 'ana-abiyedh-rouge',
    name: 'Ana Abiyedh Rouge',
    brand: 'Lattafa',
    inspiredBy: 'Baccarat Rouge 540',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=600&q=90',
    price: 89,
    originalPrice: null,
  },
  {
    id: 'insp-3',
    slug: 'tres-nuit',
    name: 'Tres Nuit',
    brand: 'Armaf',
    inspiredBy: 'Bleu de Chanel',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&q=90',
    price: 109,
    originalPrice: null,
  },
  {
    id: 'insp-4',
    slug: 'night-dreams',
    name: 'Night Dreams',
    brand: 'Lattafa',
    inspiredBy: 'Black Opium — YSL',
    image: 'https://images.unsplash.com/photo-1590156562745-5f9d6c4fcf3e?w=600&q=90',
    price: 99,
    originalPrice: null,
  },
  {
    id: 'insp-5',
    slug: 'rose-elixir',
    name: 'Rose Elixir',
    brand: 'Armaf',
    inspiredBy: 'La Vie Est Belle — Lancôme',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600&q=90',
    price: 99,
    originalPrice: 129,
  },
];

function InspirationCard({
  product,
  index,
}: {
  product: (typeof INSPIRED_PRODUCTS)[0];
  index: number;
}) {
  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} added to cart`, {
      style: {
        background: '#1A0A2E',
        color: '#FAF8F5',
        border: '1px solid rgba(201,168,76,0.25)',
        fontSize: '13px',
      },
      duration: 2500,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/products/${product.slug}`} className="group block">

        {/* Image container */}
        <div
          className="relative overflow-hidden mb-4"
          style={{ backgroundColor: '#EDE8E1', aspectRatio: '1 / 1' }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            unoptimized
          />

          {/* Add "+" button — bottom-right, on hover */}
          <button
            onClick={handleAdd}
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 z-10"
            style={{ backgroundColor: '#1A0A2E', color: '#C9A84C' }}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Card info — Inspired by → Name → Price */}
        <div className="text-center px-1">
          <span
            className="inline-block text-[8px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 mb-2"
            style={{ backgroundColor: '#0D0A08', color: '#C9A84C' }}
          >
            Inspired by {product.inspiredBy}
          </span>

          <h3
            className="text-base md:text-lg font-light leading-snug mb-2 transition-colors duration-200 group-hover:text-[#C9A84C]"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#1A0A2E',
              letterSpacing: '0.02em',
            }}
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-semibold" style={{ color: '#C9A84C' }}>
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs line-through" style={{ color: '#A89880' }}>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

      </Link>
    </motion.div>
  );
}

export function BrandInspirations() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#F2ECE3', paddingTop: '6rem', paddingBottom: '6rem' }}
    >
      {/* Top/bottom hairlines */}
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)' }}
      />

      {/* Subtle warm radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* ── Section header — centered ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p
            className="text-lg md:text-xl tracking-[0.22em] uppercase font-semibold mb-4"
            style={{ color: '#C9A84C' }}
          >
            Brand Inspirations
          </p>
          <h2
            className="font-light"
            style={{
              fontFamily: 'var(--font-heading)',
              color: '#1A0A2E',
              fontSize: 'clamp(3rem, 5vw, 4rem)',
              letterSpacing: '0.03em',
            }}
          >
            Scents{' '}
            <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>You'll Love</em>
          </h2>

          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-14" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.5))' }} />
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <polygon points="5,0 10,5 5,10 0,5" fill="none" stroke="#C9A84C" strokeWidth="0.8" strokeOpacity="0.7" />
              <circle cx="5" cy="5" r="1.5" fill="#C9A84C" fillOpacity="0.6" />
            </svg>
            <div className="h-px w-14" style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,76,0.5))' }} />
          </div>
        </motion.div>

        {/* ── Product grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
          {INSPIRED_PRODUCTS.map((product, i) => (
            <InspirationCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* ── View All ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/products?category=inspired-collections"
            className="inline-flex items-center justify-center px-10 py-3 text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-300 hover:bg-[#1A0A2E] hover:text-white hover:border-[#1A0A2E]"
            style={{ border: '1px solid #1A0A2E', color: '#1A0A2E' }}
          >
            View All
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
