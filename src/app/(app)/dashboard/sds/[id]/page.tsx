import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AlertTriangle, ArrowLeft, ExternalLink, Phone, ScanLine, Trash2, XCircle } from "lucide-react";

import { GhsDiamond } from "@/components/marketing/ghs-pictogram";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/site";
import { deleteSdsDocument } from "@/features/sds/actions";
import { SdsReviewForm } from "@/features/sds/components/review-form";
import { SdsStatusBadge } from "@/features/sds/components/status-badge";
import { getSdsDocument, getSourceUrl, type SdsDetail } from "@/features/sds/queries";
import type { GhsCode } from "@/features/sds/schema";
import { requirePlan } from "@/features/billing/server";

export const metadata: Metadata = { title: "Review SDS" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function SdsDetailPage({ params }: PageProps<"/dashboard/sds/[id]">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href={routes.sdsLibrary} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary">
        <ArrowLeft className="size-4" />
        SDS library
      </Link>
      <Suspense fallback={<DetailSkeleton />}>
        <Detail params={params} />
      </Suspense>
    </div>
  );
}

async function Detail({ params }: { params: PageProps<"/dashboard/sds/[id]">["params"] }) {
  const [{ id }, { clinic }] = await Promise.all([params, requirePlan()]);
  if (!UUID.test(id)) notFound();
  const doc = await getSdsDocument(id, clinic.id);
  if (!doc) notFound();
  const sourceUrl = await getSourceUrl(doc.source_path);
  const canEdit = clinic.role === "owner" || clinic.role === "admin";

  return (
    <>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <SdsStatusBadge status={doc.status} />
            {doc.document_type === "label" ? (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">Label only</span>
            ) : null}
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
            {doc.product_name ?? "Review scan"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {doc.manufacturer ?? "Manufacturer unknown"} · {doc.source_name ?? "Uploaded file"}
          </p>
        </div>
        {canEdit ? (
          <form action={deleteSdsDocument}>
            <input type="hidden" name="id" value={doc.id} />
            <Button type="submit" variant="ghost" size="lg" className="text-slate-500 hover:bg-red-50 hover:text-red-700">
              <Trash2 data-icon="inline-start" />
              Delete
            </Button>
          </form>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <SourcePreview url={sourceUrl} mime={doc.source_mime} name={doc.source_name} />

        <div className="space-y-6">
          {doc.status === "failed" || doc.status === "processing" ? (
            <FailedPanel doc={doc} />
          ) : (
            <>
              {doc.review_flags.length > 0 ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                    <AlertTriangle className="size-4" />
                    Check before confirming
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900/90">
                    {doc.review_flags.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50">
                <h2 className="text-base font-semibold text-slate-900">
                  {doc.status === "current" ? "Record details" : "Review extracted fields"}
                </h2>
                {doc.reviewed_at ? (
                  <p className="mt-0.5 text-xs text-slate-500">Confirmed {new Date(doc.reviewed_at).toLocaleDateString("en-US")}</p>
                ) : (
                  <p className="mt-0.5 text-xs text-slate-500">Compare with the document on the left, correct anything that&apos;s off, then confirm.</p>
                )}
                <div className="mt-5">
                  {canEdit ? (
                    <SdsReviewForm
                      defaults={{
                        id: doc.id,
                        product_name: doc.product_name,
                        manufacturer: doc.manufacturer,
                        emergency_phone: doc.emergency_phone,
                        revision_date: doc.revision_date,
                        signal_word: doc.signal_word,
                        pictograms: doc.pictograms,
                        cas_numbers: doc.cas_numbers,
                        confidence: doc.confidence,
                        isCurrent: doc.status === "current",
                      }}
                    />
                  ) : (
                    <p className="text-sm text-slate-600">Only owners and admins can edit this record.</p>
                  )}
                </div>
              </section>

              <ExtractedDetails doc={doc} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

function SourcePreview({ url, mime, name }: { url: string | null; mime: string; name: string | null }) {
  return (
    <div className="lg:sticky lg:top-6 lg:self-start">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <p className="truncate text-xs font-medium text-slate-600">{name ?? "Source document"}</p>
          {url ? (
            <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              Open
              <ExternalLink className="size-3" />
            </a>
          ) : null}
        </div>
        {!url ? (
          <p className="p-8 text-center text-sm text-slate-500">Preview unavailable.</p>
        ) : mime === "application/pdf" ? (
          <iframe src={url} title="SDS document" className="h-[70vh] w-full bg-slate-50" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL, not optimizable
          <img src={url} alt="Uploaded SDS or label" className="max-h-[70vh] w-full bg-slate-50 object-contain" />
        )}
      </div>
    </div>
  );
}

function FailedPanel({ doc }: { doc: SdsDetail }) {
  const failed = doc.status === "failed";
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50">
      <p className="flex items-center gap-2 text-base font-semibold text-slate-900">
        <XCircle className={failed ? "size-5 text-red-600" : "size-5 text-sky-600"} />
        {failed ? "This scan didn't complete" : "This scan is still processing"}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        {failed ? doc.error ?? "Something went wrong." : "Refresh in a moment. If it stays here, scan the document again."}
      </p>
      <Button asChild size="xl" className="mt-5">
        <Link href={routes.sdsScan}>
          <ScanLine data-icon="inline-start" />
          Scan again
        </Link>
      </Button>
    </div>
  );
}

function ExtractedDetails({ doc }: { doc: SdsDetail }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6">
      <h2 className="text-base font-semibold text-slate-900">From the document</h2>

      {doc.emergency_phone ? (
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
          <Phone className="size-4" />
          Emergency: {doc.emergency_phone}
        </p>
      ) : null}

      {doc.pictograms.length > 0 || doc.hazard_statements.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Hazards</h3>
          <div className="mt-2 flex gap-1">
            {doc.pictograms.map((p) => (
              <GhsDiamond key={p} code={p as GhsCode} className="size-8" />
            ))}
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
            {doc.hazard_statements.map((h, i) => (
              <li key={i} className="flex gap-2">
                {h.code ? <span className="shrink-0 font-semibold text-slate-900 tabular">{h.code}</span> : null}
                <span>{h.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {doc.ingredients.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Composition</h3>
          <div className="relative mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <tbody>
                {doc.ingredients.map((ing, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-2 pr-3 text-slate-800">{ing.name}</td>
                    <td className="py-2 pr-3 text-slate-600 tabular">{ing.cas_number ?? "—"}</td>
                    <td className="py-2 text-right text-slate-600">{ing.concentration ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {doc.ppe.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Protective equipment</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {doc.ppe.map((p) => (
              <li key={p} className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-sky-800 ring-1 ring-sky-100">
                {p}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {doc.sections.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Sections ({doc.sections.length}/16)
          </h3>
          <Accordion type="multiple" className="mt-1">
            {doc.sections.map((s) => (
              <AccordionItem key={s.number} value={String(s.number)} className="border-b border-slate-100">
                <AccordionTrigger className="py-3 text-left text-sm font-medium text-slate-800 hover:no-underline">
                  <span>
                    <span className="mr-2 text-slate-400 tabular">{s.number}.</span>
                    {s.title}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3 text-sm leading-relaxed text-slate-600">{s.summary}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : null}
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6 animate-pulse">
      <div className="h-8 w-72 rounded-md bg-slate-200/70" />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="h-[60vh] rounded-2xl bg-slate-100" />
        <div className="h-[60vh] rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}
