import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { getStoredToken } from '@/lib/api/client';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isGuest: boolean;
  guestInfo: GuestInfo | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isGuest: false,
  guestInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isGuest = false;
      state.guestInfo = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isGuest = false;
      state.guestInfo = null;
    },
    setGuest(state, action: PayloadAction<GuestInfo>) {
      state.isGuest = true;
      state.guestInfo = action.payload;
      state.user = null;
      state.token = null;
    },
    clearGuest(state) {
      state.isGuest = false;
      state.guestInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      const incoming = (
        action as { payload?: { auth?: AuthState } | null }
      ).payload?.auth;
      if (!incoming?.user) return;
      state.user = incoming.user;
      state.isGuest = incoming.isGuest ?? false;
      state.guestInfo = incoming.guestInfo ?? null;
      state.token = incoming.token || (typeof window !== 'undefined' ? getStoredToken() : null);
    });
  },
});

export const { login, logout, setGuest, clearGuest } = authSlice.actions;
export default authSlice.reducer;
