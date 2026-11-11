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

/**
 * HazCom 2024 (89 FR 44144, effective July 19, 2024) as amended by the
 * January 15, 2026 final rule (91 FR 1695) that pushed every date by four months.
 */
export const HAZCOM_2024 = {
  effective: "2024-07-19",
  extensionRule: "91 FR 1695 (January 15, 2026)",
  extensionUrl: "https://www.osha.gov/hazcom/rulemaking/extension",
  milestones: [
    { date: "2026-05-19", who: "Manufacturers, importers & distributors", what: "Substances: updated SDSs and labels" },
    { date: "2026-11-20", who: "Employers", what: "Substances: workplace labels, written program, training" },
    { date: "2027-11-19", who: "Manufacturers, importers & distributors", what: "Mixtures: updated SDSs and labels" },
    { date: "2028-05-19", who: "Employers", what: "Mixtures: workplace labels, written program, training" },
  ],
} as const;

export function formatUsDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
