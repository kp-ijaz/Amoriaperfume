'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { quizQuestions } from '@/lib/data/quiz';
import { useProductsByLimit } from '@/lib/hooks/useApiProducts';
import { ProductCard } from '@/components/product/ProductCard';

interface QuizResultsProps {
  answers: Record<number, string>;
  onRetake: () => void;
}

function scoreProducts(
  products: Product[],
  answers: Record<number, string>
): Array<{ product: Product; score: number }> {
  const selectedTags: string[] = [];
  quizQuestions.forEach((q) => {
    const option = q.options.find((o) => o.id === answers[q.id]);
    if (option) selectedTags.push(...option.tags);
  });

  const budgetAnswer = answers[5];
  return products
    .map((p) => {
      const price = p.variants[0]?.salePrice ?? p.variants[0]?.price ?? 0;
      let inBudget = true;
      if (budgetAnswer === 'budget'  && price >= 100) inBudget = false;
      if (budgetAnswer === 'mid'     && (price < 100 || price >= 250)) inBudget = false;
      if (budgetAnswer === 'premium' && (price < 250 || price >= 500)) inBudget = false;
      if (budgetAnswer === 'luxury'  && price < 500) inBudget = false;

      const matchCount = (p.tags ?? []).filter((t) => selectedTags.includes(t)).length;
      const score = inBudget ? matchCount * 20 : matchCount * 5;
      return { product: p, score: Math.min(score, 98) + Math.floor(Math.random() * 5) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

export function QuizResults({ answers, onRetake }: QuizResultsProps) {
  const { data: allProducts = [] } = useProductsByLimit(100);
  const results = useMemo(
    () => scoreProducts(allProducts, answers),
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
          Based on your preferences, we found these perfect matches for you
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
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

      <div className="text-center">
        <button
          onClick={onRetake}
          className="px-8 py-3 text-sm font-medium border"
          style={{ borderColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-accent)' }}
        >
          Retake Quiz
        </button>
      </div>
    </motion.div>
  );
}
