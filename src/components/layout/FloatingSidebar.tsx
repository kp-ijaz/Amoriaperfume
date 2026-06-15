'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { openFinder } from '@/lib/store/uiSlice';

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6.29-.97C9.95 21.63 10.97 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2m0 18c-1.41 0-2.73-.3-3.96-.82l-.28-.15-2.9.44.44-2.9-.15-.28C4.3 14.73 4 13.41 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8m3.86-8.38c-.21-.1-1.24-.61-1.43-.68-.19-.08-.33-.12-.47.12-.14.24-.54.68-.66.82-.12.14-.24.16-.45.05-.21-.11-1.06-.4-2.03-1.26-.75-.67-1.26-1.5-1.4-1.71-.14-.21-.02-.32.11-.43.11-.11.24-.28.37-.42.12-.14.16-.24.25-.4.08-.16.04-.3-.02-.42-.06-.12-.47-1.13-.64-1.55-.17-.39-.33-.34-.47-.34-.12 0-.26 0-.4 0-.14 0-.36.05-.55.25-.19.2-.72.7-.72 1.73 0 1.02.74 2.01.84 2.15.1.14 1.41 2.16 3.43 3.03.48.2.86.32 1.15.41.48.15.92.13 1.27.08.39-.06 1.24-.5 1.41-1 .18-.49.18-.91.13-1 0-.08-.14-.13-.33-.21z" />
    </svg>
  );
}

export function FloatingSidebar() {
  const dispatch = useDispatch();
  const finderOpen = useSelector((s: RootState) => s.ui.finderOpen);

  return (
    <AnimatePresence>
      {!finderOpen && (
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
            <WhatsAppIcon size={24} />
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
