'use client';

import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface PeopleAlsoBoughtProps {
  products: Product[];
}

export function PeopleAlsoBought({ products }: PeopleAlsoBoughtProps) {
  if (!products.length) return null;

  return (
    <section className="py-10">
      <h2
        className="text-2xl font-light mb-6 gold-underline inline-block"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
      >
        People Also Bought
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
