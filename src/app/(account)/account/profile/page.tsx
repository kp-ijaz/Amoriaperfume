'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useProfile } from '@/lib/hooks/useProfile';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { ProfileAddressSection } from '@/components/account/ProfileAddressSection';

export default function ProfilePage() {
  const { isAuthenticated, isLoggedIn } = useAuth();
  const { data: user, isLoading, updateProfile } = useProfile();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="mb-4">Please sign in to view your profile.</p>
        <Link href="/login" className="underline" style={{ color: 'var(--color-amoria-accent)' }}>
          Sign in
        </Link>
      </div>
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ name, phone });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await updateProfile.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Password update failed');
    }
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex justify-center">
        <span className="w-8 h-8 border-2 border-[#1A0A2E]/20 border-t-[#1A0A2E] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        My Profile
      </h1>

      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: 'var(--color-amoria-primary)' }}
        >
          {initials || '?'}
        </div>
        <div>
          <p className="font-semibold" style={{ color: 'var(--color-amoria-text)' }}>{name}</p>
          <p className="text-sm text-stone-500">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4 border p-6 mb-6 bg-white" style={{ borderColor: 'var(--color-amoria-border)' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-amoria-primary)' }}>Personal Information</h2>
        <div>
          <label className="text-xs uppercase tracking-wider block mb-1.5 text-stone-500">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider block mb-1.5 text-stone-500">Email</label>
          <input value={user?.email ?? ''} readOnly className="w-full border px-3 py-2.5 text-sm bg-gray-50 cursor-not-allowed" style={{ borderColor: 'var(--color-amoria-border)' }} />
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider block mb-1.5 text-stone-500">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
        </div>
        <button type="submit" disabled={updateProfile.isPending} className="px-6 py-2.5 text-sm font-semibold disabled:opacity-70 text-white" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
          {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {isLoggedIn && <ProfileAddressSection />}

      <form onSubmit={handlePassword} className="border p-6 bg-white" style={{ borderColor: 'var(--color-amoria-border)' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-amoria-primary)' }}>Change Password</h2>
        <div className="space-y-3">
          <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
          <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
          <button type="submit" disabled={updateProfile.isPending} className="px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-70" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}

