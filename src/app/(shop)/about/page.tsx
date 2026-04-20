import Image from 'next/image';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <div className="relative h-64 md:h-80" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/collections/arabian-oud.jpg"
            alt="About Amoria"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-5xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Story
          </h1>
          <div className="h-0.5 w-12 mt-4" style={{ backgroundColor: 'var(--color-amoria-accent)' }} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose max-w-none">
          <h2 className="text-3xl font-light mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
            Born from a Love of Arabian Fragrance
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--color-amoria-text)' }}>
            Amoria was founded in 2020 with a simple mission: to bring authentic Arabian fragrances to every home in the UAE and beyond. We believe that fragrance is more than a scent — it is a memory, a mood, a statement of identity.
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--color-amoria-text)' }}>
            Rooted in the rich tradition of Arabian perfumery, we carefully curate only the finest fragrances from the most respected houses. Every bottle in our collection is 100% authentic, sourced directly from the brands we represent.
          </p>
          <p className="text-base leading-relaxed mb-10" style={{ color: 'var(--color-amoria-text)' }}>
            From the legendary oud forests of Southeast Asia to the rose valleys of Bulgaria, the ingredients in our fragrances tell a story that spans continents and centuries. We are proud to be your guide in this aromatic journey.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              { number: '30+', label: 'Authentic Brands' },
              { number: '500+', label: 'Unique Fragrances' },
              { number: '50,000+', label: 'Happy Customers' },
            ].map(({ number, label }) => (
              <div key={label} className="text-center p-6 border" style={{ borderColor: 'var(--color-amoria-border)' }}>
                <p className="text-4xl font-light mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)' }}>
                  {number}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-amoria-text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
