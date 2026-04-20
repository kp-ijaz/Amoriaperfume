'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/lib/store';
import { login, logout, setGuest, clearGuest, AuthUser, GuestInfo } from '@/lib/store/authSlice';
import { clearCart } from '@/lib/store/cartSlice';

// Demo accounts that always work
const DEMO_ACCOUNTS = [
  { id: 'u1', firstName: 'Ahmed', lastName: 'Al Rashid', email: 'ahmed@demo.com', phone: '+971501234567', passwordHash: btoa('password123') },
  { id: 'u2', firstName: 'Sara',  lastName: 'Al Mansouri', email: 'sara@demo.com', phone: '+971507654321', passwordHash: btoa('password123') },
];

const USERS_KEY = 'amoria_users';

function getStoredUsers(): typeof DEMO_ACCOUNTS {
  if (typeof window === 'undefined') return DEMO_ACCOUNTS;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? [...DEMO_ACCOUNTS, ...JSON.parse(raw)] : DEMO_ACCOUNTS;
  } catch {
    return DEMO_ACCOUNTS;
  }
}

function saveNewUser(user: typeof DEMO_ACCOUNTS[0]) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    localStorage.setItem(USERS_KEY, JSON.stringify([...existing, user]));
  } catch { /* ignore */ }
}

export function useAuth() {
  const dispatch = useDispatch();
  const router   = useRouter();
  const { user, isGuest, guestInfo } = useSelector((s: RootState) => s.auth);

  const isLoggedIn = !!user;

  /** Sign in with email + password. Returns error string or null on success. */
  async function signIn(email: string, password: string): Promise<string | null> {
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    const all = getStoredUsers();
    const found = all.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === btoa(password)
    );
    if (!found) return 'Invalid email or password. Try ahmed@demo.com / password123';
    const { passwordHash: _, ...authUser } = found;
    dispatch(login(authUser));
    return null;
  }

  /** Register a new account. Returns error string or null on success. */
  async function register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<string | null> {
    await new Promise((r) => setTimeout(r, 900));
    const all = getStoredUsers();
    if (all.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return 'An account with this email already exists.';
    }
    const newUser = {
      id: `u_${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      passwordHash: btoa(data.password),
    };
    saveNewUser(newUser);
    const { passwordHash: _, ...authUser } = newUser;
    dispatch(login(authUser));
    return null;
  }

  /** Continue as guest with basic contact info. */
  function continueAsGuest(info: GuestInfo) {
    dispatch(setGuest(info));
  }

  /** Sign out and go home. */
  function signOut() {
    dispatch(logout());
    dispatch(clearCart());
    router.push('/');
  }

  return {
    user,
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
