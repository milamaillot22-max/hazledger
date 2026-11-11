import { test } from "node:test";
import assert from "node:assert/strict";

import { buildInspectionReport, type ReportInput } from "../src/features/sds/report.ts";

const doc = (over: Partial<ReportInput>): ReportInput => ({
  id: Math.random().toString(36).slice(2),
  status: "current",
  document_type: "sds",
  product_name: "Product",
  manufacturer: "Maker",
  revision_date: "2025-01-10",
  signal_word: null,
  pictograms: [],
  cas_numbers: [],
  ...over,
});

const today = new Date("2026-11-11T12:00:00Z");

test("excludes failed and in-progress scans, sorts by product name", () => {
  const r = buildInspectionReport(
    [
      doc({ product_name: "zinc oxide paste" }),
      doc({ product_name: "Alcohol hand rub" }),
      doc({ product_name: "Broken", status: "failed" }),
      doc({ product_name: "Pending", status: "processing" }),
    ],
    today
  );
  assert.deepEqual(r.rows.map((x) => x.product_name), ["Alcohol hand rub", "zinc oxide paste"]);
  assert.equal(r.totals.onFile, 2);
});

test("flags what an inspector would question", () => {
  const r = buildInspectionReport(
    [
      doc({ product_name: "Old", revision_date: "2019-06-01" }),
      doc({ product_name: "Undated", revision_date: null }),
      doc({ product_name: "Label", document_type: "label", revision_date: null }),
      doc({ product_name: "Review", status: "needs_review" }),
      doc({ product_name: "Fine" }),
    ],
    today
  );
  const flags = Object.fromEntries(r.rows.map((x) => [x.product_name, x.flags]));
  assert.deepEqual(flags.Old, ["revision_over_5_years"]);
  assert.deepEqual(flags.Undated, ["no_revision_date"]);
  assert.deepEqual(flags.Label, ["label_only"]);
  assert.deepEqual(flags.Review, ["needs_review"]);
  assert.deepEqual(flags.Fine, []);
  assert.deepEqual(r.totals, { onFile: 5, current: 4, needsReview: 1, withFlags: 4, clean: 1 });
});
