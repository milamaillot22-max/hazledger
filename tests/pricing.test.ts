import { test } from "node:test";
import assert from "node:assert/strict";

import { ANNUAL_DISCOUNT_PERCENT, getPlan, PLAN_MATRIX, PLANS, priceFor } from "../src/config/pricing.ts";

test("validated price grid", () => {
  assert.equal(getPlan("starter").monthly, 79);
  assert.equal(getPlan("pro").monthly, 149);
  assert.deepEqual(PLANS.filter((p) => p.featured).map((p) => p.id), ["pro"]);
});

test("annual billing is 2 months free", () => {
  assert.equal(ANNUAL_DISCOUNT_PERCENT, 17);
  assert.deepEqual(priceFor(getPlan("starter"), "annual"), { perMonth: 66, billedAmount: 790, billedEvery: "year", savings: 158 });
  assert.deepEqual(priceFor(getPlan("pro"), "annual"), { perMonth: 124, billedAmount: 1490, billedEvery: "year", savings: 298 });
  assert.equal(priceFor(getPlan("pro"), "monthly").billedAmount, 149);
});

test("unreleased features are always labelled", () => {
  const unreleased = ["revision alerts", "label printing"];
  for (const plan of PLANS) {
    for (const f of plan.features) {
      if (unreleased.some((u) => f.label.toLowerCase().includes(u.toLowerCase()))) {
        assert.equal(f.comingSoon, true, `${plan.id}: "${f.label}" must be marked comingSoon`);
      }
    }
  }
});

test("Pro lists shipped features only", () => {
  const pro = getPlan("pro");
  assert.equal(pro.features.some((f) => f.comingSoon), false);
  assert.equal(PLAN_MATRIX.flatMap((g) => g.rows).some((r) => typeof r.pro === "string" && /soon/i.test(r.pro)), false);
  assert.ok(pro.limits.includes("Unlimited AI scans"));
});
