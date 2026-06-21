'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { RiWhatsappFill } from 'react-icons/ri';
import { useSelector, useDispatch } from 'react-redux';
import { usePathname } from 'next/navigation';
import { RootState } from '@/lib/store';
import { openFinder } from '@/lib/store/uiSlice';

// Ordering / checkout flows where the floating buttons would overlap the
// price, order summary and primary CTA — hide them here.
const HIDDEN_ON_PREFIXES = ['/cart', '/checkout', '/order-confirmation'];

export function FloatingSidebar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const finderOpen = useSelector((s: RootState) => s.ui.finderOpen);
  const cartDrawerOpen = useSelector((s: RootState) => s.ui.cartDrawerOpen);
  const mobileNavOpen = useSelector((s: RootState) => s.ui.mobileNavOpen);

  const hiddenForRoute = HIDDEN_ON_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  // Also hide whenever an overlay (cart drawer / mobile nav) is open — the
  // floating buttons would otherwise sit on top of the drawer's price & CTA.
  const hidden = finderOpen || cartDrawerOpen || mobileNavOpen || hiddenForRoute;

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed bottom-24 right-4 z-[140] flex flex-col gap-3 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* WhatsApp Button */}
          <motion.a
            href="https://wa.me/971505566655"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: '#25D366', border: '2px solid rgba(255,255,255,0.3)', color: 'white' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <RiWhatsappFill size={28} />
          </motion.a>

          {/* Find Your Scent Button */}
          <motion.button
            onClick={() => dispatch(openFinder())}
            aria-label="Find Your Scent"
            className="flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: '#1A0A2E', border: '2px solid rgba(201,168,76,0.6)', color: '#C9A84C' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Sparkles size={22} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
