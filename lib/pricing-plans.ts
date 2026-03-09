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
      '16-Week Institutional Roadmap (7-day drip)',
      'Weekly Group Q&A Support Sessions',
      'Aegis Prime Auditor — Basic Access',
      'Institutional Community Networking',
      'Compliance Methodology Handbooks',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 300,
    description: 'For organizations scaling AI responsibly',
    features: [
      'Instant Access to Full 16-Week Roadmap (No Drip)',
      'Priority Q&A (Questions Answered First)',
      'Personal Institutional Dashboard Access',
      'Full Proprietary Tool Suite',
      'Client-Facing Hallucination Tax Calculators',
      'Advanced Deterministic System Blueprints',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
  },
  vip: {
    id: 'vip',
    name: 'VIP',
    price: 1500,
    description: 'Enterprise-grade AI governance at scale',
    features: [
      'Monthly Private 1-on-1 Infrastructure Audit',
      'Direct Technical Line to CTO & CRO',
      'White-Label Priority & Early Feature Access',
      'Custom Deterministic Logic Deployment',
      'Enterprise / Multi-Seat Dashboard Access',
      'Private Monthly Executive Briefings',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_VIP,
  },
};

export const getSubscriptionTierFromPlan = (planId: string): PricingTier => {
  const tier = planId.toLowerCase() as PricingTier;
  return Object.keys(PRICING_PLANS).includes(tier) ? tier : 'standard';
};
