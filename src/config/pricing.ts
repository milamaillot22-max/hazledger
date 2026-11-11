/**
 * Published price list — the single source for the pricing section, the ROI
 * calculator and schema.org offers. No framework imports (unit-tested).
 *
 * Plan limits are commercial terms; they are enforced once billing ships.
 * Plans list shipped features only. `comingSoon` exists for Starter-side
 * teasers, but the Pro plan must never carry one (see tests/pricing.test.ts).
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
    limits: ["1 location", "Unlimited SDSs", "Unlimited AI scans"],
    features: [
      { label: "Everything in Starter" },
      { label: "Unlimited AI scans (fair use)" },
      { label: "We import your existing binder for you" },
      { label: "Inspection-ready SDS report — print or PDF" },
      { label: "Priority support, same business day" },
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

/** Plan comparison matrix for /pricing. `true` = included, `false` = not included, string = value. */
export type MatrixValue = boolean | string;
export const PLAN_MATRIX: { group: string; rows: { label: string; starter: MatrixValue; pro: MatrixValue }[] }[] = [
  {
    group: "Library",
    rows: [
      { label: "Locations", starter: "1", pro: "1" },
      { label: "SDSs in your library", starter: "Up to 150", pro: "Unlimited" },
      { label: "AI scans per month", starter: "25", pro: "Unlimited (fair use)" },
    ],
  },
  {
    group: "Compliance workflow",
    rows: [
      { label: "AI SDS scanner (PDF & label photos)", starter: true, pro: true },
      { label: "Human review with CAS-number validation", starter: true, pro: true },
      { label: "Team QR poster & login-free staff view", starter: true, pro: true },
      { label: "Emergency-first view: first aid, spills, PPE", starter: true, pro: true },
      { label: "Inspection-ready SDS report (print or PDF)", starter: false, pro: true },
    ],
  },
  {
    group: "Service",
    rows: [
      { label: "We import your existing binder", starter: false, pro: true },
      { label: "Support", starter: "Email", pro: "Priority, same business day" },
    ],
  },
];
