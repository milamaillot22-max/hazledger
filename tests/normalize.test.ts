import { test } from "node:test";
import assert from "node:assert/strict";

import { isValidCas, normalizeExtraction } from "../src/features/sds/normalize.ts";

const base = {
  document_type: "sds" as const,
  product_name: "SteriGuard Surface Disinfectant",
  product_identifiers: [],
  manufacturer: { name: "Brightline Health", phone: null, emergency_phone: "1-800-555-0100" },
  recommended_use: "Hard surface disinfection",
  revision_date: "2026-03-02",
  signal_word: "Warning" as const,
  pictograms: ["GHS07", "GHS02", "GHS02"] as ("GHS02" | "GHS07")[],
  hazard_statements: [{ code: "H226", text: "Flammable liquid and vapor." }],
  precautionary_statements: [],
  ingredients: [
    { name: "Isopropyl alcohol", cas_number: "67-63-0", concentration: "55%" },
    { name: "Made-up compound", cas_number: "67-63-1", concentration: "1%" },
  ],
  ppe: ["Gloves", " Gloves ", "Eye protection"],
  sections: Array.from({ length: 16 }, (_, i) => ({ number: 16 - i, title: `S${16 - i}`, summary: "…" })),
  confidence: { product_name: 0.98, manufacturer: 0.95, revision_date: 0.9, hazards: 0.92, ingredients: 0.6 },
  notes: [],
};
const today = new Date("2026-11-09T00:00:00Z");

test("CAS check digits", () => {
  for (const ok of ["67-63-0", "7732-18-5", "111-30-8", "7664-38-2", "50-00-0", "26675-46-7", "64-17-5"]) {
    assert.equal(isValidCas(ok), true, ok);
  }
  for (const bad of ["67-63-1", "7732-18-4", "67630", "1-23-4", "abc-de-f", ""]) {
    assert.equal(isValidCas(bad), false, bad);
  }
});

test("keeps valid CAS, flags invented ones", () => {
  const n = normalizeExtraction(base, today);
  assert.deepEqual(n.cas_numbers, ["67-63-0"]);
  assert.ok(n.review_flags.some((f) => f.includes("67-63-1")));
});

test("dedupes pictograms and PPE, sorts sections", () => {
  const n = normalizeExtraction(base, today);
  assert.deepEqual(n.pictograms, ["GHS02", "GHS07"]);
  assert.deepEqual(n.ppe, ["Gloves", "Eye protection"]);
  assert.equal(n.sections[0].number, 1);
});

test("flags low confidence and incomplete SDS", () => {
  const n = normalizeExtraction({ ...base, sections: base.sections.slice(0, 9) }, today);
  assert.ok(n.review_flags.some((f) => f.includes("Low confidence on ingredients")));
  assert.ok(n.review_flags.some((f) => f.includes("Only 9 of 16")));
});

test("rejects impossible and future dates, flags old revisions", () => {
  assert.equal(normalizeExtraction({ ...base, revision_date: "2026-02-30" }, today).revision_date, null);
  const future = normalizeExtraction({ ...base, revision_date: "2027-01-01" }, today);
  assert.equal(future.revision_date, null);
  assert.ok(future.review_flags.some((f) => f.includes("in the future")));
  const old = normalizeExtraction({ ...base, revision_date: "2019-05-01" }, today);
  assert.equal(old.revision_date, "2019-05-01");
  assert.ok(old.review_flags.some((f) => f.includes("more than 5 years")));
});

test("labels are flagged as incomplete records", () => {
  const n = normalizeExtraction({ ...base, document_type: "label", sections: [] }, today);
  assert.ok(n.review_flags[0].includes("product label"));
  assert.ok(!n.review_flags.some((f) => f.includes("of 16 SDS sections")));
});
