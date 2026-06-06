const OBJECT_ID_PATTERN = /^[a-f0-9]{24}$/i;

export function normalizeCheckoutMobile(phone: string): string {
  const raw = String(phone || '').trim();
  const digits = raw.replace(/\D/g, '');
  if (digits.length >= 10) return digits.slice(0, 15);
  return raw.replace(/\s+/g, '');
}

export function shippingPincode(postcode?: string | null): string {
  return String(postcode ?? '').trim();
}

export function buildShippingAddress(address: {
  street: string;
  area: string;
  emirate: string;
  postcode?: string | null;
}) {
  return {
    fullAddress: `${address.street}, ${address.area}`,
    city: address.emirate,
    state: address.emirate,
    pincode: shippingPincode(address.postcode),
    country: 'UAE',
  };
}

export function pickObjectId(...candidates: (string | undefined)[]): string | undefined {
  for (const candidate of candidates) {
    const id = String(candidate || '').trim();
    if (OBJECT_ID_PATTERN.test(id)) return id;
  }
  return undefined;
}
