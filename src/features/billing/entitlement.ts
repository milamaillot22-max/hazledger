/**
 * What a clinic may do, derived from its Stripe mirror row.
 * Pure (no framework imports) — unit-tested in tests/billing.test.ts.
 *
 * Model: the free trial is a Stripe subscription in "trialing" status, started
 * with a card. A clinic that never started one has no plan ("none"). After a
 * subscription ends, the team QR view keeps working for QR_GRACE_DAYS (the same
 * rule is enforced in SQL by private.clinic_qr_live).
 */

export type PlanId = "starter" | "pro";
export type BillingCycle = "monthly" | "annual";

export const TRIAL_DAYS = 14;
/** SDS cap while the subscription is trialing (prevents "scan everything, then cancel"). */
export const TRIAL_MAX_SDS = 15;
/** Days the team QR view keeps working after a subscription ends. */
export const QR_GRACE_DAYS = 14;
const DAY_MS = 86_400_000;

type Limits = { maxSds: number | null; scansPerMonth: number | null };

/** Commercial limits per plan. `null` = unlimited (Pro is fair use). */
export const PLAN_LIMITS: Record<PlanId, Limits> = {
  starter: { maxSds: 150, scansPerMonth: 25 },
  pro: { maxSds: null, scansPerMonth: null },
};
/** AI scans are capped too during the trial so failed/retried scans can't run unbounded. */
export const TRIAL_LIMITS: Limits = { maxSds: TRIAL_MAX_SDS, scansPerMonth: 30 };

export type BillingRow = {
  plan: string | null;
  billing_cycle: string | null;
  status: string | null;
  trial_ends_at: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  ended_at?: string | null;
  trial_used?: boolean;
};

export type Entitlement =
  | { kind: "trialing"; plan: PlanId; cycle: BillingCycle | null; trialEndsAt: Date | null; daysLeft: number | null; cancelAtPeriodEnd: boolean }
  | { kind: "subscribed"; plan: PlanId; cycle: BillingCycle | null; renewsAt: Date | null; cancelAtPeriodEnd: boolean }
  | { kind: "past_due"; plan: PlanId; cycle: BillingCycle | null; renewsAt: Date | null }
  | { kind: "ended"; endedAt: Date | null; qrUntil: Date | null; qrLive: boolean }
  | { kind: "none" };

const GRACE = new Set(["past_due", "unpaid"]);

function asPlan(v: string | null): PlanId | null {
  return v === "starter" || v === "pro" ? v : null;
}
function asCycle(v: string | null): BillingCycle | null {
  return v === "monthly" || v === "annual" ? v : null;
}
const toDate = (v: string | null | undefined) => (v ? new Date(v) : null);

export function resolveEntitlement(billing: BillingRow | null, now: Date = new Date()): Entitlement {
  const plan = asPlan(billing?.plan ?? null);
  const status = billing?.status ?? null;
  if (!billing || !status) return { kind: "none" };
  const cycle = asCycle(billing.billing_cycle);

  if (plan && status === "trialing") {
    const trialEndsAt = toDate(billing.trial_ends_at);
    const daysLeft = trialEndsAt ? Math.max(1, Math.ceil((trialEndsAt.getTime() - now.getTime()) / DAY_MS)) : null;
    return { kind: "trialing", plan, cycle, trialEndsAt, daysLeft, cancelAtPeriodEnd: billing.cancel_at_period_end };
  }
  if (plan && status === "active") {
    return { kind: "subscribed", plan, cycle, renewsAt: toDate(billing.current_period_end), cancelAtPeriodEnd: billing.cancel_at_period_end };
  }
  if (plan && GRACE.has(status)) {
    return { kind: "past_due", plan, cycle, renewsAt: toDate(billing.current_period_end) };
  }
  // incomplete: the first payment never went through — same as no plan.
  if (status === "incomplete") return { kind: "none" };

  const endedAt = toDate(billing.ended_at) ?? toDate(billing.current_period_end);
  const qrUntil = endedAt ? new Date(endedAt.getTime() + QR_GRACE_DAYS * DAY_MS) : null;
  return { kind: "ended", endedAt, qrUntil, qrLive: !!qrUntil && now < qrUntil };
}

/** True when the clinic may start a free trial (one trial per clinic). */
export function trialEligible(billing: BillingRow | null) {
  return !billing?.trial_used && !billing?.status;
}

/** Limits that apply right now. */
export function limitsFor(e: Entitlement): Limits {
  if (e.kind === "trialing") return TRIAL_LIMITS;
  if (e.kind === "subscribed" || e.kind === "past_due") return PLAN_LIMITS[e.plan];
  return { maxSds: 0, scansPerMonth: 0 };
}

export type ScanCheck =
  | { allowed: true }
  | { allowed: false; reason: "no_plan" | "ended" | "sds_limit" | "scan_limit"; message: string };

/** Gate for adding a new SDS. */
export function canAddSds(e: Entitlement, usage: { sdsCount: number; scansThisMonth: number }): ScanCheck {
  if (e.kind === "none") {
    return { allowed: false, reason: "no_plan", message: `Start your ${TRIAL_DAYS}-day free trial to add SDSs.` };
  }
  if (e.kind === "ended") {
    return { allowed: false, reason: "ended", message: "Your subscription has ended. Choose a plan to keep adding SDSs." };
  }
  const { maxSds, scansPerMonth } = limitsFor(e);
  if (maxSds !== null && usage.sdsCount >= maxSds) {
    return {
      allowed: false,
      reason: "sds_limit",
      message:
        e.kind === "trialing"
          ? `The free trial includes up to ${maxSds} SDSs. Start your paid plan now to add your whole library.`
          : `Starter includes up to ${maxSds} SDSs. Upgrade to Pro for an unlimited library.`,
    };
  }
  if (scansPerMonth !== null && usage.scansThisMonth >= scansPerMonth) {
    return {
      allowed: false,
      reason: "scan_limit",
      message:
        e.kind === "trialing"
          ? `You've used the ${scansPerMonth} AI scans included in the free trial. Start your paid plan now to keep scanning.`
          : `Starter includes ${scansPerMonth} AI scans per month. Upgrade to Pro for unlimited scans, or wait until next month.`,
    };
  }
  return { allowed: true };
}

/** Stripe price lookup keys (also used to create missing prices in a fresh/test account). */
export const lookupKeyFor = (plan: PlanId, cycle: BillingCycle) => `hazledger_${plan}_${cycle}`;
