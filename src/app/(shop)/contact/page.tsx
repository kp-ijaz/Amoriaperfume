'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setForm({ name: '', email: '', subject: '', message: '' });
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
  }

  return (
    <div>
      <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
        <h1 className="text-3xl md:text-4xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          Contact Us
        </h1>
        <p className="text-white/60 text-sm mt-2">We&apos;re here to help</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
              Get in Touch
            </h2>
            <div className="space-y-5">
              <a href="https://wa.me/971501234567" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(26,10,46,0.08)' }}>
                  <MessageCircle size={18} style={{ color: 'var(--color-amoria-accent)' }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>WhatsApp</p>
                  <p className="text-sm font-medium group-hover:opacity-80" style={{ color: 'var(--color-amoria-text)' }}>+971 50 123 4567</p>
                </div>
              </a>
              <a href="mailto:hello@amoria.ae" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(26,10,46,0.08)' }}>
                  <Mail size={18} style={{ color: 'var(--color-amoria-accent)' }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Email</p>
                  <p className="text-sm font-medium group-hover:opacity-80" style={{ color: 'var(--color-amoria-text)' }}>hello@amoria.ae</p>
                </div>
              </a>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(26,10,46,0.08)' }}>
                  <MapPin size={18} style={{ color: 'var(--color-amoria-accent)' }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-amoria-text-muted)' }}>Location</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-amoria-text)' }}>Dubai, United Arab Emirates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Name</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Email</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Subject</label>
              <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border px-3 py-2.5 text-sm outline-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider block mb-1.5" style={{ color: 'var(--color-amoria-text-muted)' }}>Message</label>
              <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border px-3 py-2.5 text-sm outline-none resize-none" style={{ borderColor: 'var(--color-amoria-border)' }} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 text-sm font-semibold disabled:opacity-70" style={{ backgroundColor: 'var(--color-amoria-primary)', color: 'white' }}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
