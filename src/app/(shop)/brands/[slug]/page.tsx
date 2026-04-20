import { notFound } from 'next/navigation';
import { brands } from '@/lib/data/brands';
import { getProductsByBrand } from '@/lib/data/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import Link from 'next/link';

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) notFound();

  const brandProducts = getProductsByBrand(brand.name);

  return (
    <div>
      <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
        <nav className="flex items-center justify-center gap-2 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <Link href="/" className="hover:opacity-80">Home</Link>
          <span>/</span>
          <Link href="/brands" className="hover:opacity-80">Brands</Link>
          <span>/</span>
          <span className="text-white">{brand.name}</span>
        </nav>
        <h1 className="text-3xl md:text-5xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          {brand.name}
        </h1>
        <p className="text-white/60 text-sm mt-3 max-w-lg mx-auto">{brand.description}</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-sm mb-6" style={{ color: 'var(--color-amoria-text-muted)' }}>
          {brandProducts.length} fragrances
        </p>
        <ProductGrid products={brandProducts} columns={4} />
      </div>
    </div>
  );
}
