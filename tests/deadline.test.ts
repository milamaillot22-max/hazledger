import { test } from "node:test";
import assert from "node:assert/strict";

import { HAZCOM_2024 } from "../src/config/compliance.ts";
import { daysUntil } from "../src/lib/dates.ts";

const employerSubstances = HAZCOM_2024.milestones[1];

test("top bar uses the HCS 2024 employer deadline for substances", () => {
  assert.equal(employerSubstances.date, "2026-11-20");
  assert.equal(employerSubstances.who, "Employers");
});

test("counts whole calendar days, regardless of time of day", () => {
  assert.equal(daysUntil("2026-11-20", new Date(2026, 10, 11, 0, 5)), 9);
  assert.equal(daysUntil("2026-11-20", new Date(2026, 10, 11, 23, 55)), 9);
  assert.equal(daysUntil("2026-11-20", new Date(2026, 10, 20, 12)), 0);
  assert.equal(daysUntil("2026-11-20", new Date(2026, 10, 21, 8)), -1);
});

test("spans month and year boundaries", () => {
  assert.equal(daysUntil("2027-01-01", new Date(2026, 11, 31)), 1);
});
