/** Design export sizes — containers use these aspect ratios responsively. */
export const HERO_CAROUSEL_SIZE = {
  mobile: { width: 750, height: 500 },
  desktop: { width: 1920, height: 900 },
} as const;

export const HERO_SIDE_PANEL_SIZE = {
  desktop: { width: 1920, height: 420 },
  mobile: { width: 750, height: 164 },
} as const;

export const heroCarouselAspectClass =
  'aspect-[750/500] md:aspect-[1920/900]';

/** Full-width stacked side offers (1920×420 export) */
export const heroSidePanelAspectClass = 'aspect-[1920/420]';
