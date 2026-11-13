import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Camera, FileText, Tag } from "lucide-react";

import { routes } from "@/config/site";
import { canAddSds } from "@/features/billing/entitlement";
import { requirePlan } from "@/features/billing/server";
import { SdsUploader } from "@/features/sds/components/sds-uploader";

export const metadata: Metadata = { title: "Scan an SDS" };

/** Server Actions on this page run the AI extraction (PDFs can take ~60s). */
export const maxDuration = 120;

const TIPS = [
  { icon: FileText, title: "Best: the manufacturer's PDF", body: "Download the SDS from the supplier's website or order portal for a complete 16-section record." },
  { icon: Camera, title: "Photos work too", body: "Lay the page flat in good light, with every edge and all text in the frame." },
  { icon: Tag, title: "Only have the bottle?", body: "Snap the label. We'll capture the hazards and remind you to get the full SDS." },
];

export default function ScanPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link href={routes.sdsLibrary} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary">
        <ArrowLeft className="size-4" />
        SDS library
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900 sm:text-3xl">Scan a Safety Data Sheet</h1>
      <p className="mt-2 max-w-2xl text-[15px] text-slate-600">
        Upload a PDF or take a photo. We extract the product, hazards, CAS numbers and all 16 sections —
        you review everything before it goes live in your library.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-slate-100" />}>
          <UploaderGate />
        </Suspense>
        <aside className="rounded-2xl border border-slate-200/80 bg-white p-6">
          <h2 className="text-sm font-semibold text-slate-900">For the best results</h2>
          <ul className="mt-4 space-y-4">
            {TIPS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">{title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

async function UploaderGate() {
  const { clinic, billing } = await requirePlan();
  if (clinic.role !== "owner" && clinic.role !== "admin") {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-sm text-slate-600">
        Only clinic owners and admins can add SDSs. Ask your practice manager for access.
      </div>
    );
  }
  const check = canAddSds(billing.entitlement, billing.usage);
  if (!check.allowed) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-8">
        <p className="text-[15px] font-semibold text-amber-900">New scans are paused</p>
        <p className="mt-1.5 text-sm leading-relaxed text-amber-900/80">{check.message}</p>
        <Link
          href={routes.billing}
          className="mt-5 inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          See plans
        </Link>
      </div>
    );
  }
  return <SdsUploader clinicId={clinic.id} />;
}
