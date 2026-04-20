export interface CouponData {
  discount: number;
  type: 'percentage' | 'freeshipping';
  description: string;
}

export const coupons: Record<string, CouponData> = {
  WELCOME10: { discount: 0.10, type: 'percentage', description: '10% off your first order' },
  AMORIA20: { discount: 0.20, type: 'percentage', description: '20% off your order' },
  FREESHIP: { discount: 0, type: 'freeshipping', description: 'Free shipping on your order' },
  EID25: { discount: 0.25, type: 'percentage', description: '25% off — Eid special offer' },
  NEWUSER: { discount: 0.15, type: 'percentage', description: '15% off for new users' },
};
