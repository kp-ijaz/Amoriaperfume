export interface QuizOption {
  id: string;
  label: string;
  icon: string;
  tags: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What mood should your fragrance evoke?',
    options: [
      { id: 'mysterious', label: 'Mysterious & Sensual', icon: '🌙', tags: ['dark', 'mysterious', 'oud', 'evening'] },
      { id: 'energetic', label: 'Fresh & Energetic', icon: '⚡', tags: ['fresh', 'citrus', 'aquatic', 'energetic'] },
      { id: 'cozy', label: 'Warm & Cozy', icon: '🔥', tags: ['warm', 'amber', 'vanilla', 'gourmand'] },
      { id: 'bold', label: 'Bold & Powerful', icon: '👑', tags: ['bold', 'commanding', 'spicy', 'strong'] },
    ],
  },
  {
    id: 2,
    question: 'When will you mostly wear this?',
    options: [
      { id: 'daily', label: 'Daily / Office', icon: '🌅', tags: ['daily', 'office', 'light', 'moderate'] },
      { id: 'special', label: 'Special Occasions', icon: '🎉', tags: ['special-occasion', 'elegant', 'luxurious'] },
      { id: 'evening', label: 'Evenings & Nights', icon: '🌃', tags: ['evening', 'romantic', 'dark', 'mysterious'] },
      { id: 'allday', label: 'All Day Every Day', icon: '☀️', tags: ['all-day', 'versatile', 'fresh', 'moderate'] },
    ],
  },
  {
    id: 3,
    question: 'Which scent family calls to you?',
    options: [
      { id: 'oudamber', label: 'Oud & Amber', icon: '🪵', tags: ['oud', 'amber', 'oriental', 'woody'] },
      { id: 'floral', label: 'Floral & Rose', icon: '🌹', tags: ['floral', 'rose', 'feminine', 'romantic'] },
      { id: 'woody', label: 'Woody & Musk', icon: '🌿', tags: ['woody', 'musk', 'clean', 'masculine'] },
      { id: 'citrus', label: 'Citrus & Fresh', icon: '🍋', tags: ['citrus', 'fresh', 'aquatic', 'energetic'] },
    ],
  },
  {
    id: 4,
    question: 'How intense should the sillage be?',
    options: [
      { id: 'subtle', label: 'Light & Subtle', icon: '🌬️', tags: ['light', 'subtle', 'daily'] },
      { id: 'moderate', label: 'Moderate Presence', icon: '✨', tags: ['moderate', 'all-day'] },
      { id: 'strong', label: 'Strong & Noticeable', icon: '💫', tags: ['strong', 'commanding'] },
      { id: 'commanding', label: 'Commanding & Bold', icon: '🌟', tags: ['commanding', 'bold', 'strong'] },
    ],
  },
  {
    id: 5,
    question: "What's your per-bottle budget?",
    options: [
      { id: 'budget', label: 'Under AED 100', icon: '💰', tags: [] },
      { id: 'mid', label: 'AED 100–250', icon: '💳', tags: [] },
      { id: 'premium', label: 'AED 250–500', icon: '💎', tags: [] },
      { id: 'luxury', label: 'AED 500+', icon: '👑', tags: ['luxurious'] },
    ],
  },
];
