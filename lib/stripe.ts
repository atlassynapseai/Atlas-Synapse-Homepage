import Stripe from 'stripe';

// Do not throw at module load — let API routes handle missing key gracefully
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'missing_key');
