/**
 * What a clinic may do, derived from its Stripe mirror row and its trial.
 * Pure (no framework imports) — unit-tested in tests/billing.test.ts.
 *
 * Safety rule: billing never blocks the team's QR access to SDSs. Only
 * library *changes* (new scans) are gated.
 */

export type PlanId = "starter" | "pro";
export type BillingCycle = "monthly" | "annual";

export const TRIAL_DAYS = 14;
const DAY_MS = 86_400_000;

/** Commercial limits per plan. `null` = unlimited (Pro is fair use). */
export const PLAN_LIMITS: Record<PlanId, { maxSds: number | null; scansPerMonth: number | null }> = {
  starter: { maxSds: 150, scansPerMonth: 25 },
  pro: { maxSds: null, scansPerMonth: null },
};

export type BillingRow = {
  plan: string | null;
  billing_cycle: string | null;
  status: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export type Entitlement =
  | { kind: "subscribed"; plan: PlanId; cycle: BillingCycle | null; stripeStatus: string; trialEndsAt: Date | null; renewsAt: Date | null; cancelAtPeriodEnd: boolean }
  | { kind: "past_due"; plan: PlanId; cycle: BillingCycle | null; renewsAt: Date | null }
  | { kind: "trial"; trialEndsAt: Date; daysLeft: number }
  | { kind: "expired"; trialEndedAt: Date };

const ACTIVE = new Set(["active", "trialing"]);
const GRACE = new Set(["past_due", "unpaid", "incomplete"]);

function asPlan(v: string | null): PlanId | null {
  return v === "starter" || v === "pro" ? v : null;
}
function asCycle(v: string | null): BillingCycle | null {
  return v === "monthly" || v === "annual" ? v : null;
}
const toDate = (v: string | null) => (v ? new Date(v) : null);

/** Free trial without a card: starts when the clinic is created. */
export function trialEndFor(clinicCreatedAt: string | Date) {
  return new Date(new Date(clinicCreatedAt).getTime() + TRIAL_DAYS * DAY_MS);
}

export function resolveEntitlement(
  billing: BillingRow | null,
  clinicCreatedAt: string | Date,
  now: Date = new Date()
): Entitlement {
  const plan = asPlan(billing?.plan ?? null);
  const status = billing?.status ?? null;

  if (billing && plan && status && ACTIVE.has(status)) {
    return {
      kind: "subscribed",
      plan,
      cycle: asCycle(billing.billing_cycle),
      stripeStatus: status,
      trialEndsAt: status === "trialing" ? toDate(billing.trial_ends_at) : null,
      renewsAt: toDate(billing.current_period_end),
      cancelAtPeriodEnd: billing.cancel_at_period_end,
    };
  }
  if (billing && plan && status && GRACE.has(status)) {
    return { kind: "past_due", plan, cycle: asCycle(billing.billing_cycle), renewsAt: toDate(billing.current_period_end) };
  }

  const trialEndsAt = trialEndFor(clinicCreatedAt);
  if (now < trialEndsAt) {
    return { kind: "trial", trialEndsAt, daysLeft: Math.max(1, Math.ceil((trialEndsAt.getTime() - now.getTime()) / DAY_MS)) };
  }
  return { kind: "expired", trialEndedAt: trialEndsAt };
}

/** Limits that apply right now. The free trial includes everything (Pro). */
export function limitsFor(e: Entitlement) {
  if (e.kind === "subscribed" || e.kind === "past_due") return PLAN_LIMITS[e.plan];
  return PLAN_LIMITS.pro;
}

export type ScanCheck = { allowed: true } | { allowed: false; reason: "expired" | "sds_limit" | "scan_limit"; message: string };

/** Gate for adding a new SDS. Viewing, editing and team QR access are never gated. */
export function canAddSds(e: Entitlement, usage: { sdsCount: number; scansThisMonth: number }): ScanCheck {
  if (e.kind === "expired") {
    return {
      allowed: false,
      reason: "expired",
      message: "Your free trial has ended. Choose a plan to keep adding SDSs — your library and team QR access stay available.",
    };
  }
  const { maxSds, scansPerMonth } = limitsFor(e);
  if (maxSds !== null && usage.sdsCount >= maxSds) {
    return { allowed: false, reason: "sds_limit", message: `Starter includes up to ${maxSds} SDSs. Upgrade to Pro for an unlimited library.` };
  }
  if (scansPerMonth !== null && usage.scansThisMonth >= scansPerMonth) {
    return {
      allowed: false,
      reason: "scan_limit",
      message: `Starter includes ${scansPerMonth} AI scans per month. Upgrade to Pro for unlimited scans, or wait until next month.`,
    };
  }
  return { allowed: true };
}

/** Stripe price lookup keys (also used to create missing prices in a fresh/test account). */
export const lookupKeyFor = (plan: PlanId, cycle: BillingCycle) => `hazledger_${plan}_${cycle}`;
