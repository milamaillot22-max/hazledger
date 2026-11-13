import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { routes, siteConfig } from "@/config/site";
import { listSdsDocuments } from "@/features/sds/queries";
import { buildInspectionReport, FLAG_LABELS } from "@/features/sds/report";
import { PrintButton } from "@/features/team-access/components/print-button";
import { requirePlan } from "@/features/billing/server";

export const metadata: Metadata = { title: "Inspection report" };

export default function InspectionReportPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 print:max-w-none print:p-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={routes.sdsLibrary} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary">
          <ArrowLeft className="size-4" />
          SDS library
        </Link>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs text-slate-500 sm:block">Print, or choose “Save as PDF” as the destination</p>
          <PrintButton track={false} label="Print / save as PDF" />
        </div>
      </div>
      <Suspense fallback={<div className="h-[60vh] animate-pulse rounded-2xl bg-slate-100" />}>
        <Report />
      </Suspense>
    </div>
  );
}

function usDate(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${m}/${d}/${y}`;
}

async function Report() {
  const { clinic, billing } = await requirePlan();
  const e = billing.entitlement;
  const hasPro = (e.kind === "trialing" || e.kind === "subscribed" || e.kind === "past_due") && e.plan === "pro";
  if (!hasPro) {
    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold tracking-wider text-sky-700 uppercase">Pro feature</p>
        <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-slate-900">Inspection-ready SDS report</h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-slate-600">
          A dated, printable index of every SDS — CAS numbers, revisions and items to check — ready for the day an inspector asks.
          It&apos;s included in the Pro plan.
        </p>
        <Link
          href={routes.billing}
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          {e.kind === "ended" ? "Choose a plan" : "Switch to Pro"}
        </Link>
      </div>
    );
  }
  const docs = await listSdsDocuments(clinic.id);
  const { rows, totals } = buildInspectionReport(docs);
  const generated = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Hazard Communication · 29 CFR 1910.1200</p>
          <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight text-slate-900">Safety Data Sheet index</h1>
          <p className="mt-1 text-sm text-slate-600">
            {clinic.name} · {clinic.state} · Generated {generated}
          </p>
        </div>
        <span className="flex items-center gap-2 text-slate-500">
          <LogoMark className="size-6" />
          <span className="text-xs font-medium">{siteConfig.name}</span>
        </span>
      </header>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "SDSs on file", value: totals.onFile },
          { label: "Reviewed & current", value: totals.current },
          { label: "Awaiting review", value: totals.needsReview },
          { label: "Items to check", value: totals.withFlags },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200/80 px-4 py-3">
            <dt className="text-xs text-slate-500">{s.label}</dt>
            <dd className="font-heading text-2xl font-semibold text-slate-900 tabular">{s.value}</dd>
          </div>
        ))}
      </dl>

      {rows.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-600">
          No SDSs on file yet. Scan your first SDS, then come back to print this report.
        </p>
      ) : (
        <div className="relative mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px] print:min-w-0 print:text-[11px]">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-500">
                <th scope="col" className="py-2 pr-3 font-medium">#</th>
                <th scope="col" className="py-2 pr-3 font-medium">Product</th>
                <th scope="col" className="py-2 pr-3 font-medium">Manufacturer</th>
                <th scope="col" className="py-2 pr-3 font-medium">CAS numbers</th>
                <th scope="col" className="py-2 pr-3 font-medium">Signal word</th>
                <th scope="col" className="py-2 pr-3 font-medium">Revision</th>
                <th scope="col" className="py-2 font-medium">To check</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-b border-slate-100 align-top break-inside-avoid">
                  <td className="py-2.5 pr-3 text-slate-400 tabular">{i + 1}</td>
                  <td className="py-2.5 pr-3 font-medium text-slate-900">{r.product_name ?? "Untitled"}</td>
                  <td className="py-2.5 pr-3 text-slate-700">{r.manufacturer ?? "—"}</td>
                  <td className="py-2.5 pr-3 text-slate-600 tabular">{r.cas_numbers.join(", ") || "—"}</td>
                  <td className="py-2.5 pr-3 text-slate-700">{r.signal_word ?? "—"}</td>
                  <td className="py-2.5 pr-3 text-slate-700 tabular">{usDate(r.revision_date)}</td>
                  <td className="py-2.5 text-amber-700">{r.flags.map((f) => FLAG_LABELS[f]).join(" · ") || <span className="text-emerald-700">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="mt-10 grid gap-8 border-t border-slate-200 pt-6 text-xs text-slate-600 sm:grid-cols-2 print:break-inside-avoid">
        <div className="space-y-2 leading-relaxed">
          <p>
            <span className="font-semibold text-slate-800">Employee access:</span> SDSs are available electronically to all
            employees on every shift via the team QR code posted in each work area, without login (29 CFR 1910.1200(g)(8)).
          </p>
          <p>This index lists SDSs on file in {siteConfig.name}. It does not by itself establish compliance with the standard.</p>
        </div>
        <div className="space-y-6">
          <p className="border-b border-slate-300 pb-1">Reviewed by:</p>
          <p className="border-b border-slate-300 pb-1">Date:</p>
        </div>
      </footer>
    </article>
  );
}
