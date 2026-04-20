interface FragranceNotesProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}

export function FragranceNotes({ topNotes, heartNotes, baseNotes }: FragranceNotesProps) {
  const sections = [
    { label: 'Top Notes', notes: topNotes, color: '#C9A84C', opacity: '0.3', description: 'First impression, 0–30 min' },
    { label: 'Heart Notes', notes: heartNotes, color: '#C9A84C', opacity: '0.6', description: 'Character, 30 min–4 hrs' },
    { label: 'Base Notes', notes: baseNotes, color: '#C9A84C', opacity: '1', description: 'Foundation, 4+ hrs' },
  ];

  return (
    <div className="py-6">
      {/* Pyramid SVG */}
      <div className="flex justify-center mb-8">
        <svg width="240" height="180" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Top section */}
          <path d="M120 10L160 70H80Z" fill="#C9A84C" fillOpacity="0.25" stroke="#C9A84C" strokeWidth="1" />
          {/* Middle section */}
          <path d="M80 70L160 70L185 120H55Z" fill="#C9A84C" fillOpacity="0.45" stroke="#C9A84C" strokeWidth="1" />
          {/* Base section */}
          <path d="M55 120L185 120L210 170H30Z" fill="#C9A84C" fillOpacity="0.70" stroke="#C9A84C" strokeWidth="1" />
          {/* Labels */}
          <text x="120" y="48" textAnchor="middle" fill="#1A0A2E" fontSize="9" fontWeight="600">TOP</text>
          <text x="120" y="98" textAnchor="middle" fill="#1A0A2E" fontSize="9" fontWeight="600">HEART</text>
          <text x="120" y="150" textAnchor="middle" fill="#1A0A2E" fontSize="9" fontWeight="600">BASE</text>
        </svg>
      </div>

      {/* Note sections */}
      <div className="space-y-6">
        {sections.map(({ label, notes, description }) => (
          <div key={label}>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-sm font-semibold" style={{ color: 'var(--color-amoria-primary)' }}>
                {label}
              </h4>
              <span className="text-xs" style={{ color: 'var(--color-amoria-text-muted)' }}>
                — {description}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {notes.map((note) => (
                <span
                  key={note}
                  className="px-3 py-1 text-xs font-medium rounded-full border"
                  style={{
                    borderColor: 'var(--color-amoria-accent)',
                    color: 'var(--color-amoria-primary)',
                    backgroundColor: 'rgba(201,168,76,0.08)',
                  }}
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
