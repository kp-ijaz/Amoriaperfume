'use client';

import { Product } from '@/types/product';
import { useProductsByLimit } from '@/lib/hooks/useApiProducts';
import { RelatedProducts } from './RelatedProducts';
import { PeopleAlsoBought } from './PeopleAlsoBought';

export function RelatedProductsFromApi({
  product,
}: {
  product: Product;
}) {
  const { data: pool = [] } = useProductsByLimit(24, {
    categorySlug: product.categorySlug,
  });
  const related = pool.filter((p) => p.id !== product.id).slice(0, 4);
  return <RelatedProducts products={related} />;
}

export function PeopleAlsoBoughtFromApi({
  product,
}: {
  product: Product;
}) {
  const { data: pool = [] } = useProductsByLimit(12, { featured: true });
  const items = pool.filter((p) => p.id !== product.id).slice(0, 6);
  return <PeopleAlsoBought products={items} />;
}
