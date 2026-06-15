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
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.946 1.347l-.355.202-.368-.06c-1.286-.264-2.514-.666-3.635-1.213l-.636-.341.136.755c.22 1.251.583 2.462 1.069 3.605l.196.468-.442.383c-1.153.995-1.95 2.369-2.368 3.900-.528 1.874-.038 3.884 1.273 5.437.554.677 1.223 1.268 1.96 1.738l.505.328-.257.029c-1.552.127-3.031-.357-4.282-1.386-.706-.588-1.317-1.31-1.822-2.148-.511-.852-.904-1.804-1.168-2.77-.651-2.39.034-4.888 1.868-6.462 1.247-.981 2.798-1.54 4.426-1.565.934-.014 1.86.147 2.756.477l.314.106-.022-.014c1.182-.437 2.436-.647 3.732-.647z" />
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
