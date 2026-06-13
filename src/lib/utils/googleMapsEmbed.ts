function isAllowedGoogleEmbedSrc(src: string): boolean {
  try {
    const url = new URL(src);
    return url.hostname.includes('google.com') && url.pathname.includes('/maps/embed');
  } catch {
    return false;
  }
}

/**
 * Extracts a safe Google Maps embed iframe src from pasted embed HTML or a bare embed URL.
 */
export function extractGoogleMapsEmbedSrc(input: string | undefined | null): string | null {
  const raw = input?.trim();
  if (!raw) return null;

  const iframeMatch = raw.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeMatch?.[1] && isAllowedGoogleEmbedSrc(iframeMatch[1])) {
    return iframeMatch[1];
  }

  if (raw.includes('google.com/maps/embed')) {
    const srcMatch = raw.match(/src=["']([^"']+)["']/i);
    if (srcMatch?.[1] && isAllowedGoogleEmbedSrc(srcMatch[1])) {
      return srcMatch[1];
    }
    const firstToken = raw.split(/\s/)[0];
    if (/^https?:\/\//i.test(firstToken) && isAllowedGoogleEmbedSrc(firstToken)) {
      return firstToken;
    }
  }

  return null;
}

function buildEmbedFromQuery(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function extractMapsQuery(raw: string): string | null {
  if (raw.includes('google.com/maps/embed')) {
    return null;
  }

  try {
    const url = new URL(raw);
    const q = url.searchParams.get('q') || url.searchParams.get('query');
    if (q?.trim()) return q.trim();
  } catch {
    // not a valid URL — fall through
  }

  const placeMatch = raw.match(/\/maps\/place\/([^/?#]+)/);
  if (placeMatch?.[1]) {
    return decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')).trim();
  }

  const coordsMatch = raw.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (coordsMatch) {
    return `${coordsMatch[1]},${coordsMatch[2]}`;
  }

  return null;
}

/**
 * Builds a no-API-key embed URL using the standard output=embed query param.
 * Supports embed URLs, ?q= links, /maps/place/ share URLs, and @lat,lng coordinates.
 */
export function toGoogleMapsEmbedUrlNoKey(input: string | undefined | null): string | null {
  const raw = input?.trim();
  if (!raw) return null;

  const fromHtml = extractGoogleMapsEmbedSrc(raw);
  if (fromHtml) return fromHtml;

  if (raw.includes('google.com/maps/embed')) {
    return raw;
  }

  const query = extractMapsQuery(raw);
  if (query) {
    return buildEmbedFromQuery(query);
  }

  if (!raw.includes('://')) {
    return buildEmbedFromQuery(raw);
  }

  return null;
}

export function embedFromAddress(address: string | undefined | null): string | null {
  const trimmed = address?.trim();
  if (!trimmed) return null;
  return buildEmbedFromQuery(trimmed);
}

export function buildGoogleMapsDirectionsUrl(address: string | undefined | null): string | null {
  const trimmed = address?.trim();
  if (!trimmed) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`;
}

/**
 * Resolves the iframe src for the store locator map.
 * Prefers the selected store's embed src, then address, then optional global default embed.
 */
export function resolveStoreMapEmbedUrl(
  mapEmbedUrl?: string | null,
  storeMapEmbedSrc?: string | null,
  storeAddress?: string | null
): string | null {
  const fromStore =
    storeMapEmbedSrc?.trim() ||
    embedFromAddress(storeAddress);
  if (fromStore) return fromStore;

  return extractGoogleMapsEmbedSrc(mapEmbedUrl) || toGoogleMapsEmbedUrlNoKey(mapEmbedUrl);
}
