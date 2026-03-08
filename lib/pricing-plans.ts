export type PricingTier = 'standard' | 'premium' | 'vip';

export interface PricingPlan {
  id: PricingTier;
  name: string;
  price: number;
  description: string;
  features: string[];
  stripePriceId?: string;
}

export const PRICING_PLANS: Record<PricingTier, PricingPlan> = {
  standard: {
    id: 'standard',
    name: 'Standard',
    price: 100,
    description: 'For teams starting their AI governance journey',
    features: [
      '16-Week AI Governance Roadmap (drip-fed)',
      'Weekly group Q&A sessions',
      'Basic Community Dashboard',
      'Community Tools Access',
      'Aegis Prime Auditor — Basic',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 300,
    description: 'For organizations scaling AI responsibly',
    features: [
      'Full AI Governance Roadmap (instant access, no drip)',
      'Priority Q&A sessions',
      'Personal Dashboard',
      'Full Suite Tools Access',
      'Aegis Prime Auditor — Full',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
  },
  vip: {
    id: 'vip',
    name: 'VIP',
    price: 1500,
    description: 'Enterprise-grade AI governance at scale',
    features: [
      'Full Roadmap + 1-on-1 mentorship sessions',
      'Direct access to leadership',
      'Multi-Seat Dashboard',
      'Enterprise Tools + Custom Development',
      'Aegis Prime Auditor — Enterprise Edition',
      'All Future Products & Features (Early Access)',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_VIP,
  },
};

export const getSubscriptionTierFromPlan = (planId: string): PricingTier => {
  const tier = planId.toLowerCase() as PricingTier;
  return Object.keys(PRICING_PLANS).includes(tier) ? tier : 'standard';
};
