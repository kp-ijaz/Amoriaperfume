import { NextResponse } from 'next/server';
import { fetchAllProducts } from '@/lib/api/server';
import { ApiProduct } from '@/lib/api/types';
import {
  GOOGLE_PRODUCT_CATEGORY,
  PRICE_CURRENCY,
  SITE_NAME,
} from '@/lib/seo/constants';
import { absoluteUrl, productUrl } from '@/lib/seo/site';
import { isValidGtin13, stockToSchemaAvailability } from '@/lib/seo/jsonld';

export const revalidate = 3600;

/**
 * Google Merchant Center setup (https://merchants.google.com):
 * 1. Create account — business country: United Arab Emirates
 * 2. Verify domain amoriaperfume.ae (HTML tag or DNS)
 * 3. Products → Feeds → Add feed → Scheduled fetch:
 *    https://amoriaperfume.ae/feed/google-shopping.xml
 * 4. Configure UAE shipping & tax (align with storefront: AED, free over AED 200)
 * 5. Link Google Search Console / Analytics
 * 6. Fix feed errors in Diagnostics, then enable Surfaces across Google
 * 7. Submit https://amoriaperfume.ae/sitemap.xml in Search Console
 */

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function primaryImage(product: ApiProduct): string {
  const url = product.images[0] || product.thumbnail[0] || '';
  return url ? absoluteUrl(url) : '';
}

function googleAvailability(product: ApiProduct, outOfStock?: boolean, stock?: number): string {
  const schema = stockToSchemaAvailability(outOfStock, stock, product.catalogMeta?.stockStatus);
  return schema.includes('OutOfStock') ? 'out of stock' : 'in stock';
}

function buildItem(
  product: ApiProduct,
  sizeLabel: string,
  sku: string,
  price: number,
  outOfStock?: boolean,
  stock?: number,
  barcode?: string
) {
  const title = `${product.name} — ${sizeLabel} ${product.concentration}`.trim();
  const description =
    product.shortDescription?.trim() ||
    product.description.slice(0, 5000);
  const image = primaryImage(product);
  const link = productUrl(product.slug);
  const hasGtin = isValidGtin13(barcode);
  const hasMpn = Boolean(sku?.trim());

  let identifierBlock = '';
  if (hasGtin) {
    identifierBlock = `<g:gtin>${escapeXml(barcode!.replace(/\D/g, ''))}</g:gtin>`;
  } else if (hasMpn) {
    identifierBlock = `<g:mpn>${escapeXml(sku)}</g:mpn>`;
  } else {
    identifierBlock = '<g:identifier_exists>false</g:identifier_exists>';
  }

  return `    <item>
      <g:id>${escapeXml(`${product._id}-${sku || sizeLabel}`)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      <g:availability>${googleAvailability(product, outOfStock, stock)}</g:availability>
      <g:price>${price.toFixed(2)} ${PRICE_CURRENCY}</g:price>
      <g:brand>${escapeXml(product.brand?.name || SITE_NAME)}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>${GOOGLE_PRODUCT_CATEGORY}</g:google_product_category>
      <g:product_type>${escapeXml(`${product.category?.name || 'Perfume'} &gt; Perfume`)}</g:product_type>
      ${identifierBlock}
    </item>`;
}

function buildFeedXml(products: ApiProduct[]): string {
  const items = products.flatMap((product) => {
    if (!product.slug || !product.published) return [];
    const image = primaryImage(product);
    if (!image) return [];

    return product.variants.flatMap((variant) =>
      variant.sizeArray.map((size) => {
        if (!size.finalPrice || size.finalPrice <= 0) return '';
        return buildItem(
          product,
          size.size,
          size.sku,
          size.finalPrice,
          size.outOfStock,
          size.stock,
          size.barcode
        );
      })
    ).filter(Boolean);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_NAME)} Product Feed</title>
    <link>${escapeXml(absoluteUrl('/'))}</link>
    <description>${escapeXml('Amoria perfume product feed for Google Merchant Center')}</description>
${items.join('\n')}
  </channel>
</rss>`;
}

export async function GET() {
  const products = await fetchAllProducts();
  const xml = buildFeedXml(products);

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
