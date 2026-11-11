/**
 * Published price list — the single source for the pricing section, the ROI
 * calculator and schema.org offers. No framework imports (unit-tested).
 *
 * Plan limits are commercial terms; they are enforced once billing ships.
 * Features marked `comingSoon` must stay labelled until they are released.
 */

export type BillingCycle = "monthly" | "annual";

export type PlanFeature = { label: string; comingSoon?: boolean };

export type Plan = {
  id: "starter" | "pro";
  name: string;
  /** List price, per location, billed monthly. */
  monthly: number;
  featured: boolean;
  tagline: string;
  limits: string[];
  features: PlanFeature[];
};

export const CURRENCY = "USD";

/** Annual billing = 12 months for the price of (12 − this). */
export const ANNUAL_FREE_MONTHS = 2;

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthly: 79,
    featured: false,
    tagline: "For single-location practices moving off the paper binder.",
    limits: ["1 location", "Up to 150 SDSs", "25 AI scans / month"],
    features: [
      { label: "AI SDS scanner — PDFs and label photos" },
      { label: "Human review with CAS-number validation" },
      { label: "Team QR poster & login-free staff view" },
      { label: "Emergency-first view: first aid, spills, PPE" },
      { label: "Email support" },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 149,
    featured: true,
    tagline: "For clinics that want their binder done for them.",
    limits: ["1 location", "Unlimited SDSs", "100 AI scans / month"],
    features: [
      { label: "Everything in Starter" },
      { label: "We import your existing binder for you" },
      { label: "Priority support, same business day" },
      { label: "Supplier revision alerts", comingSoon: true },
      { label: "GHS secondary label printing", comingSoon: true },
      { label: "Inspector-ready PDF export", comingSoon: true },
    ],
  },
];

export function getPlan(id: Plan["id"]) {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan: ${id}`);
  return plan;
}

/** What a customer pays, for display. Annual shows the monthly equivalent. */
export function priceFor(plan: Plan, cycle: BillingCycle) {
  if (cycle === "monthly") {
    return { perMonth: plan.monthly, billedAmount: plan.monthly, billedEvery: "month" as const, savings: 0 };
  }
  const yearly = plan.monthly * (12 - ANNUAL_FREE_MONTHS);
  return {
    perMonth: Math.round(yearly / 12),
    billedAmount: yearly,
    billedEvery: "year" as const,
    savings: plan.monthly * ANNUAL_FREE_MONTHS,
  };
}

export const ANNUAL_DISCOUNT_PERCENT = Math.round((ANNUAL_FREE_MONTHS / 12) * 100);
