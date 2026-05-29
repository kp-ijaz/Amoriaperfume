'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { openFinder } from '@/lib/store/uiSlice';

function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
        fill="white"
      />
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 1.89.522 3.656 1.432 5.168L2 22l4.977-1.404A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 01-4.05-1.104l-.29-.173-3.002.847.857-2.927-.19-.3A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z"
        fill="white"
      />
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
          {/* Find Your Scent */}
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

          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/971568252478"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-transform hover:scale-110 active:scale-95"
            style={{ backgroundColor: '#25D366' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <WhatsAppIcon size={24} />
            <span
              className="absolute inset-0 rounded-full animate-ping opacity-20 pointer-events-none"
              style={{ backgroundColor: '#25D366' }}
            />
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
