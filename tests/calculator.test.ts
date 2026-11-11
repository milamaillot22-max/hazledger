import { test } from "node:test";
import assert from "node:assert/strict";

import { OSHA_PENALTIES } from "../src/config/compliance.ts";
import { calculate, estimateProducts, sizeReductionFor } from "../src/features/roi/calculator.ts";

test("uses the published 2026 OSHA maximums", () => {
  assert.equal(OSHA_PENALTIES.seriousMax, 16_550);
  assert.equal(OSHA_PENALTIES.willfulOrRepeatedMax, 165_514);
});

test("size reduction tiers (FOM, July 2025)", () => {
  assert.equal(sizeReductionFor(1), 0.7);
  assert.equal(sizeReductionFor(25), 0.7);
  assert.equal(sizeReductionFor(26), 0.3);
  assert.equal(sizeReductionFor(100), 0.3);
  assert.equal(sizeReductionFor(101), 0.1);
  assert.equal(sizeReductionFor(250), 0.1);
  assert.equal(sizeReductionFor(251), 0);
});

test("product estimate by sector and rooms", () => {
  assert.equal(estimateProducts("dental", 4), 49);
  assert.equal(estimateProducts("veterinary", 4), 60);
  assert.equal(estimateProducts("medical", 4), 54);
});

test("dental clinic, 12 staff, 4 operatories at $49/mo", () => {
  const r = calculate({ sector: "dental", employees: 12, rooms: 4, monthlyPrice: 49 });
  assert.equal(r.products, 49);
  // 49×30/60 + 12 + 12×1 = 48.5 h manual; 49×5/60 + 1 ≈ 5.1 h with HazLedger
  assert.equal(r.time.manualHours, 48.5);
  assert.equal(r.time.hazledgerHours, 5.1);
  assert.equal(r.time.hoursSaved, 43.4);
  assert.equal(r.time.valueSaved, 1302);
  assert.equal(r.subscriptionAnnual, 588);
  assert.equal(r.roiPercent, 121);
  assert.equal(r.paybackDays, 165);
  assert.equal(r.risk.seriousAfterSizeReduction, 4965);
  assert.equal(r.risk.allCoreMax, 82_750);
  assert.equal(r.yearsCoveredByOneCitation, 8.4);
});

test("product override, clamping and zero price", () => {
  const r = calculate({ sector: "medical", employees: -5, rooms: 999, products: 10_000, monthlyPrice: 0 });
  assert.equal(r.productsEstimated, false);
  assert.equal(r.products, 2000);
  assert.equal(r.risk.sizeReduction, 0.7);
  assert.equal(r.roiPercent, null);
  assert.equal(r.yearsCoveredByOneCitation, null);
});

test("assumptions are respected and never produce negative savings", () => {
  const r = calculate({
    sector: "dental",
    employees: 3,
    rooms: 1,
    monthlyPrice: 49,
    assumptions: { manualMinutesPerProduct: 0, auditHoursPerMonth: 0, lookupHoursPerEmployee: 0 },
  });
  assert.equal(r.time.hoursSaved, 0);
  assert.equal(r.time.valueSaved, 0);
  assert.equal(r.paybackDays, null);
  assert.equal(r.roiPercent, -100);
});
