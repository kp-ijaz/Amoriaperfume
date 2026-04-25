'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/store';
import { login, logout, setGuest, clearGuest, AuthUser, GuestInfo } from '@/lib/store/authSlice';
import { clearCart } from '@/lib/store/cartSlice';
import { apiLogin, setStoredToken, clearStoredToken } from '@/lib/api/client';

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

  /** Register — currently the API has admin-only login; register saves locally
   *  and falls back to the admin API login for demo purposes.
   *  TODO: Replace when a customer register endpoint is available. */
  async function register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<string | null> {
    // Attempt API login in case admin credentials are supplied
    const res = await apiLogin(data.email, data.password);
    if (res.success && res.data) {
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
    // Fallback: store locally so the form appears to work for demo
    const authUser: AuthUser = {
      id: `local_${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    };
    dispatch(login({ user: authUser, token: '' }));
    return null;
  }

  /** Continue as guest with basic contact info. */
  function continueAsGuest(info: GuestInfo) {
    dispatch(setGuest(info));
  }

  /** Sign out and go home. */
  function signOut() {
    clearStoredToken();
    dispatch(logout());
    dispatch(clearCart());
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
    clearGuest: () => dispatch(clearGuest()),
  };
}
