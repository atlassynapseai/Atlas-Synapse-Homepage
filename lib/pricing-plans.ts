export type PricingTier = 'standard' | 'premium' | 'vip' | 'free';

export interface PricingPlan {
  id: PricingTier;
  name: string;
  price: number;
  description: string;
  features: string[];
  stripePriceId?: string;
}

export const PRICING_PLANS: Record<PricingTier, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started with basic features',
    features: [
      'Limited access to Aegis Prime Auditor',
      'Basic reporting',
      'Community support',
    ],
  },
  standard: {
    id: 'standard',
    name: 'Standard',
    price: 100,
    description: 'Perfect for small teams',
    features: [
      'Full access to Aegis Prime Auditor',
      'Advanced reporting',
      'Email support',
      'Up to 3 team members',
      'Monthly updates',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 300,
    description: 'For growing organizations',
    features: [
      'All Standard features',
      'Priority support',
      'Custom integrations',
      'Up to 10 team members',
      'Weekly updates',
      'Advanced analytics',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM,
  },
  vip: {
    id: 'vip',
    name: 'VIP',
    price: 1500,
    description: 'Enterprise-grade solution',
    features: [
      'All Premium features',
      'Dedicated support',
      'Custom development',
      'Unlimited team members',
      'Real-time updates',
      'Advanced security features',
      'Regular training sessions',
      'SLA guarantee',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_VIP,
  },
};

export const getSubscriptionTierFromPlan = (planId: string): PricingTier => {
  const tier = planId.toLowerCase() as PricingTier;
  return Object.keys(PRICING_PLANS).includes(tier) ? tier : 'free';
};
