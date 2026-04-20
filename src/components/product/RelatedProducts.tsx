import { Product } from '@/types/product';
import { ProductCard } from './ProductCard';

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
