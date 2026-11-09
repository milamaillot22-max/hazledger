import { z } from "zod";

/**
 * Structured output contract for the SDS scanner (Claude structured outputs).
 * Keep every field nullable-or-required: the model must say "not present"
 * explicitly rather than omit keys. Numeric/string constraints are validated
 * client-side by the SDK (the API ignores them).
 */

export const GHS_CODES = [
  "GHS01",
  "GHS02",
  "GHS03",
  "GHS04",
  "GHS05",
  "GHS06",
  "GHS07",
  "GHS08",
  "GHS09",
] as const;
export type GhsCode = (typeof GHS_CODES)[number];

const confidence = z
  .number()
  .min(0)
  .max(1)
  .describe("0 = guessed or not found, 1 = printed clearly in the document");

const statement = z.object({
  code: z
    .string()
    .nullable()
    .describe("GHS code as printed, e.g. H225, P210. Null if no code is printed."),
  text: z.string().describe("Statement text exactly as printed"),
});

export const SdsExtractionSchema = z.object({
  document_type: z
    .enum(["sds", "label", "other"])
    .describe(
      "sds = Safety Data Sheet (any length); label = product container label; other = anything else"
    ),
  product_name: z.string().nullable().describe("Product identifier from Section 1 or the label"),
  product_identifiers: z
    .array(z.string())
    .describe("Product codes, catalog or SKU numbers printed in the document"),
  manufacturer: z.object({
    name: z.string().nullable().describe("Manufacturer, importer or distributor name"),
    phone: z.string().nullable(),
    emergency_phone: z.string().nullable(),
  }),
  recommended_use: z.string().nullable(),
  revision_date: z
    .string()
    .nullable()
    .describe(
      "Revision date (or issue date if no revision date) as YYYY-MM-DD. Null if not printed."
    ),
  signal_word: z.enum(["Danger", "Warning"]).nullable(),
  pictograms: z
    .array(z.enum(GHS_CODES))
    .describe(
      "GHS pictograms shown or listed: GHS01 exploding bomb, GHS02 flame, GHS03 flame over circle, GHS04 gas cylinder, GHS05 corrosion, GHS06 skull and crossbones, GHS07 exclamation mark, GHS08 health hazard, GHS09 environment"
    ),
  hazard_statements: z.array(statement),
  precautionary_statements: z.array(statement),
  ingredients: z
    .array(
      z.object({
        name: z.string(),
        cas_number: z
          .string()
          .nullable()
          .describe("CAS number exactly as printed, e.g. 67-63-0. Null if not printed."),
        concentration: z.string().nullable().describe("As printed, e.g. '55%', '10-30%'"),
      })
    )
    .describe("Section 3 composition, or ingredients named on a label"),
  ppe: z.array(z.string()).describe("Personal protective equipment from Section 8 or the label"),
  sections: z
    .array(
      z.object({
        number: z.number().int().min(1).max(16),
        title: z.string(),
        summary: z
          .string()
          .describe("2-4 factual sentences a clinic manager can act on. No invented content."),
      })
    )
    .describe("One entry per SDS section actually present in the document, in order"),
  confidence: z.object({
    product_name: confidence,
    manufacturer: confidence,
    revision_date: confidence,
    hazards: confidence,
    ingredients: confidence,
  }),
  notes: z
    .array(z.string())
    .describe("Anything a reviewer should know: unreadable areas, missing pages, language, etc."),
});

export type SdsExtraction = z.infer<typeof SdsExtractionSchema>;

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export type AcceptedMimeType = (typeof ACCEPTED_MIME_TYPES)[number];

/** Matches the `sds-files` bucket limit (20 MB). */
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export const SDS_STATUSES = ["processing", "needs_review", "current", "failed"] as const;
export type SdsDocumentStatus = (typeof SDS_STATUSES)[number];
