export interface TaxSettings {
  taxInclusive: boolean;
  taxPercent: number;
}

export interface TaxBreakdown {
  tax: number;
  totalAmount: number;
  taxInclusive: boolean;
  taxPercent: number;
}

export function computeTaxBreakdown(
  baseAmount: number,
  { taxInclusive = false, taxPercent = 0 }: TaxSettings
): TaxBreakdown {
  const base = Math.max(0, Number(baseAmount) || 0);
  const rate = Math.max(0, Number(taxPercent) || 0);

  if (rate <= 0) {
    return { tax: 0, totalAmount: round2(base), taxInclusive: !!taxInclusive, taxPercent: rate };
  }

  if (taxInclusive) {
    const tax = round2(base * (rate / (100 + rate)));
    return { tax, totalAmount: round2(base), taxInclusive: true, taxPercent: rate };
  }

  const tax = round2(base * (rate / 100));
  return { tax, totalAmount: round2(base + tax), taxInclusive: false, taxPercent: rate };
}

/** @deprecated Use computeTaxBreakdown */
export function calculateVAT(subtotal: number, taxPercent = 5): number {
  return computeTaxBreakdown(subtotal, { taxInclusive: false, taxPercent }).tax;
}

function round2(value: number): number {
  return Number((Number(value) || 0).toFixed(2));
}
