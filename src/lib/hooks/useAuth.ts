'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/store';
import { login, logout, setGuest, clearGuest, AuthUser, GuestInfo } from '@/lib/store/authSlice';
import { clearCart } from '@/lib/store/cartSlice';
import {
  apiLogin,
  apiRegister,
  setStoredToken,
  clearStoredToken,
  clearGuestOrdersToken,
} from '@/lib/api/client';

export function useAuth() {
  const dispatch = useDispatch();
  const router   = useRouter();
  const { user, token, isGuest, guestInfo } = useSelector((s: RootState) => s.auth);

  const isLoggedIn = !!user;

  /** Sign in with email + password. Returns error string or null on success. */
  async function signIn(email: string, password: string): Promise<string | null> {
    const res = await apiLogin(email, password);
    if (!res.success || !res.data) {
      return res.message ?? 'Invalid email or password.';
    }
    const { user: apiUser, accessToken } = res.data;
    const authUser: AuthUser = {
      id: apiUser._id,
      firstName: apiUser.name.split(' ')[0] ?? apiUser.name,
      lastName: apiUser.name.split(' ').slice(1).join(' ') ?? '',
      email: apiUser.email,
      phone: '',
    };
    setStoredToken(accessToken);
    dispatch(login({ user: authUser, token: accessToken }));
    return null;
  }

  async function register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<string | null> {
    const res = await apiRegister(data);
    if (!res.success || !res.data) {
      return res.message ?? 'Unable to register. Please try again.';
    }
    const { user: apiUser, accessToken } = res.data;
    const authUser: AuthUser = {
      id: apiUser._id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: apiUser.email,
      phone: data.phone,
    };
    setStoredToken(accessToken);
    dispatch(login({ user: authUser, token: accessToken }));
    return null;
  }

  /** Continue as guest with basic contact info. */
  function continueAsGuest(info: GuestInfo) {
    dispatch(setGuest(info));
  }

  /** Sign out and go home. */
  function signOut() {
    clearStoredToken();
    clearGuestOrdersToken();
    dispatch(logout());
    dispatch(clearCart());
    if (typeof document !== 'undefined') {
      const cookies = document.cookie ? document.cookie.split(';') : [];
      for (const cookie of cookies) {
        const eqIdx = cookie.indexOf('=');
        const rawName = eqIdx > -1 ? cookie.slice(0, eqIdx) : cookie;
        const name = rawName.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    }
    router.push('/');
  }

  function clearGuestSession() {
    clearStoredToken();
    clearGuestOrdersToken();
    dispatch(clearGuest());
    dispatch(clearCart());
    if (typeof document !== 'undefined') {
      const cookies = document.cookie ? document.cookie.split(';') : [];
      for (const cookie of cookies) {
        const eqIdx = cookie.indexOf('=');
        const rawName = eqIdx > -1 ? cookie.slice(0, eqIdx) : cookie;
        const name = rawName.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    }
    router.push('/');
  }

  return {
    user,
    token,
    isLoggedIn,
    isGuest,
    guestInfo,
    isAuthenticated: isLoggedIn || isGuest,
    signIn,
    register,
    continueAsGuest,
    signOut,
    clearGuest: clearGuestSession,
  };
}
