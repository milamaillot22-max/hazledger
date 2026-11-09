/**
 * Pure post-processing of a scanner extraction: validation that does not
 * trust the model (CAS check digits, dates) and review flags for humans.
 * No framework imports — unit-testable with plain Node.
 */
import type { GhsCode, SdsExtraction } from "./schema";

const CAS_PATTERN = /^(\d{2,7})-(\d{2})-(\d)$/;

/** CAS Registry Number check-digit validation. */
export function isValidCas(value: string): boolean {
  const match = CAS_PATTERN.exec(value.trim());
  if (!match) return false;
  const digits = (match[1] + match[2]).split("").reverse();
  const sum = digits.reduce((acc, d, i) => acc + Number(d) * (i + 1), 0);
  return sum % 10 === Number(match[3]);
}

function isRealIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export const LOW_CONFIDENCE = 0.7;

export type NormalizedSds = {
  document_type: SdsExtraction["document_type"];
  product_name: string | null;
  manufacturer: string | null;
  manufacturer_phone: string | null;
  emergency_phone: string | null;
  recommended_use: string | null;
  revision_date: string | null;
  signal_word: SdsExtraction["signal_word"];
  pictograms: GhsCode[];
  cas_numbers: string[];
  hazard_statements: SdsExtraction["hazard_statements"];
  ingredients: SdsExtraction["ingredients"];
  ppe: string[];
  sections: SdsExtraction["sections"];
  confidence: SdsExtraction["confidence"];
  review_flags: string[];
};

export function normalizeExtraction(
  x: SdsExtraction,
  today: Date = new Date()
): NormalizedSds {
  const flags: string[] = [];

  if (x.document_type === "label") {
    flags.push(
      "This is a product label, not a full SDS. Request the 16-section SDS from the manufacturer to complete this record."
    );
  } else if (x.document_type === "other") {
    flags.push("This document does not look like an SDS or a product label.");
  }

  // CAS numbers: keep only check-digit-valid ones.
  const cas = new Set<string>();
  for (const ing of x.ingredients) {
    if (!ing.cas_number) continue;
    const value = ing.cas_number.trim();
    if (isValidCas(value)) cas.add(value);
    else flags.push(`CAS number “${value}” (${ing.name}) failed validation — check it against the document.`);
  }

  // Revision date: real date, not in the future.
  let revision: string | null = null;
  if (x.revision_date) {
    const v = x.revision_date.trim();
    if (!isRealIsoDate(v)) {
      flags.push(`Revision date “${v}” could not be read as a date.`);
    } else if (new Date(`${v}T00:00:00Z`) > today) {
      flags.push(`Revision date ${v} is in the future — check it against the document.`);
    } else {
      revision = v;
      const years = (today.getTime() - new Date(`${v}T00:00:00Z`).getTime()) / (365.25 * 864e5);
      if (years > 5) {
        flags.push("This SDS revision is more than 5 years old. Check the manufacturer's website for a newer version.");
      }
    }
  } else if (x.document_type === "sds") {
    flags.push("No revision date found.");
  }

  if (x.document_type === "sds") {
    const found = new Set(x.sections.map((s) => s.number));
    if (found.size < 16) {
      flags.push(`Only ${found.size} of 16 SDS sections were found. The document may be incomplete or in an older format.`);
    }
  }

  const labels: Record<keyof SdsExtraction["confidence"], string> = {
    product_name: "product name",
    manufacturer: "manufacturer",
    revision_date: "revision date",
    hazards: "hazard information",
    ingredients: "ingredients",
  };
  for (const [key, label] of Object.entries(labels) as [keyof typeof labels, string][]) {
    if (x.confidence[key] < LOW_CONFIDENCE) flags.push(`Low confidence on ${label} — please verify.`);
  }

  if (!x.product_name) flags.push("No product name found.");
  for (const note of x.notes) flags.push(`Scanner note: ${note}`);

  return {
    document_type: x.document_type,
    product_name: x.product_name?.trim() || null,
    manufacturer: x.manufacturer.name?.trim() || null,
    manufacturer_phone: x.manufacturer.phone?.trim() || null,
    emergency_phone: x.manufacturer.emergency_phone?.trim() || null,
    recommended_use: x.recommended_use?.trim() || null,
    revision_date: revision,
    signal_word: x.signal_word,
    pictograms: [...new Set(x.pictograms)].sort(),
    cas_numbers: [...cas],
    hazard_statements: x.hazard_statements,
    ingredients: x.ingredients,
    ppe: [...new Set(x.ppe.map((p) => p.trim()).filter(Boolean))],
    sections: [...x.sections].sort((a, b) => a.number - b.number),
    confidence: x.confidence,
    review_flags: [...new Set(flags)],
  };
}
