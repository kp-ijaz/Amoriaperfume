import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartState, CouponCode } from '@/types/cart';
import { Product, ProductVariant } from '@/types/product';

const initialState: CartState = {
  items: [],
  coupon: null,
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
        (item) => item.product.id === product.id && item.variant.id === variant.id
      );
      if (existingIndex >= 0) {
        state.items[existingIndex].quantity += quantity;
      } else {
        state.items.push({ product, variant, quantity });
      }
    },
    removeItem(state, action: PayloadAction<{ productId: string; variantId: string }>) {
      state.items = state.items.filter(
        (item) =>
          !(item.product.id === action.payload.productId && item.variant.id === action.payload.variantId)
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; variantId: string; quantity: number }>
    ) {
      const { productId, variantId, quantity } = action.payload;
      const item = state.items.find(
        (i) => i.product.id === productId && i.variant.id === variantId
      );
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.product.id === productId && i.variant.id === variantId)
          );
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
    },
    applyCoupon(state, action: PayloadAction<CouponCode>) {
      state.coupon = action.payload;
    },
    removeCoupon(state) {
      state.coupon = null;
    },
    saveForLater(state, action: PayloadAction<{ productId: string; variantId: string }>) {
      const { productId, variantId } = action.payload;
      const itemIndex = state.items.findIndex(
        (i) => i.product.id === productId && i.variant.id === variantId
      );
      if (itemIndex >= 0) {
        const [item] = state.items.splice(itemIndex, 1);
        state.savedItems.push(item);
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
  removeItem,
  updateQuantity,
  clearCart,
  applyCoupon,
  removeCoupon,
  saveForLater,
  moveToCart,
} = cartSlice.actions;

export default cartSlice.reducer;
