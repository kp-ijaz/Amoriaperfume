'use client';

import { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // 0–1, how far the element drifts toward cursor
  style?: React.CSSProperties;
  onClick?: () => void;
  as?: 'button' | 'div' | 'span';
}

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  style,
  onClick,
  as: Tag = 'button',
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.6 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ x, y, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.04 : 1 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {Tag === 'button' ? (
          <button ref={ref as React.RefObject<HTMLButtonElement>} className={className} style={style} onClick={onClick}>
            {children}
          </button>
        ) : (
          <div className={className} style={style} onClick={onClick}>
            {children}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
