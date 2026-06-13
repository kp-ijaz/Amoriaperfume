import type { Appearance, StripeElementsOptions } from '@stripe/stripe-js';

/** Stripe Elements appearance aligned with Amoria checkout styling. */
export const amoriaStripeAppearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#1A0A2E',
    colorBackground: '#FFFFFF',
    colorText: '#1C1C1C',
    colorTextSecondary: '#6B6B6B',
    colorTextPlaceholder: '#C8C3BB',
    colorDanger: '#EF4444',
    fontFamily:
      'var(--font-body, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif)',
    fontSizeBase: '14px',
    spacingUnit: '4px',
    borderRadius: '2px',
    focusBoxShadow: '0 0 0 1px #1A0A2E',
    focusOutline: 'none',
  },
  rules: {
    '.Input': {
      border: '1px solid #E8E3DC',
      boxShadow: 'none',
      padding: '12px 14px',
      backgroundColor: '#FFFFFF',
    },
    '.Input:focus': {
      border: '1px solid #1A0A2E',
      boxShadow: 'none',
    },
    '.Input--invalid': {
      border: '1px solid #EF4444',
      boxShadow: 'none',
    },
    '.Label': {
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: '#6B6B6B',
      marginBottom: '6px',
    },
    '.Tab': {
      border: '1px solid #E8E3DC',
      boxShadow: 'none',
      backgroundColor: '#FFFFFF',
    },
    '.Tab:hover': {
      backgroundColor: 'rgba(26,10,46,0.02)',
    },
    '.Tab--selected': {
      border: '1px solid #1A0A2E',
      backgroundColor: 'rgba(26,10,46,0.04)',
      color: '#1A0A2E',
    },
    '.TabIcon--selected': {
      fill: '#C9A84C',
    },
    '.Block': {
      backgroundColor: '#FAF8F5',
      border: '1px solid #E8E3DC',
      padding: '14px',
      boxShadow: 'none',
    },
    '.AccordionItem': {
      border: '1px solid #E8E3DC',
      boxShadow: 'none',
    },
  },
};

export function amoriaStripeElementsOptions(clientSecret: string): StripeElementsOptions {
  return {
    clientSecret,
    appearance: amoriaStripeAppearance,
    loader: 'auto',
  };
}
