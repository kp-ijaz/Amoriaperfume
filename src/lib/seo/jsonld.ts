import type { ApiProduct } from '@/lib/api/types';
import { Product } from '@/types/product';
import { absoluteUrl, getSiteUrl, productUrl } from './site';
import { GOOGLE_PRODUCT_CATEGORY, PRICE_CURRENCY, SITE_NAME } from './constants';

export function isValidGtin13(barcode?: string): boolean {
  if (!barcode) return false;
  const digits = barcode.replace(/\D/g, '');
  return digits.length === 13;
}

export function stockToSchemaAvailability(
  outOfStock?: boolean,
  stock?: number,
  stockStatus?: 'in_stock' | 'low' | 'out_of_stock'
): string {
  if (outOfStock || stock === 0 || stockStatus === 'out_of_stock') {
    return 'https://schema.org/OutOfStock';
  }
  return 'https://schema.org/InStock';
}

function productImages(api: ApiProduct): string[] {
  const urls = api.images.length > 0 ? api.images : api.thumbnail;
  return urls.filter(Boolean).map((url) => absoluteUrl(url));
}

function primaryImage(api: ApiProduct): string | undefined {
  return productImages(api)[0];
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: absoluteUrl('/brand-icon.png'),
    sameAs: ['https://www.instagram.com/amoria.ae'],
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getSiteUrl(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl('/products?search={search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildProductJsonLd(api: ApiProduct) {
  const images = productImages(api);
  const offers = api.variants.flatMap((variant) =>
    variant.sizeArray.map((size) => {
      const offerId = `${api._id}-${size.sku || size._id}`;
      const offer: Record<string, unknown> = {
        '@type': 'Offer',
        sku: size.sku,
        price: size.finalPrice,
        priceCurrency: PRICE_CURRENCY,
        availability: stockToSchemaAvailability(
          size.outOfStock,
          size.stock,
          api.catalogMeta?.stockStatus
        ),
        url: productUrl(api.slug),
        itemCondition: 'https://schema.org/NewCondition',
      };
      if (isValidGtin13(size.barcode)) {
        offer.gtin13 = size.barcode!.replace(/\D/g, '');
      }
      offer['@id'] = offerId;
      return offer;
    })
  );

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: api.name,
    description: api.shortDescription?.trim() || api.description,
    image: images,
    sku: api.sku,
    brand: {
      '@type': 'Brand',
      name: api.brand?.name ?? SITE_NAME,
    },
    url: productUrl(api.slug),
    offers,
    category: api.category?.name,
  };

  if (api.ratings?.count > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: api.ratings.avg,
      reviewCount: api.ratings.count,
    };
  }

  return jsonLd;
}

export function buildProductJsonLdFromAdapted(product: Product, api?: ApiProduct) {
  if (api) return buildProductJsonLd(api);
  const images = product.images.map((img) => absoluteUrl(img.url));
  const offers = product.variants.map((v) => ({
    '@type': 'Offer',
    sku: v.sku,
    price: v.salePrice ?? v.price,
    priceCurrency: PRICE_CURRENCY,
    availability: stockToSchemaAvailability(v.outOfStock, v.stock, product.stockStatus),
    url: productUrl(product.slug),
    itemCondition: 'https://schema.org/NewCondition',
  }));

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: images,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    url: productUrl(product.slug),
    offers,
  };

  if (product.reviewCount > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  return jsonLd;
}

export function getProductPrimaryImage(api: ApiProduct): string | undefined {
  return primaryImage(api);
}

export function getProductMetaFromApi(api: ApiProduct) {
  const title = api.seo?.metaTitle?.trim() || api.name;
  const description =
    api.seo?.metaDescription?.trim() ||
    api.shortDescription?.trim() ||
    api.description.slice(0, 160);
  const path = api.seo?.canonicalPath?.trim() || `/products/${api.slug}`;
  const image = primaryImage(api);
  const keywords = api.seo?.keywords;
  return { title, description, path, image, keywords };
}

export { GOOGLE_PRODUCT_CATEGORY };
