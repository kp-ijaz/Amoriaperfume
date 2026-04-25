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
  finalPrice: number;   // in fils (÷100 → AED)
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
  name: string;
  sku: string;
  brand: {
    _id: string;
    name: string;
    logo: string;
  };
  description: string;
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
  mrp: number;          // in fils (÷100 → AED)
  freeShipping: boolean;
  refundable: boolean;
  returnable: boolean;
  cashOnDelivery: boolean;
  featured: boolean;
  published: boolean;
  fragranceFamily: string;
  gender: 'men' | 'women' | 'unisex';
  concentration: string;
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
  createdAt: string;
  updatedAt: string;
}

// ─── Collection ──────────────────────────────────────────────────────────────

export interface ApiCollection {
  _id: string;
  name: string;
  description: string;
  heroImage: string;
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
  productId: string;
  variantId: string;
  sizeVariantId: string;
  quantity: number;
  productName: string;
  brand: string;
  image: string;
  price: number;      // in fils
  totalPrice: number; // in fils
}

export interface ApiOrder {
  _id: string;
  orderId: string;
  userId: string;
  createdBy: 'USER' | 'ADMIN';
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
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
    paymentMethod: 'COD' | 'ONLINE';
    paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
    transactionId: string;
  };
  logistics: {
    trackingId: string;
    courierName: string;
  };
  status?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Promotion ───────────────────────────────────────────────────────────────

export interface ApiPromotion {
  _id: string;
  name: string;
  code: string;
  kind: 'percent_off' | 'fixed_off' | 'free_shipping';
  value: number;
  minSubtotal: number; // in fils
  active: boolean;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface ApiAuthUser {
  _id: string;
  name: string;
  email: string;
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
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    fullAddress: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: {
    productId: string;
    variantId: string;
    sizeId: string;
    quantity: number;
    price: number; // in fils
  }[];
  paymentMethod: 'COD' | 'ONLINE';
  subtotal: number;   // in fils
  totalAmount: number; // in fils
  couponCode?: string;
  discount?: number;
}
