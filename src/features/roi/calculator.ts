/**
 * OSHA risk & ROI calculator — pure functions, no framework imports
 * (unit-tested with plain Node in tests/calculator.test.ts).
 *
 * Every figure is either a published regulatory amount (src/config/compliance.ts)
 * or an explicit, user-editable assumption. Nothing is hard-coded marketing.
 */
import {
  CORE_HAZCOM_REQUIREMENTS,
  OSHA_PENALTIES,
  OSHA_SIZE_REDUCTION_TIERS,
} from "../../config/compliance.ts";

export const SECTORS = {
  dental: {
    label: "Dental clinic",
    roomsLabel: "Operatories",
    baseProducts: 25,
    productsPerRoom: 6,
  },
  veterinary: {
    label: "Veterinary practice",
    roomsLabel: "Exam & surgery rooms",
    baseProducts: 40,
    productsPerRoom: 5,
  },
  medical: {
    label: "Medical clinic / surgicenter",
    roomsLabel: "Exam & procedure rooms",
    baseProducts: 30,
    productsPerRoom: 6,
  },
} as const;

export type Sector = keyof typeof SECTORS;

export type Assumptions = {
  /** Fully loaded hourly cost of the staff member who maintains the binder. */
  hourlyCost: number;
  /** Manual time per product per year: find the latest SDS, print, file, check revisions. */
  manualMinutesPerProduct: number;
  /** Monthly binder audit per location. */
  auditHoursPerMonth: number;
  /** Time each employee loses per year locating SDSs in a binder. */
  lookupHoursPerEmployee: number;
  /** HazLedger time per product per year: scan and review. */
  hazledgerMinutesPerProduct: number;
  /** HazLedger audit/export time per year. */
  hazledgerAuditHoursPerYear: number;
};

export const DEFAULT_ASSUMPTIONS: Assumptions = {
  hourlyCost: 30,
  manualMinutesPerProduct: 30,
  auditHoursPerMonth: 1,
  lookupHoursPerEmployee: 1,
  hazledgerMinutesPerProduct: 5,
  hazledgerAuditHoursPerYear: 1,
};

export const LIMITS = {
  employees: { min: 1, max: 500 },
  rooms: { min: 1, max: 60 },
  products: { min: 1, max: 2000 },
} as const;

export type CalculatorInput = {
  sector: Sector;
  employees: number;
  rooms: number;
  /** Override the sector estimate when the clinic knows its count. */
  products?: number;
  assumptions?: Partial<Assumptions>;
  /** Subscription price per month (one location). */
  monthlyPrice: number;
};

export type CalculatorResult = {
  products: number;
  productsEstimated: boolean;
  risk: {
    sizeReduction: number;
    seriousMax: number;
    seriousAfterSizeReduction: number;
    coreRequirements: number;
    allCoreMax: number;
    allCoreAfterSizeReduction: number;
    willfulOrRepeatedMax: number;
  };
  time: {
    manualHours: number;
    hazledgerHours: number;
    hoursSaved: number;
    valueSaved: number;
  };
  subscriptionAnnual: number;
  /** Net return on staff time alone (risk avoided is not counted). Null if price is 0. */
  roiPercent: number | null;
  /** Days of saved staff time needed to pay for a year. Null if no time is saved. */
  paybackDays: number | null;
  /** How many years of subscription one reduced serious citation would pay for. */
  yearsCoveredByOneCitation: number | null;
};

const clamp = (n: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : min;
const round1 = (n: number) => Math.round(n * 10) / 10;

export function estimateProducts(sector: Sector, rooms: number): number {
  const s = SECTORS[sector];
  return s.baseProducts + s.productsPerRoom * clamp(rooms, LIMITS.rooms.min, LIMITS.rooms.max);
}

/** Maximum size reduction OSHA may apply for this headcount (0–0.7). */
export function sizeReductionFor(employees: number): number {
  const n = clamp(employees, LIMITS.employees.min, Number.MAX_SAFE_INTEGER);
  return OSHA_SIZE_REDUCTION_TIERS.find((t) => n <= t.maxEmployees)?.reduction ?? 0;
}

export function calculate(input: CalculatorInput): CalculatorResult {
  const a: Assumptions = { ...DEFAULT_ASSUMPTIONS, ...input.assumptions };
  const employees = clamp(input.employees, LIMITS.employees.min, LIMITS.employees.max);
  const rooms = clamp(input.rooms, LIMITS.rooms.min, LIMITS.rooms.max);
  const productsEstimated = input.products === undefined;
  const products = productsEstimated
    ? estimateProducts(input.sector, rooms)
    : clamp(input.products!, LIMITS.products.min, LIMITS.products.max);

  // Risk — published maximums; size reduction lowers the serious-violation figure.
  const reduction = sizeReductionFor(employees);
  const seriousMax = OSHA_PENALTIES.seriousMax;
  const seriousAfter = Math.round(seriousMax * (1 - reduction));
  const core = CORE_HAZCOM_REQUIREMENTS.length;

  // Time — explicit assumptions.
  const manualHours =
    (products * Math.max(0, a.manualMinutesPerProduct)) / 60 +
    Math.max(0, a.auditHoursPerMonth) * 12 +
    employees * Math.max(0, a.lookupHoursPerEmployee);
  const hazledgerHours =
    (products * Math.max(0, a.hazledgerMinutesPerProduct)) / 60 + Math.max(0, a.hazledgerAuditHoursPerYear);
  // Value is computed from the displayed (rounded) hours so the UI math adds up.
  const hoursSaved = round1(Math.max(0, manualHours - hazledgerHours));
  const valueSaved = Math.round(hoursSaved * Math.max(0, a.hourlyCost));

  const subscriptionAnnual = Math.round(Math.max(0, input.monthlyPrice) * 12);
  const roiPercent =
    subscriptionAnnual > 0 ? Math.round(((valueSaved - subscriptionAnnual) / subscriptionAnnual) * 100) : null;
  const paybackDays = valueSaved > 0 ? Math.ceil((subscriptionAnnual / valueSaved) * 365) : null;
  const yearsCoveredByOneCitation = subscriptionAnnual > 0 ? round1(seriousAfter / subscriptionAnnual) : null;

  return {
    products,
    productsEstimated,
    risk: {
      sizeReduction: reduction,
      seriousMax,
      seriousAfterSizeReduction: seriousAfter,
      coreRequirements: core,
      allCoreMax: seriousMax * core,
      allCoreAfterSizeReduction: seriousAfter * core,
      willfulOrRepeatedMax: OSHA_PENALTIES.willfulOrRepeatedMax,
    },
    time: {
      manualHours: round1(manualHours),
      hazledgerHours: round1(hazledgerHours),
      hoursSaved,
      valueSaved,
    },
    subscriptionAnnual,
    roiPercent,
    paybackDays,
    yearsCoveredByOneCitation,
  };
}
