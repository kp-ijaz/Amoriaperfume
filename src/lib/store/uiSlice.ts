import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  cartDrawerOpen: boolean;
  mobileNavOpen: boolean;
  searchQuery: string;
  recentlyViewed: string[]; // product ids, max 6
}

const initialState: UIState = {
  cartDrawerOpen: false,
  mobileNavOpen: false,
  searchQuery: '',
  recentlyViewed: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCartDrawer(state) {
      state.cartDrawerOpen = true;
    },
    closeCartDrawer(state) {
      state.cartDrawerOpen = false;
    },
    toggleCartDrawer(state) {
      state.cartDrawerOpen = !state.cartDrawerOpen;
    },
    openMobileNav(state) {
      state.mobileNavOpen = true;
    },
    closeMobileNav(state) {
      state.mobileNavOpen = false;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    addToRecentlyViewed(state, action: PayloadAction<string>) {
      const filtered = state.recentlyViewed.filter((id) => id !== action.payload);
      state.recentlyViewed = [action.payload, ...filtered].slice(0, 6);
    },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  openMobileNav,
  closeMobileNav,
  setSearchQuery,
  addToRecentlyViewed,
} = uiSlice.actions;

export default uiSlice.reducer;
