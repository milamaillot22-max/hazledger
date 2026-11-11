/**
 * Regulatory figures used in marketing and calculators. Update every January:
 * OSHA adjusts civil penalties for inflation (it skipped 2026 — see source).
 */
export const OSHA_PENALTIES = {
  effectiveYear: 2026,
  seriousMax: 16_550,
  otherThanSeriousMax: 16_550,
  willfulOrRepeatedMax: 165_514,
  failureToAbatePerDayMax: 16_550,
  source: "OSHA memo of May 21, 2026: no inflation adjustment for 2026; 2025 maximums remain in effect.",
  sourceUrl: "https://www.osha.gov/memos/2026-05-21/2026-annual-adjustments-osha-civil-penalties",
} as const;

/**
 * Maximum penalty reduction for employer size (OSHA Field Operations Manual,
 * Chapter 6, as revised July 14, 2025). Headcount = all US workplaces.
 */
export const OSHA_SIZE_REDUCTION_TIERS = [
  { maxEmployees: 25, reduction: 0.7 },
  { maxEmployees: 100, reduction: 0.3 },
  { maxEmployees: 250, reduction: 0.1 },
] as const;

/** Core HazCom requirements an inspector checks (29 CFR 1910.1200). */
export const CORE_HAZCOM_REQUIREMENTS = [
  { ref: "1910.1200(e)(1)", label: "Written hazard communication program" },
  { ref: "1910.1200(f)(6)", label: "Workplace container labels" },
  { ref: "1910.1200(g)(1)", label: "An SDS for every hazardous chemical" },
  { ref: "1910.1200(g)(8)", label: "SDSs readily accessible on every shift" },
  { ref: "1910.1200(h)(1)", label: "Employee information and training" },
] as const;
