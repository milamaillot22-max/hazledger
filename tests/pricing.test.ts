import { test } from "node:test";
import assert from "node:assert/strict";

import { ANNUAL_DISCOUNT_PERCENT, getPlan, PLANS, priceFor } from "../src/config/pricing.ts";

test("one plan: Pro at $149", () => {
  assert.deepEqual(PLANS.map((p) => p.id), ["pro"]);
  assert.equal(getPlan().monthly, 149);
});

test("annual billing is 2 months free", () => {
  assert.equal(ANNUAL_DISCOUNT_PERCENT, 17);
  assert.deepEqual(priceFor(getPlan(), "annual"), { perMonth: 124, billedAmount: 1490, billedEvery: "year", savings: 298 });
  assert.equal(priceFor(getPlan(), "monthly").billedAmount, 149);
});

test("the plan lists shipped features and no done-for-you service promises", () => {
  const pro = getPlan();
  assert.equal(pro.features.some((f) => f.comingSoon), false);
  const labels = [...pro.limits, ...pro.features.map((f) => f.label)].join(" | ").toLowerCase();
  for (const promise of ["import your", "same business day", "priority support", "revision alerts", "label printing"]) {
    assert.equal(labels.includes(promise), false, `must not promise: ${promise}`);
  }
  assert.ok(pro.limits.includes("Unlimited SDSs"));
});
