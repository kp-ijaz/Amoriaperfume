import Link from 'next/link';

export default function FragranceGuidePage() {
  const sections = [
    {
      title: 'Understanding Fragrance Concentrations',
      content: 'Perfume concentrations determine longevity and sillage. Parfum (20–30% oils) lasts 8+ hours. Eau de Parfum (EDP, 15–20%) lasts 5–8 hours. Eau de Toilette (EDT, 5–15%) lasts 3–5 hours. Attar (pure oil, 100%) lasts all day with minimal projection.',
    },
    {
      title: 'The Fragrance Pyramid: Notes Explained',
      content: 'Every fragrance has three layers. Top notes are your first impression — light and fresh, lasting 15–30 minutes. Heart notes form the character of the fragrance, emerging after 30 minutes and lasting several hours. Base notes are the foundation — rich, deep, and long-lasting, providing the lingering trail.',
    },
    {
      title: 'Arabian Oud: The Liquid Gold',
      content: 'Oud (agarwood) is one of the most precious fragrance ingredients in the world. Formed when the Aquilaria tree is infected by a specific mold, it produces a resinous heartwood with an unmistakably rich, complex scent. The finest oud comes from Cambodia, India, and Laos, and can cost more than gold by weight.',
    },
    {
      title: 'How to Apply Fragrance Correctly',
      content: 'Apply to pulse points: wrists, neck, behind ears, and inner elbows. Do not rub — this breaks down the fragrance molecules. Apply to clean, moisturized skin for best longevity. For attars, use a small roll-on to each pulse point — a little goes a long way.',
    },
    {
      title: 'Fragrance Families Guide',
      content: 'Oriental/Spicy: warm, rich, exotic notes like amber, spice, vanilla — perfect for evenings. Woody: cedar, sandalwood, oud — versatile and masculine. Floral: rose, jasmine, peony — timeless and feminine. Fresh/Citrus: bright, energetic, perfect for daywear. Gourmand: sweet, food-inspired notes like vanilla and caramel.',
    },
    {
      title: 'Storing Your Fragrances',
      content: 'Store perfumes away from direct sunlight, heat, and humidity. A cool, dark drawer or cabinet is ideal. Avoid the bathroom — the humidity degrades the fragrance. Kept properly, most fragrances last 3–5 years. Attars in sealed bottles can last decades.',
    },
  ];

  return (
    <div>
      <div className="py-10 px-4 text-center" style={{ backgroundColor: 'var(--color-amoria-primary)' }}>
        <h1 className="text-3xl md:text-4xl font-light text-white" style={{ fontFamily: 'var(--font-heading)' }}>
          Fragrance Guide
        </h1>
        <p className="text-white/60 text-sm mt-2">Everything you need to know about Arabian perfumery</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid gap-8">
          {sections.map((section, i) => (
            <div key={i} className="border-b pb-8" style={{ borderColor: 'var(--color-amoria-border)' }}>
              <div className="flex items-start gap-4">
                <span
                  className="text-3xl font-light flex-shrink-0"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-accent)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-amoria-primary)', fontFamily: 'var(--font-heading)' }}>
                    {section.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-amoria-text)' }}>
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center p-8 border" style={{ borderColor: 'var(--color-amoria-accent)', backgroundColor: 'rgba(201,168,76,0.05)' }}>
          <h3 className="text-2xl font-light mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-amoria-primary)' }}>
            Not sure where to start?
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--color-amoria-text-muted)' }}>
            Take our 2-minute Fragrance Finder quiz and we&apos;ll match you with your perfect scent.
          </p>
          <Link
            href="/fragrance-finder"
            className="inline-block px-8 py-3 text-sm font-semibold"
            style={{ backgroundColor: 'var(--color-amoria-accent)', color: 'var(--color-amoria-primary)' }}
          >
            Take the Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
