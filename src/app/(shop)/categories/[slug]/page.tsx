import { notFound } from 'next/navigation';
import { categories } from '@/lib/data/categories';
import { getProductsByCategory } from '@/lib/data/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(category.name);

  return (
    <div>
      <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
        <nav className="flex items-center justify-center gap-2 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Link href="/" className="hover:opacity-80 text-white/50">Home</Link>
          <span>/</span>
          <span className="text-white">{category.name}</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          {category.name}
        </h1>
        <p className="text-white/60 text-sm mt-2 max-w-md mx-auto">{category.description}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
          {categoryProducts.length} products
        </p>
        <ProductGrid products={categoryProducts} columns={4} />
      </div>
    </div>
  );
}
