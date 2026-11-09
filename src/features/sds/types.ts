/**
 * SDS domain model — shared by the marketing preview, the SDS library and the
 * upcoming scanner (PDF/photo → structured record).
 *
 * Mirrors the 16-section format required by OSHA HazCom (29 CFR 1910.1200,
 * Appendix D) and the GHS.
 */

export const SDS_SECTIONS = [
  { number: 1, title: "Identification" },
  { number: 2, title: "Hazard(s) identification" },
  { number: 3, title: "Composition / information on ingredients" },
  { number: 4, title: "First-aid measures" },
  { number: 5, title: "Fire-fighting measures" },
  { number: 6, title: "Accidental release measures" },
  { number: 7, title: "Handling and storage" },
  { number: 8, title: "Exposure controls / personal protection" },
  { number: 9, title: "Physical and chemical properties" },
  { number: 10, title: "Stability and reactivity" },
  { number: 11, title: "Toxicological information" },
  { number: 12, title: "Ecological information" },
  { number: 13, title: "Disposal considerations" },
  { number: 14, title: "Transport information" },
  { number: 15, title: "Regulatory information" },
  { number: 16, title: "Other information" },
] as const;

export type SdsSectionNumber = (typeof SDS_SECTIONS)[number]["number"];

/** The nine GHS hazard pictograms (codes GHS01–GHS09). */
export type GhsPictogram =
  | "GHS01" // exploding bomb
  | "GHS02" // flame
  | "GHS03" // flame over circle
  | "GHS04" // gas cylinder
  | "GHS05" // corrosion
  | "GHS06" // skull and crossbones
  | "GHS07" // exclamation mark
  | "GHS08" // health hazard
  | "GHS09"; // environment

export type SignalWord = "Danger" | "Warning" | null;

/** Lifecycle of an SDS in a customer's library. */
export type SdsStatus =
  | "current" // latest revision on file
  | "review_due" // a newer revision exists or revision is older than policy
  | "missing" // chemical is in inventory but no SDS on file
  | "processing"; // scanner is extracting data

export interface SdsRecord {
  id: string;
  productName: string;
  manufacturer: string;
  casNumbers: string[];
  revisionDate: string; // ISO date
  signalWord: SignalWord;
  pictograms: GhsPictogram[];
  status: SdsStatus;
  locationIds: string[];
}

/** Output of the scanner before human verification. */
export interface SdsExtraction {
  record: Omit<SdsRecord, "id" | "status" | "locationIds">;
  sections: Partial<Record<SdsSectionNumber, string>>;
  /** 0–1 confidence per section, used to flag fields for human review. */
  confidence: Partial<Record<SdsSectionNumber, number>>;
  sourceFileId: string;
}
