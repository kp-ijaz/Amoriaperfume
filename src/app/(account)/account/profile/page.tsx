'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ firstName: 'Ahmed', lastName: 'Al Rashid', email: 'ahmed@email.com', phone: '+971501234567' });
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success('Profile updated successfully');
  }

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-8" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
        My Profile
      </h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: 'var(--color-amoria-primary)' }}
        >
          {initials}
        </div>
        <div>
          <p className="font-semibold" style={{ color: 'var(--color-amoria-text)' }}>{profile.firstName} {profile.lastName}</p>
          <button className="text-xs mt-1 hover:opacity-80" style={{ color: 'var(--color-amoria-accent)' }}>
            Change Photo
          </button>
        </div>
      </div>

      {/* Profile form */}
      <form onSubmit={handleSave} className="space-y-4 border p-6 mb-6" style={{ borderColor: 'var(--color-amoria-border)', backgroundColor: 'white' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-amoria-primary)' }}>Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>First Name</label>
            <input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Last Name</label>
            <input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Email</label>
          <input value={profile.email} readOnly className="w-full border px-3 py-2.5 text-sm outline-none bg-gray-50 cursor-not-allowed" style={{ borderColor: 'var(--color-amoria-border)', color: 'var(--color-amoria-text-muted)' }} />
          <p className="text-xs mt-1" style={{ color: 'var(--color-amoria-text-muted)' }}>Contact support to change email</p>
        </div>
        <div>
          <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Phone</label>
          <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
        </div>
        <button type="submit" disabled={saving} className="px-6 py-2.5 text-sm font-semibold disabled:opacity-70" style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Change password */}
      <div className="border p-6" style={{ borderColor: 'var(--color-amoria-border)', backgroundColor: 'white' }}>
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-amoria-primary)' }}>Change Password</h2>
        <div className="space-y-3">
          <input type="password" placeholder="Current Password" className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
          <input type="password" placeholder="New Password" className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
          <input type="password" placeholder="Confirm New Password" className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
          <button className="px-6 py-2.5 text-sm font-semibold" style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
