'use client';

import { use } from 'react';
import { redirect } from 'next/navigation';

export default function CollectionSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const normalizedSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');
  redirect(`/products?collection=${encodeURIComponent(normalizedSlug)}`);
}

