import "server-only";

import Stripe from "stripe";

import { getServerEnv } from "@/lib/env";

let cached: Stripe | null | undefined;

/** Server-side Stripe client, or null when STRIPE_SECRET_KEY isn't configured. */
export function getStripe(): Stripe | null {
  if (cached !== undefined) return cached;
  const { STRIPE_SECRET_KEY } = getServerEnv();
  cached = STRIPE_SECRET_KEY
    ? new Stripe(STRIPE_SECRET_KEY, { appInfo: { name: "HazLedger", url: "https://gethazledger.com" } })
    : null;
  return cached;
}

export function isStripeConfigured() {
  return Boolean(getServerEnv().STRIPE_SECRET_KEY);
}
