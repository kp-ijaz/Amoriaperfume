import Link from 'next/link';
import { Camera, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-amoria-dark)' }}>
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div>
            <Link href="/" className="flex items-center gap-1 mb-4">
              <span
                className="text-2xl font-bold tracking-[0.15em]"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)' }}
              >
                AMORIA
              </span>
              <span className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: 'var(--color-amoria-accent)' }} />
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Your destination for authentic Arabian fragrances. We bring you the finest attars, ouds, and perfumes from the most celebrated houses of the region.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/amoria.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
              >
                <Camera size={16} />
              </a>
              <a
                href="https://wa.me/971501234567"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="https://tiktok.com/@amoria.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors text-xs font-bold"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
              >
                TK
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-amoria-accent)' }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'All Products', href: '/products' },
                { label: 'Brands', href: '/brands' },
                { label: 'Fragrance Guide', href: '/fragrance-guide' },
                { label: 'About Us', href: '/about' },
                { label: 'Fragrance Finder', href: '/fragrance-finder' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-100"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-amoria-accent)' }}>
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'FAQs', href: '/faqs' },
                { label: 'Track Order', href: '/track-order' },
                { label: 'Returns & Exchange', href: '/faqs#returns' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:opacity-100"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-amoria-accent)' }}>
              Contact Us
            </h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a href="https://wa.me/971501234567" className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <Phone size={14} className="mt-0.5 flex-shrink-0" />
                  +971 50 123 4567
                </a>
              </li>
              <li>
                <a href="mailto:hello@amoria.ae" className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <Mail size={14} className="mt-0.5 flex-shrink-0" />
                  hello@amoria.ae
                </a>
              </li>
              <li>
                <span className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  Dubai, United Arab Emirates
                </span>
              </li>
            </ul>

            {/* Payment badges */}
            <div>
              <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>We Accept</p>
              <div className="flex gap-2 flex-wrap">
                {['VISA', 'MC', 'APPAY', 'COD'].map((badge) => (
                  <span
                    key={badge}
                    className="text-[10px] font-bold px-2 py-1 rounded"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gold divider */}
        <div className="h-px mb-6" style={{ backgroundColor: 'rgba(201,168,76,0.2)' }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © 2025 Amoria. All rights reserved. Made with ❤ in UAE.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'rgba(255,255,255,0.35)' }}>Privacy Policy</Link>
            <Link href="/terms" className="text-xs hover:opacity-80 transition-opacity" style={{ color: 'rgba(255,255,255,0.35)' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
