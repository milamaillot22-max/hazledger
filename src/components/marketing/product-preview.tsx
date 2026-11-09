import { QrCode, ScanLine, Search } from "lucide-react";

import { GhsDiamond } from "@/components/marketing/ghs-pictogram";
import type { SdsRecord, SdsStatus } from "@/features/sds/types";
import { cn } from "@/lib/utils";

/**
 * Static, code-rendered product shot (no screenshot to keep in sync).
 * Sample data only — invented manufacturers, real CAS numbers.
 */
const SAMPLE: SdsRecord[] = [
  {
    id: "1",
    productName: "Acetone, Technical Grade",
    manufacturer: "Northfield Chemical",
    casNumbers: ["67-64-1"],
    revisionDate: "2026-03-02",
    signalWord: "Danger",
    pictograms: ["GHS02", "GHS07"],
    status: "current",
    locationIds: ["paint-booth"],
  },
  {
    id: "2",
    productName: "Sodium Hypochlorite 12.5%",
    manufacturer: "Keystone Supply Co.",
    casNumbers: ["7681-52-9"],
    revisionDate: "2021-08-17",
    signalWord: "Danger",
    pictograms: ["GHS05"],
    status: "review_due",
    locationIds: ["sanitation"],
  },
  {
    id: "3",
    productName: "Isopropyl Alcohol 99%",
    manufacturer: "Northfield Chemical",
    casNumbers: ["67-63-0"],
    revisionDate: "2025-11-20",
    signalWord: "Danger",
    pictograms: ["GHS02", "GHS07"],
    status: "current",
    locationIds: ["maintenance"],
  },
  {
    id: "4",
    productName: "Toluene",
    manufacturer: "Lakeshore Solvents",
    casNumbers: ["108-88-3"],
    revisionDate: "2026-01-14",
    signalWord: "Danger",
    pictograms: ["GHS02", "GHS06"],
    status: "processing",
    locationIds: ["paint-booth"],
  },
  {
    id: "5",
    productName: "Hydrochloric Acid 31%",
    manufacturer: "—",
    casNumbers: ["7647-01-0"],
    revisionDate: "",
    signalWord: null,
    pictograms: [],
    status: "missing",
    locationIds: ["wastewater"],
  },
];

const STATUS_STYLES: Record<SdsStatus, { label: string; className: string; dot: string }> = {
  current: {
    label: "Current",
    className: "bg-brand-soft text-primary",
    dot: "bg-primary",
  },
  review_due: {
    label: "New revision",
    className: "bg-amber-50 text-warning",
    dot: "bg-warning",
  },
  missing: {
    label: "Missing SDS",
    className: "bg-red-50 text-destructive",
    dot: "bg-destructive",
  },
  processing: {
    label: "Extracting…",
    className: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400 animate-pulse",
  },
};

function formatDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
}

export function ProductPreview() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.12)]">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-border bg-[#fcfcfc] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-slate-200" />
            <span className="size-2.5 rounded-full bg-slate-200" />
            <span className="size-2.5 rounded-full bg-slate-200" />
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            app.hazledger.com/sds
          </div>
          <div className="w-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px]">
          {/* library */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                  Plant 2 · Dayton, OH
                </p>
                <p className="font-heading text-[15px] font-semibold text-foreground">
                  SDS Library
                  <span className="ml-2 font-sans text-xs font-normal text-slate-500 tabular">
                    412 documents
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-slate-400 sm:flex">
                  <Search className="size-3.5" />
                  Search product, CAS…
                </div>
                <div className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground">
                  <ScanLine className="size-3.5" />
                  Scan SDS
                </div>
              </div>
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-border text-[11px] tracking-wide text-slate-500 uppercase">
                    <th className="px-5 py-2.5 font-medium">Product</th>
                    <th className="px-3 py-2.5 font-medium">CAS</th>
                    <th className="px-3 py-2.5 font-medium">Hazards</th>
                    <th className="px-3 py-2.5 font-medium">Revised</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE.map((row) => {
                    const status = STATUS_STYLES[row.status];
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-border/70 last:border-0"
                      >
                        <td className="px-5 py-3">
                          <p className="font-medium text-slate-900">
                            {row.productName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {row.manufacturer}
                          </p>
                        </td>
                        <td className="px-3 py-3 font-mono text-xs text-slate-600">
                          {row.casNumbers.join(", ")}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-0.5">
                            {row.pictograms.length ? (
                              row.pictograms.map((p) => (
                                <GhsDiamond key={p} code={p} />
                              ))
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-slate-600 tabular">
                          {formatDate(row.revisionDate)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
                              status.className
                            )}
                          >
                            <span className={cn("size-1.5 rounded-full", status.dot)} />
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* side panel */}
          <aside className="hidden flex-col gap-4 border-l border-border bg-[#fcfcfc] p-5 md:flex">
            <div>
              <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                Audit readiness
              </p>
              <p className="mt-1 font-heading text-3xl font-bold text-foreground tabular">
                98.6%
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[98.6%] rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                2 actions before you&apos;re inspection-ready
              </p>
            </div>
            <div className="h-px bg-border" />
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center justify-between">
                <span className="text-slate-600">Current</span>
                <span className="font-medium text-slate-900 tabular">406</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-600">New revision</span>
                <span className="font-medium text-warning tabular">5</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-600">Missing</span>
                <span className="font-medium text-destructive tabular">1</span>
              </li>
            </ul>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-brand-soft">
                <QrCode className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-900">Paint booth</p>
                <p className="text-[11px] text-slate-500">QR poster · 38 SDSs</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
