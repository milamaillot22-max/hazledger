/**
 * Published price list — the single source for the pricing section, the ROI
 * calculator and schema.org offers. No framework imports (unit-tested).
 *
 * Plan limits are commercial terms; they are enforced once billing ships.
 * Plans list shipped features only — never a "coming soon" item
 * (see tests/pricing.test.ts).
 */

export type BillingCycle = "monthly" | "annual";

export type PlanFeature = { label: string; comingSoon?: boolean };

export type Plan = {
  id: "pro";
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

/** One plan: everything included. (Starter was retired; legacy ids stay valid in billing.) */
export const PLANS: Plan[] = [
  {
    id: "pro",
    name: "HazLedger",
    monthly: 149,
    featured: true,
    tagline: "Everything your practice needs to keep every SDS current and one scan away.",
    limits: ["1 location", "Unlimited SDSs", "Unlimited AI scans (fair use)"],
    features: [
      { label: "AI SDS scanner — PDFs and label photos" },
      { label: "Human review with CAS-number validation" },
      { label: "Team QR poster & login-free staff view" },
      { label: "Emergency-first view: first aid, spills, PPE" },
      { label: "Inspection-ready SDS report — print or PDF" },
      { label: "Email support" },
    ],
  },
];

export function getPlan(id: Plan["id"] = "pro") {
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
