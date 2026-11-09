/**
 * Values must stay in sync with the CHECK constraints in
 * supabase/migrations/20261109190000_clinics_multitenant.sql.
 */

export const CLINIC_ROLES = ["owner", "admin", "member"] as const;
export type ClinicRole = (typeof CLINIC_ROLES)[number];

export const PRACTICE_TYPES = [
  { value: "dental", label: "Dental", hint: "General & family dentistry" },
  { value: "orthodontics", label: "Orthodontics", hint: "Braces & aligners" },
  { value: "oral_surgery", label: "Oral surgery", hint: "OMS & implant centers" },
  { value: "veterinary", label: "Veterinary", hint: "Small & large animal" },
  { value: "dermatology", label: "Dermatology", hint: "Medical & cosmetic" },
  { value: "med_spa", label: "Med spa", hint: "Aesthetics & injectables" },
  { value: "primary_care", label: "Primary care", hint: "Family & internal medicine" },
  { value: "urgent_care", label: "Urgent care", hint: "Walk-in clinics" },
  { value: "optometry", label: "Optometry", hint: "Eye care" },
  { value: "podiatry", label: "Podiatry", hint: "Foot & ankle" },
  { value: "physical_therapy", label: "Physical therapy", hint: "Rehab & sports" },
  { value: "chiropractic", label: "Chiropractic", hint: "Spine & wellness" },
  { value: "other", label: "Other", hint: "Another practice type" },
] as const;

export type PracticeType = (typeof PRACTICE_TYPES)[number]["value"];
export const PRACTICE_TYPE_VALUES = PRACTICE_TYPES.map((p) => p.value) as [
  PracticeType,
  ...PracticeType[],
];

/** 50 states + DC, USPS codes. */
export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
] as const;

export type UsStateCode = (typeof US_STATES)[number]["code"];
export const US_STATE_CODES = US_STATES.map((s) => s.code) as [
  UsStateCode,
  ...UsStateCode[],
];

export function practiceTypeLabel(value: string) {
  return PRACTICE_TYPES.find((p) => p.value === value)?.label ?? value;
}

export function stateName(code: string) {
  return US_STATES.find((s) => s.code === code)?.name ?? code;
}
