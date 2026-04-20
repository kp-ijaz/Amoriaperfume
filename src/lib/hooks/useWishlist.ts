'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/store';
import { addItem, removeItem, toggle } from '@/lib/store/wishlistSlice';

export function useWishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.wishlist);

  return {
    items,
    isInWishlist: (productId: string) => items.includes(productId),
    addToWishlist: (productId: string) => dispatch(addItem(productId)),
    removeFromWishlist: (productId: string) => dispatch(removeItem(productId)),
    toggleWishlist: (productId: string) => dispatch(toggle(productId)),
    count: items.length,
  };
}
