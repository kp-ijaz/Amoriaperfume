export type SeasonValue = 'summer' | 'winter' | 'autumn' | 'spring';
export type GenderValue = 'men' | 'women' | 'unisex';
export type DayNightValue = 'day' | 'night' | 'both';

export interface QuizCriterion {
  gender?: GenderValue | null;
  dayNight?: DayNightValue;
  season?: SeasonValue;
  noteKeywords?: string[];
  priceMin?: number;
  priceMax?: number;
}

export interface QuizOption {
  id: string;
  label: string;
  icon: string;
  criteria: QuizCriterion;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Who is this fragrance for?',
    options: [
      { id: 'men', label: 'For Him', icon: '👔', criteria: { gender: 'men' } },
      { id: 'women', label: 'For Her', icon: '👗', criteria: { gender: 'women' } },
      { id: 'unisex', label: 'For Everyone', icon: '✨', criteria: { gender: 'unisex' } },
      { id: 'any', label: 'No preference', icon: '🌐', criteria: { gender: null } },
    ],
  },
  {
    id: 2,
    question: 'When will you wear it?',
    options: [
      { id: 'day', label: 'Daytime', icon: '🌅', criteria: { dayNight: 'day' } },
      { id: 'night', label: 'Evening', icon: '🌃', criteria: { dayNight: 'night' } },
      { id: 'both', label: 'Anytime', icon: '☀️', criteria: { dayNight: 'both' } },
    ],
  },
  {
    id: 3,
    question: 'Which season suits you?',
    options: [
      { id: 'summer', label: 'Summer', icon: '☀️', criteria: { season: 'summer' } },
      { id: 'winter', label: 'Winter', icon: '❄️', criteria: { season: 'winter' } },
      { id: 'spring', label: 'Spring', icon: '🌸', criteria: { season: 'spring' } },
      { id: 'autumn', label: 'Autumn', icon: '🍂', criteria: { season: 'autumn' } },
    ],
  },
  {
    id: 4,
    question: 'Which scent profile appeals to you?',
    options: [
      {
        id: 'woody',
        label: 'Woody & Oud',
        icon: '🪵',
        criteria: {
          noteKeywords: ['oud', 'wood', 'woody', 'sandalwood', 'cedar', 'vetiver', 'patchouli', 'leather'],
        },
      },
      {
        id: 'floral',
        label: 'Floral',
        icon: '🌹',
        criteria: {
          noteKeywords: ['floral', 'rose', 'jasmine', 'lily', 'peony', 'iris', 'violet', 'ylang'],
        },
      },
      {
        id: 'citrus',
        label: 'Fresh & Citrus',
        icon: '🍋',
        criteria: {
          noteKeywords: ['citrus', 'bergamot', 'lemon', 'orange', 'grapefruit', 'fresh', 'aquatic', 'mint'],
        },
      },
      {
        id: 'warm',
        label: 'Warm & Amber',
        icon: '🔥',
        criteria: {
          noteKeywords: ['amber', 'vanilla', 'musk', 'gourmand', 'tonka', 'caramel', 'honey', 'praline'],
        },
      },
    ],
  },
  {
    id: 5,
    question: "What's your budget per bottle?",
    options: [
      { id: 'budget', label: 'Under AED 100', icon: '💰', criteria: { priceMin: 0, priceMax: 100 } },
      { id: 'mid', label: 'AED 100–250', icon: '💳', criteria: { priceMin: 100, priceMax: 250 } },
      { id: 'premium', label: 'AED 250–500', icon: '💎', criteria: { priceMin: 250, priceMax: 500 } },
      { id: 'luxury', label: 'AED 500+', icon: '👑', criteria: { priceMin: 500, priceMax: Infinity } },
    ],
  },
];
