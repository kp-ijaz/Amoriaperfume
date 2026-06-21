import { Product } from '@/types/product';
import { ProductGrid } from './ProductGrid';

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) return null;

  return (
    <section className="py-10">
      <h2
        className="text-2xl font-light mb-6 gold-underline inline-block"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}
      >
        Related Products
      </h2>
      {/* Same grid the home page uses — identical card sizing, columns and gaps */}
      <ProductGrid products={products} columns={4} />
    </section>
  );
}
