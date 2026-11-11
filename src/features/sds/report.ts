/**
 * Inspection report: the clinic's SDS index as an inspector would ask for it.
 * Pure (no framework or server imports) so it can be unit-tested.
 */

export type ReportInput = {
  id: string;
  status: string;
  document_type: string | null;
  product_name: string | null;
  manufacturer: string | null;
  revision_date: string | null;
  signal_word: string | null;
  pictograms: string[];
  cas_numbers: string[];
};

export type ReportFlag = "needs_review" | "revision_over_5_years" | "no_revision_date" | "label_only";

export type ReportRow = ReportInput & { flags: ReportFlag[] };

export const FLAG_LABELS: Record<ReportFlag, string> = {
  needs_review: "Awaiting review",
  revision_over_5_years: "Revision > 5 years old",
  no_revision_date: "No revision date",
  label_only: "Label only — obtain full SDS",
};

/** Same threshold the scanner uses when it flags an old revision. */
const STALE_YEARS = 5;

function yearsBetween(isoDate: string, today: Date) {
  return (today.getTime() - new Date(`${isoDate.slice(0, 10)}T00:00:00Z`).getTime()) / (365.25 * 864e5);
}

export function buildInspectionReport(docs: ReportInput[], today: Date = new Date()) {
  // Failed or in-progress scans are not part of the library an inspector sees.
  const onFile = docs.filter((d) => d.status === "current" || d.status === "needs_review");

  const rows: ReportRow[] = onFile
    .map((d) => {
      const flags: ReportFlag[] = [];
      if (d.status === "needs_review") flags.push("needs_review");
      if (d.document_type === "label") flags.push("label_only");
      if (!d.revision_date) {
        if (d.document_type !== "label") flags.push("no_revision_date");
      } else if (yearsBetween(d.revision_date, today) > STALE_YEARS) {
        flags.push("revision_over_5_years");
      }
      return { ...d, flags };
    })
    .sort((a, b) => (a.product_name ?? "~").localeCompare(b.product_name ?? "~", "en", { sensitivity: "base" }));

  const withFlags = rows.filter((r) => r.flags.length > 0).length;
  return {
    rows,
    totals: {
      onFile: rows.length,
      current: rows.filter((r) => r.status === "current").length,
      needsReview: rows.filter((r) => r.status === "needs_review").length,
      withFlags,
      clean: rows.length - withFlags,
    },
  };
}
