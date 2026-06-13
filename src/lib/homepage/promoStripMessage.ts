export type PromoStripPromotion = {
  name: string;
  code?: string;
  kind: 'percent_off' | 'fixed_off' | 'free_shipping';
  value?: number;
  description?: string;
  active?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
};

export function isPromotionDisplayable(promo: PromoStripPromotion | null | undefined): boolean {
  if (!promo || promo.active === false) return false;
  const now = Date.now();
  if (promo.startsAt && new Date(promo.startsAt).getTime() > now) return false;
  if (promo.endsAt && new Date(promo.endsAt).getTime() < now) return false;
  return true;
}

function autoHeadline(promo: PromoStripPromotion): string {
  const name = promo.name?.trim();
  if (name) return name;
  if (promo.kind === 'free_shipping') return 'Free shipping';
  if (promo.kind === 'fixed_off') return `AED ${Number(promo.value || 0)} off`;
  return `${Number(promo.value || 0)}% off`;
}

export function formatPromoStripMessage(
  promo: PromoStripPromotion,
  headlineOverride?: string
): { message: string; code: string | null } {
  const message = headlineOverride?.trim() || autoHeadline(promo);
  const code = promo.code?.trim().toUpperCase() || null;
  return { message, code };
}

export function formatUtilityBarTickerText(
  promo: PromoStripPromotion,
  headlineOverride?: string
): string {
  const { message, code } = formatPromoStripMessage(promo, headlineOverride);
  if (!code) return message;
  return `${message} — Use code ${code}`;
}

export function parseLegacyPromoStripText(text: string): { message: string; code: string | null } {
  const trimmed = text.trim();
  const codeMatch = trimmed.match(/code[:\s]+([A-Z0-9]+)/i);
  const code = codeMatch?.[1]?.toUpperCase() ?? null;
  const message = trimmed.split('|')[0]?.trim() || trimmed;
  return { message, code };
}
