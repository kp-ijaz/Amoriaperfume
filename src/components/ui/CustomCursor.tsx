'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const x = useSpring(mouseX, { damping: 20, stiffness: 260, mass: 0.6 });
  const y = useSpring(mouseY, { damping: 20, stiffness: 260, mass: 0.6 });

  const [visible, setVisible]   = useState(false);
  const [show, setShow]         = useState(false); // only true on real mouse devices
  const touchedRef              = useRef(false);

  useEffect(() => {
    // Comprehensive touch/mobile detection
    const noHover    = window.matchMedia('(hover: none)').matches;
    const coarse     = window.matchMedia('(pointer: coarse)').matches;
    const hasTouch   = navigator.maxTouchPoints > 0;

    if (noHover || coarse || hasTouch) return; // pure touch device — do nothing
    setShow(true);

    const onMove = (e: MouseEvent) => {
      if (touchedRef.current) return; // ignore synthetic mouse events from touch
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
    };

    // Any touch interaction — permanently park cursor off screen
    const onTouch = () => {
      touchedRef.current = true;
      setVisible(false);
      mouseX.set(-200);
      mouseY.set(-200);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => { if (!touchedRef.current) setVisible(true); };

    window.addEventListener('mousemove',  onMove,  { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove',  onTouch, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove',  onTouch);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [mouseX, mouseY]);

  if (!show) return null;

  return (
    <>
      {/* Scoped to real mouse devices only — never hides native tap cursor on mobile */}
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>

      <motion.div
        style={{
          x,
          y,
          translateX:    '-50%',
          translateY:    '-50%',
          position:      'fixed',
          top:           0,
          left:          0,
          pointerEvents: 'none',
          zIndex:        9999,
          width:         16,
          height:        16,
          borderRadius:  '50%',
          border:        '1.5px solid #DEC99A',
          boxShadow:     '0 0 6px rgba(222,201,154,0.65), 0 0 14px rgba(222,201,154,0.2)',
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ opacity: { duration: 0.3 } }}
      />
    </>
  );
}
