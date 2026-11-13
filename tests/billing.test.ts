import { test } from "node:test";
import assert from "node:assert/strict";

import {
  canAddSds,
  limitsFor,
  lookupKeyFor,
  resolveEntitlement,
  trialEligible,
  type BillingRow,
} from "../src/features/billing/entitlement.ts";

const row = (over: Partial<BillingRow>): BillingRow => ({
  plan: "starter",
  billing_cycle: "monthly",
  status: "active",
  trial_ends_at: null,
  current_period_end: "2026-12-01T00:00:00Z",
  cancel_at_period_end: false,
  ...over,
});

test("no subscription yet: no plan, trial available, nothing can be added", () => {
  const e = resolveEntitlement(null);
  assert.equal(e.kind, "none");
  assert.equal(trialEligible(null), true);
  assert.equal(canAddSds(e, { sdsCount: 0, scansThisMonth: 0 }).allowed, false);
  // A customer saved before checkout (no status) is still eligible
  assert.equal(resolveEntitlement(row({ status: null, plan: null })).kind, "none");
  assert.equal(trialEligible(row({ status: null, plan: null })), true);
});

test("one trial per clinic", () => {
  assert.equal(trialEligible(row({ status: "canceled", trial_used: true })), false);
  assert.equal(trialEligible(row({ status: "active" })), false);
});

test("trialing: card on file, capped at 15 SDSs", () => {
  const e = resolveEntitlement(row({ plan: "pro", status: "trialing", trial_ends_at: "2026-11-27T12:00:00Z" }), new Date("2026-11-23T12:00:00Z"));
  assert.equal(e.kind, "trialing");
  assert.equal(e.kind === "trialing" && e.daysLeft, 4);
  assert.deepEqual(canAddSds(e, { sdsCount: 14, scansThisMonth: 14 }), { allowed: true });
  const capped = canAddSds(e, { sdsCount: 15, scansThisMonth: 15 });
  assert.equal(capped.allowed, false);
  assert.match(capped.allowed ? "" : capped.message, /free trial includes up to 15 SDSs/);
});

test("active plans: Starter limits enforced, Pro unlimited; past_due keeps limits", () => {
  const starter = resolveEntitlement(row({}));
  assert.equal(starter.kind, "subscribed");
  assert.deepEqual(canAddSds(starter, { sdsCount: 10, scansThisMonth: 3 }), { allowed: true });
  assert.equal(canAddSds(starter, { sdsCount: 150, scansThisMonth: 0 }).allowed, false);
  assert.equal(canAddSds(starter, { sdsCount: 10, scansThisMonth: 25 }).allowed, false);
  const pro = resolveEntitlement(row({ plan: "pro" }));
  assert.deepEqual(canAddSds(pro, { sdsCount: 5000, scansThisMonth: 900 }), { allowed: true });
  const late = resolveEntitlement(row({ status: "past_due" }));
  assert.equal(late.kind, "past_due");
  assert.deepEqual(limitsFor(late), { maxSds: 150, scansPerMonth: 25 });
});

test("ended subscription: QR stays live for 14 days, then suspended; no new SDSs", () => {
  const ended = row({ status: "canceled", ended_at: "2026-12-01T00:00:00Z", trial_used: true });
  const during = resolveEntitlement(ended, new Date("2026-12-10T00:00:00Z"));
  assert.equal(during.kind, "ended");
  assert.equal(during.kind === "ended" && during.qrLive, true);
  assert.equal(during.kind === "ended" && during.qrUntil?.toISOString(), "2026-12-15T00:00:00.000Z");
  const after = resolveEntitlement(ended, new Date("2026-12-16T00:00:00Z"));
  assert.equal(after.kind === "ended" && after.qrLive, false);
  assert.equal(canAddSds(during, { sdsCount: 0, scansThisMonth: 0 }).allowed, false);
});

test("lookup keys match the prices created in Stripe", () => {
  assert.equal(lookupKeyFor("starter", "monthly"), "hazledger_starter_monthly");
  assert.equal(lookupKeyFor("pro", "annual"), "hazledger_pro_annual");
});
