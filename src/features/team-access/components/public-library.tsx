"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ExternalLink, FileText, Phone, Search } from "lucide-react";

import { GhsDiamond } from "@/components/marketing/ghs-pictogram";
import type { GhsCode } from "@/features/sds/schema";
import type { PublicSdsDocument } from "@/features/team-access/queries";
import { cn } from "@/lib/utils";

const SECTION_ORDER = [4, 6, 8, 7, 5]; // first aid first: it's what people open this for

export function PublicLibrary({
  token,
  documents,
  canOpenFiles,
}: {
  token: string;
  documents: PublicSdsDocument[];
  canOpenFiles: boolean;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter((d) =>
      [d.product_name, d.manufacturer].some((v) => v?.toLowerCase().includes(q))
    );
  }, [documents, query]);

  return (
    <div>
      <label className="relative block">
        <span className="sr-only">Search products</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a product or manufacturer"
          className="h-13 w-full rounded-2xl border border-slate-200 bg-white pr-4 pl-12 text-base shadow-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-sky-100"
        />
      </label>
      <p className="mt-3 text-sm text-slate-500">
        {filtered.length} of {documents.length} product{documents.length === 1 ? "" : "s"}
      </p>

      <ul className="mt-3 space-y-3">
        {filtered.map((doc) => (
          <li key={doc.id}>
            <details className="group rounded-2xl border border-slate-200/80 bg-white shadow-sm open:shadow-lg open:shadow-slate-200/60">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">{doc.product_name ?? "Unnamed product"}</p>
                  <p className="truncate text-sm text-slate-500">{doc.manufacturer ?? "—"}</p>
                  <div className="mt-2 flex items-center gap-1">
                    {doc.pictograms.map((p) => (
                      <GhsDiamond key={p} code={p as GhsCode} className="size-6" />
                    ))}
                    {doc.signal_word ? (
                      <span
                        className={cn(
                          "ml-1 text-xs font-bold uppercase",
                          doc.signal_word === "Danger" ? "text-red-600" : "text-amber-600"
                        )}
                      >
                        {doc.signal_word}
                      </span>
                    ) : null}
                  </div>
                </div>
                <ChevronDown className="size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>

              <div className="space-y-4 border-t border-slate-100 p-4">
                {doc.emergency_phone ? (
                  <a
                    href={`tel:${doc.emergency_phone.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-800"
                  >
                    <Phone className="size-4 shrink-0" />
                    <span>
                      Manufacturer emergency:{" "}
                      <span className="whitespace-nowrap tabular">{doc.emergency_phone}</span>
                    </span>
                  </a>
                ) : null}

                {SECTION_ORDER.map((n) => doc.sections.find((s) => s.number === n))
                  .filter((s): s is NonNullable<typeof s> => Boolean(s))
                  .map((s) => (
                    <div key={s.number}>
                      <p className={cn("text-sm font-semibold", s.number === 4 ? "text-red-700" : "text-slate-900")}>
                        {s.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-700">{s.summary}</p>
                    </div>
                  ))}

                {doc.ppe.length > 0 ? (
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Wear</p>
                    <ul className="mt-1.5 flex flex-wrap gap-1.5">
                      {doc.ppe.map((p) => (
                        <li key={p} className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-sky-800 ring-1 ring-sky-100">
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {doc.hazard_statements.length > 0 ? (
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Hazards</p>
                    <ul className="mt-1 space-y-1 text-sm text-slate-700">
                      {doc.hazard_statements.map((h, i) => (
                        <li key={i}>
                          {h.code ? <span className="mr-1.5 font-semibold tabular">{h.code}</span> : null}
                          {h.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {doc.document_type === "label" ? (
                  <p className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <FileText className="size-4" />
                    From the product label. Ask your manager for the full SDS.
                  </p>
                ) : canOpenFiles ? (
                  <a
                    href={`/c/${token}/sds/${doc.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                  >
                    Open the full Safety Data Sheet
                    <ExternalLink className="size-4" />
                  </a>
                ) : null}
              </div>
            </details>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && documents.length > 0 ? (
        <p className="mt-6 text-center text-sm text-slate-500">No product matches “{query}”.</p>
      ) : null}
    </div>
  );
}
