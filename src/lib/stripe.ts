import Stripe from 'stripe';

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Please configure it in your environment variables.',
    );
  }
  return new Stripe(key, { typescript: true });
}

export function getStripe() {
  return getStripeClient();
}

export const PLANS = {
  free: {
    name: 'Free',
    journalLimit: 10,
    analysisLimit: 5,
  },
  pro: {
    name: 'Pro',
    journalLimit: Infinity,
    analysisLimit: Infinity,
    priceId: process.env.STRIPE_PRICE_ID!,
  },
} as const;
