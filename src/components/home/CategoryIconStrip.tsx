'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'gift-set',
    slug: 'gift-sets',
    name: 'Gift Set',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300&q=85',
  },
  {
    id: 'best-sellers',
    slug: 'best-sellers',
    name: 'Best Sellers',
    type: 'green',
  },
  {
    id: 'perfumes',
    slug: 'perfumes',
    name: 'Perfumes',
    type: 'green',
  },
  {
    id: 'perfume-oils',
    slug: 'perfume-oils',
    name: 'Perfume Oils',
    type: 'green',
  },
  {
    id: 'new-arrivals',
    slug: 'new-arrivals',
    name: 'New Arrivals',
    type: 'ring',
  },
];

export function CategoryIconStrip() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-14 md:py-20">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-14"
        >
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: '#7A7A7A',
            }}
          >
            Our True Masterclass Into Handpicked Specialties
          </p>
        </motion.div>

        {/* ── Icon Strip ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '98px',
            flexWrap: 'wrap',
          }}
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '11px',
                  textDecoration: 'none',
                }}
                className="group"
              >
                {/* Photo tile */}
                {cat.type === 'photo' && (
                  <div
                    style={{
                      width: '110px',
                      height: '110px',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      border: '1px solid #E8E3DC',
                      backgroundColor: '#F5E8D0',
                      position: 'relative',
                      transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
                    }}
                    className="group-hover:-translate-y-1 group-hover:scale-[1.03]"
                  >
                    <Image
                      src={cat.image!}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="110px"
                    />
                  </div>
                )}

                {/* Cream box */}
                {cat.type === 'green' && (
                  <div
                    style={{
                      width: '110px',
                      height: '110px',
                      borderRadius: '22px',
                      backgroundColor: '#F5E8D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '10px',
                      transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
                    }}
                    className="group-hover:-translate-y-1 group-hover:scale-[1.03]"
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
                        fontSize: cat.name.length > 8 ? '15px' : '19px',
                        fontWeight: 500,
                        color: '#1A0A2E',
                        letterSpacing: '0.08em',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        lineHeight: 1.25,
                      }}
                    >
                      {/* Split multi-word names across lines */}
                      {cat.name.split(' ').length > 1 ? (
                        <>
                          {cat.name.split(' ')[0]}
                          <br />
                          {cat.name.split(' ').slice(1).join(' ')}
                        </>
                      ) : cat.name}
                    </span>
                  </div>
                )}

                {/* Spinning ring badge — New Arrivals */}
                {cat.type === 'ring' && (
                  <div
                    style={{
                      width: '110px',
                      height: '110px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Spinning text ring */}
                    <svg
                      viewBox="0 0 110 110"
                      width="110"
                      height="110"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        animation: 'spin-ring 18s linear infinite',
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <path
                          id="ring-arc"
                          d="M55,9 a46,46 0 1,1 -0.01,0"
                        />
                      </defs>
                      <circle
                        cx="55"
                        cy="55"
                        r="51"
                        fill="none"
                        stroke="#C9A84C"
                        strokeWidth="1.2"
                      />
                      <text
                        fontSize="7.5"
                        fontFamily="Montserrat, sans-serif"
                        fontWeight="600"
                        letterSpacing="5.8"
                        fill="#C9A84C"
                        textAnchor="middle"
                      >
                        <textPath href="#ring-arc" startOffset="50%">
                          NEW · NEW · NEW · NEW · NEW ·
                        </textPath>
                      </text>
                    </svg>

                    {/* Center label */}
                    <span
                      style={{
                        fontFamily: 'var(--font-heading, "Cormorant Garamond", serif)',
                        fontSize: '13px',
                        fontWeight: 400,
                        color: '#1A0A2E',
                        letterSpacing: '0.1em',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        lineHeight: 1.2,
                        zIndex: 1,
                      }}
                    >
                      Arrivals
                    </span>
                  </div>
                )}

                {/* Label below */}
                <span
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.22em',
                    color: '#5A5A5A',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}
                >
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>

      {/* CSS for ring spin animation — injected once */}
      <style>{`
        @keyframes spin-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}