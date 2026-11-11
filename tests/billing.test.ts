import { test } from "node:test";
import assert from "node:assert/strict";

import { canAddSds, limitsFor, lookupKeyFor, resolveEntitlement, trialEndFor, type BillingRow } from "../src/features/billing/entitlement.ts";

const created = "2026-11-01T12:00:00Z";
const row = (over: Partial<BillingRow>): BillingRow => ({
  plan: "starter",
  billing_cycle: "monthly",
  status: "active",
  trial_ends_at: null,
  current_period_end: "2026-12-01T00:00:00Z",
  cancel_at_period_end: false,
  ...over,
});

test("no subscription: 14-day trial without a card, then expired", () => {
  assert.equal(trialEndFor(created).toISOString(), "2026-11-15T12:00:00.000Z");
  const during = resolveEntitlement(null, created, new Date("2026-11-11T12:00:00Z"));
  assert.equal(during.kind, "trial");
  assert.equal(during.kind === "trial" && during.daysLeft, 4);
  assert.equal(resolveEntitlement(null, created, new Date("2026-11-16T00:00:00Z")).kind, "expired");
});

test("active and trialing subscriptions are subscribed; past_due gets grace", () => {
  assert.equal(resolveEntitlement(row({}), created).kind, "subscribed");
  assert.equal(resolveEntitlement(row({ status: "trialing" }), created).kind, "subscribed");
  assert.equal(resolveEntitlement(row({ status: "past_due" }), created).kind, "past_due");
  // canceled falls back to the trial clock
  assert.equal(resolveEntitlement(row({ status: "canceled" }), created, new Date("2026-12-20T00:00:00Z")).kind, "expired");
});

test("trial includes Pro limits; Starter limits are enforced", () => {
  assert.deepEqual(limitsFor(resolveEntitlement(null, created, new Date("2026-11-02T00:00:00Z"))), { maxSds: null, scansPerMonth: null });
  const starter = resolveEntitlement(row({}), created);
  assert.deepEqual(canAddSds(starter, { sdsCount: 10, scansThisMonth: 3 }), { allowed: true });
  assert.equal(canAddSds(starter, { sdsCount: 150, scansThisMonth: 0 }).allowed, false);
  assert.equal(canAddSds(starter, { sdsCount: 10, scansThisMonth: 25 }).allowed, false);
  const pro = resolveEntitlement(row({ plan: "pro" }), created);
  assert.deepEqual(canAddSds(pro, { sdsCount: 5000, scansThisMonth: 900 }), { allowed: true });
});

test("expired trial blocks new scans only", () => {
  const expired = resolveEntitlement(null, created, new Date("2027-01-01T00:00:00Z"));
  const check = canAddSds(expired, { sdsCount: 0, scansThisMonth: 0 });
  assert.equal(check.allowed, false);
  assert.match(check.allowed ? "" : check.message, /team QR access stay available/);
});

test("lookup keys match the prices created in Stripe", () => {
  assert.equal(lookupKeyFor("starter", "monthly"), "hazledger_starter_monthly");
  assert.equal(lookupKeyFor("pro", "annual"), "hazledger_pro_annual");
});
