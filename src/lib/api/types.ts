// Raw API response types from https://amoria-backend.onrender.com

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// ─── Product ─────────────────────────────────────────────────────────────────

export interface ApiSizeVariant {
  _id: string;
  size: string;         // "50 ml", "100 ml", "30 ml"
  stock: number;
  sku: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  finalPrice: number;   // in AED
  outOfStock: boolean;
}

export interface ApiProductVariant {
  _id: string;
  colorName: string;
  colorCode: string;
  images: string[];
  sizeArray: ApiSizeVariant[];
}

export interface ApiProduct {
  _id: string;
  slug: string;
  name: string;
  sku: string;
  brand: {
    _id: string;
    name: string;
    logo: string;
    slug?: string;
  };
  description: string;
  shortDescription?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  minimumQuantity: number;
  features: string[];
  careGuide?: string;
  images: string[];
  thumbnail: string[];
  mrp: number;          // in AED
  freeShipping: boolean;
  refundable: boolean;
  returnable: boolean;
  cashOnDelivery: boolean;
  featured: boolean;
  bestSeller?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  limitedOffer?: boolean;
  brandInspiration?: boolean;
  inspiredBrand?: string;
  viewCount?: number;
  published: boolean;
  gender: 'men' | 'women' | 'unisex';
  concentration: string;
  seasons?: ('summer' | 'winter' | 'autumn' | 'spring')[];
  dayNight?: 'day' | 'night' | 'both';
  sillage?: string;
  longevity?: string;
  variants: ApiProductVariant[];
  fragranceNotes: {
    topNotes: string[];
    middleNotes: string[];
    baseNotes: string[];
  };
  ratings: {
    avg: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface ApiCategory {
  _id: string;
  name: string;
  image: string;
  status: 'active' | 'inactive';
  parent: string | null;
  description: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Brand ───────────────────────────────────────────────────────────────────

export interface ApiBrand {
  _id: string;
  name: string;
  logo: string;
  active: boolean;
  slug: string;
  description?: string;
  /** First published product image for this brand; null when no products. */
  productCoverImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Collection ──────────────────────────────────────────────────────────────

export interface ApiCollection {
  _id: string;
  name: string;
  description: string;
  image?: string;
  heroImage: string;
  coverImage?: string;
  productIds: {
    _id: string;
    name: string;
    sku: string;
    thumbnail: string[];
  }[];
  active: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Gift Set ────────────────────────────────────────────────────────────────

export type ApiGiftSetOccasion = 'eid' | 'wedding' | 'birthday' | 'corporate' | 'general';

export interface ApiGiftSetItemProduct {
  _id: string;
  name: string;
  slug?: string;
  sku?: string;
  images?: string[];
  brand?: { _id: string; name: string; slug?: string };
  category?: { _id: string; name: string; slug?: string };
  variants?: ApiProductVariant[];
}

export interface ApiGiftSetItem {
  productId: string | ApiGiftSetItemProduct;
  variantId: string;
  sizeVariantId: string;
  quantity: number;
}

export interface ApiGiftSet {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  images?: string[];
  imagePublicIds?: string[];
  coverImage: string;
  coverImagePublicId?: string;
  occasion?: ApiGiftSetOccasion;
  items: ApiGiftSetItem[];
  mrp: number;
  giftSetPrice: number;
  active: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Bundle ──────────────────────────────────────────────────────────────────

export interface ApiBundleItem {
  productId: string | ApiGiftSetItemProduct;
  variantId: string;
  sizeVariantId: string;
  quantity: number;
}

export interface ApiBundle {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  images?: string[];
  imagePublicIds?: string[];
  coverImage?: string;
  coverImagePublicId?: string;
  items: ApiBundleItem[];
  mrp: number;
  bundlePrice: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface ApiReview {
  _id: string;
  product: {
    _id: string;
    name: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface ApiOrderItem {
  productId?: string;
  variantId?: string;
  sizeVariantId?: string;
  packageType?: 'bundle' | 'gift_set';
  packageId?: string;
  packageSlug?: string;
  includedItems?: {
    productId: string;
    variantId?: string;
    sizeVariantId?: string;
    quantity: number;
    productName?: string;
  }[];
  quantity: number;
  productName: string;
  brand: string;
  image: string;
  price: number;      // in AED
  totalPrice: number; // in AED
}

export interface ApiOrder {
  _id: string;
  orderId: string;
  userId: string;
  createdBy: 'USER' | 'ADMIN';
  customerDetails: {
    name: string;
    email: string;
    /** Primary phone field from API */
    mobile?: string;
    /** Legacy alias; some orders may only have this */
    phone?: string;
  };
  shippingAddress?: {
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: ApiOrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    shippingCharge: number;
    tax: number;
    totalAmount: number;
  };
  payment: {
    paymentMethod: 'COD' | 'ONLINE' | 'TAMARA';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
    transactionId: string;
  };
  logistics?: {
    trackingId: string;
    courierName: string;
  };
  status?: string;
  orderStatus?: string;
  fulfillmentType?: 'DELIVERY' | 'PICKUP';
  statusHistory?: { status: string; updatedAt?: string }[];
  invoiceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Promotion ───────────────────────────────────────────────────────────────

export interface ApiPromotion {
  _id: string;
  name: string;
  code: string;
  description?: string;
  kind: 'percent_off' | 'fixed_off' | 'free_shipping';
  value: number;
  maxDiscountAmount?: number | null;
  minSubtotal: number;
  firstOrderOnly?: boolean;
  applicableCategoryIds?: string[];
  applicableProductIds?: string[];
  maxUses?: number | null;
  usedCount?: number;
  active: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PromotionValidateLineItem {
  productId?: string;
  categoryId?: string | null;
  quantity: number;
  lineTotal: number;
}

export interface PromotionValidateRequest {
  code: string;
  subtotal: number;
  lineItems: PromotionValidateLineItem[];
  customerEmail?: string;
}

export interface PromotionValidateResult {
  code: string;
  kind: 'percent_off' | 'fixed_off' | 'free_shipping';
  discountAmount: number;
  freeShipping: boolean;
  eligibleSubtotal: number;
  label?: string;
}

export interface ShippingQuoteRequest {
  country: string;
  subtotal: number;
}

export interface ShippingQuoteResponse {
  shippingCharge: number;
  freeShippingApplied: boolean;
  matchedRule: {
    _id: string;
    name: string;
    zone: 'AE' | 'GCC' | 'INTL' | 'OTHER';
    baseRate: number;
    freeOverSubtotal: number | null;
  } | null;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface ApiAuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiLoginResponse {
  user: ApiAuthUser;
  accessToken: string;
  refreshToken: string;
}

// ─── Create Order request ─────────────────────────────────────────────────────

export interface CreateOrderRequest {
  fulfillmentType?: 'DELIVERY' | 'PICKUP';
  couponCode?: string;
  giftCardCode?: string;
  customerDetails: {
    name: string;
    email: string;
    phone?: string;
    mobile?: string;
  };
  shippingAddress?: {
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: (
    | {
        productId: string;
        variantId?: string;
        sizeVariantId?: string;
        quantity: number;
      }
    | {
        packageType: 'bundle' | 'gift_set';
        packageId: string;
        quantity: number;
      }
  )[];
  paymentMethod?: 'COD' | 'ONLINE' | 'TAMARA';
  stripePaymentIntentId?: string;
  paymentError?: string;
  pricing?: {
    discount?: number;
    shippingCharge?: number;
    tax?: number;
  };
  pickupDetails?: {
    storeName: string;
    storeAddress: string;
    pickupSlot?: string;
    pickupNote?: string;
  };
}
