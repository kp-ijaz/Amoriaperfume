import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CartItem,
  CartState,
  AppliedCoupon,
  AppliedGiftCard,
  PackageCartItem,
  ProductCartItem,
  isPackageCartItem,
  isProductCartItem,
} from '@/types/cart';
import { Product, ProductVariant } from '@/types/product';
import { packageCartKey } from '@/lib/cart/packageCartItem';

const initialState: CartState = {
  items: [],
  coupon: null,
  giftCard: null,
  savedItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{ product: Product; variant: ProductVariant; quantity?: number }>
    ) {
      const { product, variant, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) =>
          isProductCartItem(item) &&
          item.product.id === product.id &&
          item.variant.id === variant.id
      );
      if (existingIndex >= 0) {
        const existing = state.items[existingIndex];
        if (isProductCartItem(existing)) {
          existing.quantity += quantity;
        }
      } else {
        state.items.push({ kind: 'product', product, variant, quantity });
      }
    },
    addPackageItem(state, action: PayloadAction<{ item: PackageCartItem; quantity?: number }>) {
      const { item, quantity = 1 } = action.payload;
      const key = packageCartKey(item.packageType, item.packageId);
      const existingIndex = state.items.findIndex(
        (row) =>
          isPackageCartItem(row) &&
          packageCartKey(row.packageType, row.packageId) === key
      );
      if (existingIndex >= 0) {
        const existing = state.items[existingIndex];
        if (isPackageCartItem(existing)) {
          existing.quantity += quantity;
        }
      } else {
        state.items.push({ ...item, quantity });
      }
    },
    removeItem(state, action: PayloadAction<{ productId: string; variantId: string }>) {
      state.items = state.items.filter(
        (item) =>
          !(
            isProductCartItem(item) &&
            item.product.id === action.payload.productId &&
            item.variant.id === action.payload.variantId
          )
      );
    },
    removePackageItem(
      state,
      action: PayloadAction<{ packageType: PackageCartItem['packageType']; packageId: string }>
    ) {
      const key = packageCartKey(action.payload.packageType, action.payload.packageId);
      state.items = state.items.filter(
        (item) =>
          !(
            isPackageCartItem(item) &&
            packageCartKey(item.packageType, item.packageId) === key
          )
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; variantId: string; quantity: number }>
    ) {
      const { productId, variantId, quantity } = action.payload;
      const item = state.items.find(
        (i) =>
          isProductCartItem(i) && i.product.id === productId && i.variant.id === variantId
      );
      if (item && isProductCartItem(item)) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) =>
              !(
                isProductCartItem(i) &&
                i.product.id === productId &&
                i.variant.id === variantId
              )
          );
        } else {
          item.quantity = quantity;
        }
      }
    },
    updatePackageQuantity(
      state,
      action: PayloadAction<{
        packageType: PackageCartItem['packageType'];
        packageId: string;
        quantity: number;
      }>
    ) {
      const { packageType, packageId, quantity } = action.payload;
      const key = packageCartKey(packageType, packageId);
      const item = state.items.find(
        (i) =>
          isPackageCartItem(i) && packageCartKey(i.packageType, i.packageId) === key
      );
      if (item && isPackageCartItem(item)) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) =>
              !(
                isPackageCartItem(i) &&
                packageCartKey(i.packageType, i.packageId) === key
              )
          );
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      state.giftCard = null;
    },
    applyCoupon(state, action: PayloadAction<AppliedCoupon>) {
      state.coupon = action.payload;
    },
    removeCoupon(state) {
      state.coupon = null;
    },
    applyGiftCard(state, action: PayloadAction<AppliedGiftCard>) {
      state.giftCard = action.payload;
    },
    removeGiftCard(state) {
      state.giftCard = null;
    },
    saveForLater(state, action: PayloadAction<{ productId: string; variantId: string }>) {
      const { productId, variantId } = action.payload;
      const itemIndex = state.items.findIndex(
        (i) =>
          isProductCartItem(i) && i.product.id === productId && i.variant.id === variantId
      );
      if (itemIndex >= 0) {
        const row = state.items[itemIndex];
        if (isProductCartItem(row)) {
          state.items.splice(itemIndex, 1);
          state.savedItems.push(row);
        }
      }
    },
    moveToCart(state, action: PayloadAction<{ productId: string; variantId: string }>) {
      const { productId, variantId } = action.payload;
      const itemIndex = state.savedItems.findIndex(
        (i) => i.product.id === productId && i.variant.id === variantId
      );
      if (itemIndex >= 0) {
        const [item] = state.savedItems.splice(itemIndex, 1);
        state.items.push(item);
      }
    },
  },
});

export const {
  addItem,
  addPackageItem,
  removeItem,
  removePackageItem,
  updateQuantity,
  updatePackageQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  applyGiftCard,
  removeGiftCard,
  saveForLater,
  moveToCart,
} = cartSlice.actions;

export default cartSlice.reducer;
