import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckCircle2, ChevronRight, ClipboardList, FileSearch, ScanLine } from "lucide-react";

import { GhsDiamond } from "@/components/marketing/ghs-pictogram";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/site";
import { SdsStatusBadge } from "@/features/sds/components/status-badge";
import { listSdsDocuments, type SdsListItem } from "@/features/sds/queries";
import type { GhsCode } from "@/features/sds/schema";
import { requireClinic } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "SDS library" };

export default function SdsLibraryPage({ searchParams }: PageProps<"/dashboard/sds">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">SDS library</h1>
          <p className="mt-1 text-[15px] text-slate-600">Every Safety Data Sheet on file for this location.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild size="xl" variant="outline" className="border-slate-200 bg-white text-slate-800">
            <Link href={routes.sdsReport}>
              <ClipboardList data-icon="inline-start" />
              Inspection report
            </Link>
          </Button>
          <Button asChild size="xl">
            <Link href={routes.sdsScan}>
              <ScanLine data-icon="inline-start" />
              Scan an SDS
            </Link>
          </Button>
        </div>
      </div>
      <Suspense fallback={<LibrarySkeleton />}>
        <Library searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${m}/${d}/${y}`;
}

async function Library({ searchParams }: { searchParams: PageProps<"/dashboard/sds">["searchParams"] }) {
  const [{ clinic }, params] = await Promise.all([requireClinic(), searchParams]);
  const docs = await listSdsDocuments(clinic.id);
  const saved = params.saved === "1";
  const counts = {
    current: docs.filter((d) => d.status === "current").length,
    review: docs.filter((d) => d.status === "needs_review").length,
    failed: docs.filter((d) => d.status === "failed").length,
  };

  return (
    <>
      {saved ? (
        <div role="status" className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-100 bg-success-soft px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="size-4" />
          SDS confirmed and added to your library.
        </div>
      ) : null}

      <dl className="mt-6 grid grid-cols-3 gap-3 sm:max-w-xl">
        {[
          { label: "Current", value: counts.current, tone: "text-emerald-700" },
          { label: "Needs review", value: counts.review, tone: "text-amber-700" },
          { label: "Failed", value: counts.failed, tone: "text-red-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3">
            <dt className="text-xs text-slate-500">{s.label}</dt>
            <dd className={`font-heading text-2xl font-semibold tabular ${s.tone}`}>{s.value}</dd>
          </div>
        ))}
      </dl>

      {docs.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-sky-200 bg-white px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-primary">
            <FileSearch className="size-6" />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-slate-900">No SDSs yet</h2>
          <p className="mt-1.5 max-w-sm text-sm text-slate-600">
            Start with the products you use every day — surface disinfectants, sterilants and etchants.
          </p>
          <Button asChild size="xl" className="mt-6">
            <Link href={routes.sdsScan}>
              <ScanLine data-icon="inline-start" />
              Scan your first SDS
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50">
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-3 py-3 font-medium">Hazards</th>
                  <th className="px-3 py-3 font-medium">CAS</th>
                  <th className="px-3 py-3 font-medium">Revised</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="w-10 px-3 py-3"><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <LibraryRow key={d.id} doc={d} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

function LibraryRow({ doc }: { doc: SdsListItem }) {
  const href = `${routes.sdsLibrary}/${doc.id}`;
  return (
    <tr className="group border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
      <td className="px-5 py-3.5">
        <Link href={href} className="font-medium text-slate-900 group-hover:text-primary">
          {doc.product_name ?? "Untitled scan"}
        </Link>
        <p className="text-xs text-slate-500">
          {doc.manufacturer ?? "—"}
          {doc.document_type === "label" ? " · label only" : ""}
        </p>
      </td>
      <td className="px-3 py-3.5">
        <div className="flex items-center gap-0.5">
          {doc.pictograms.length ? (
            doc.pictograms.map((p) => <GhsDiamond key={p} code={p as GhsCode} />)
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
          {doc.signal_word ? (
            <span className={`ml-2 text-[11px] font-bold uppercase ${doc.signal_word === "Danger" ? "text-red-600" : "text-amber-600"}`}>
              {doc.signal_word}
            </span>
          ) : null}
        </div>
      </td>
      <td className="px-3 py-3.5 text-xs text-slate-600 tabular">{doc.cas_numbers.slice(0, 2).join(", ") || "—"}</td>
      <td className="px-3 py-3.5 text-xs text-slate-600 tabular">{formatDate(doc.revision_date)}</td>
      <td className="px-3 py-3.5">
        <SdsStatusBadge status={doc.status} />
      </td>
      <td className="px-3 py-3.5">
        <Link href={href} aria-label={`Open ${doc.product_name ?? "scan"}`}>
          <ChevronRight className="size-4 text-slate-400 group-hover:text-primary" />
        </Link>
      </td>
    </tr>
  );
}

function LibrarySkeleton() {
  return (
    <div aria-hidden="true" className="mt-6 animate-pulse space-y-3">
      <div className="h-20 max-w-xl rounded-2xl bg-slate-100" />
      <div className="h-72 rounded-2xl bg-slate-100" />
    </div>
  );
}
