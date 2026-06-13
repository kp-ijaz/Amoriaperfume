'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuizCatalogProducts } from '@/lib/hooks/useApiProducts';
import { matchQuizProducts, buildQuizMatchesProductsUrl } from '@/lib/fragrance-finder/matchProducts';
import { ProductCard } from '@/components/product/ProductCard';

interface QuizResultsProps {
  answers: Record<number, string>;
  onRetake: () => void;
}

export function QuizResults({ answers, onRetake }: QuizResultsProps) {
  const { data: allProducts = [] } = useQuizCatalogProducts();
  const results = useMemo(
    () => matchQuizProducts(allProducts, answers),
    [allProducts, answers]
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="text-center mb-8">
        <div className="text-4xl mb-3" style={{ color: 'var(--color-amoria-accent)', fontFamily: 'var(--font-heading)' }}>✨</div>
        <h2 className="text-3xl font-light text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Your Amoria Matches
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
          {results.length > 0
            ? `${results.length} fragrance${results.length === 1 ? '' : 's'} match your preferences`
            : 'No exact matches found — try adjusting your answers or browse our full collection'}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-h-[70vh] overflow-y-auto">
          {results.map(({ product, score }) => (
            <div key={product.id} className="relative">
              <div
                className="absolute -top-2 left-2 z-10 text-xs font-bold px-2 py-0.5"
                style={{ backgroundColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-primary)' }}
              >
                {score}% Match
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : null}

      <div className="text-center space-y-3">
        {results.length > 0 && (
          <Link
            href={buildQuizMatchesProductsUrl(results.map((r) => r.product.id))}
            className="inline-block px-8 py-3 text-sm font-bold tracking-wider uppercase"
            style={{ backgroundColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-primary)' }}
          >
            See All Perfumes →
          </Link>
        )}
        <button
          onClick={onRetake}
          className="block mx-auto px-8 py-3 text-sm font-medium border"
          style={{ borderColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-accent)' }}
        >
          Retake Quiz
        </button>
      </div>
    </motion.div>
  );
}
