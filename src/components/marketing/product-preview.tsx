import { QrCode, ScanLine, Search } from "lucide-react";

import { GhsDiamond } from "@/components/marketing/ghs-pictogram";
import type { SdsRecord, SdsStatus } from "@/features/sds/types";
import { cn } from "@/lib/utils";

/**
 * Static, code-rendered product shot (no screenshot to keep in sync).
 * Sample data only — invented brands and manufacturers, real CAS numbers.
 */
const SAMPLE: SdsRecord[] = [
  {
    id: "1",
    productName: "ClearGuard Surface Disinfectant Wipes",
    manufacturer: "Northline Medical Supply",
    casNumbers: ["67-63-0"],
    revisionDate: "2026-03-02",
    signalWord: "Danger",
    pictograms: ["GHS02", "GHS07"],
    status: "current",
    locationIds: ["operatory-1"],
  },
  {
    id: "2",
    productName: "Glutaraldehyde 2.5% High-Level Disinfectant",
    manufacturer: "Brightline Health",
    casNumbers: ["111-30-8"],
    revisionDate: "2021-08-17",
    signalWord: "Danger",
    pictograms: ["GHS05", "GHS06", "GHS08"],
    status: "review_due",
    locationIds: ["sterilization"],
  },
  {
    id: "3",
    productName: "Phosphoric Acid Etchant Gel 37%",
    manufacturer: "Apex Dental Materials",
    casNumbers: ["7664-38-2"],
    revisionDate: "2025-11-20",
    signalWord: "Danger",
    pictograms: ["GHS05"],
    status: "current",
    locationIds: ["operatory-2"],
  },
  {
    id: "4",
    productName: "Formalin 10% Neutral Buffered",
    manufacturer: "Lakeshore Lab Supply",
    casNumbers: ["50-00-0"],
    revisionDate: "2026-01-14",
    signalWord: "Danger",
    pictograms: ["GHS07", "GHS08"],
    status: "processing",
    locationIds: ["lab"],
  },
  {
    id: "5",
    productName: "Isoflurane, USP",
    manufacturer: "—",
    casNumbers: ["26675-46-7"],
    revisionDate: "",
    signalWord: null,
    pictograms: [],
    status: "missing",
    locationIds: ["surgery"],
  },
];

const STATUS_STYLES: Record<SdsStatus, { label: string; className: string; dot: string }> = {
  current: {
    label: "Current",
    className: "bg-success-soft text-emerald-700",
    dot: "bg-success",
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
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-border bg-[#fcfcfc] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-slate-200" />
            <span className="size-2.5 rounded-full bg-slate-200" />
            <span className="size-2.5 rounded-full bg-slate-200" />
          </div>
          <div className="rounded-md bg-white px-3 py-0.5 text-[11px] text-slate-400 ring-1 ring-slate-200">
            gethazledger.com/dashboard/sds
          </div>
          <div className="w-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px]">
          {/* library */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                  Sunset Family Dental · San Diego, CA
                </p>
                <p className="font-heading text-[15px] font-semibold text-foreground">
                  SDS Library
                  <span className="ml-2 font-sans text-xs font-normal text-slate-500 tabular">
                    86 documents
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
                        <td className="px-3 py-3 text-xs text-slate-600 tabular">
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
              <p className="mt-1 font-heading text-3xl font-semibold text-emerald-700 tabular">
                97.7%
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[97.7%] rounded-full bg-success" />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                4 actions before you&apos;re inspection-ready
              </p>
            </div>
            <div className="h-px bg-border" />
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center justify-between">
                <span className="text-slate-600">Current</span>
                <span className="font-medium text-slate-900 tabular">82</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-600">New revision</span>
                <span className="font-medium text-warning tabular">3</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-slate-600">Missing</span>
                <span className="font-medium text-destructive tabular">1</span>
              </li>
            </ul>
            <div className="h-px bg-border" />
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-brand-soft">
                <QrCode className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-900">Team QR poster</p>
                <p className="text-[11px] text-slate-500">Live for staff · 82 SDSs</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
