import type { Metadata } from "next";
import { Suspense } from "react";
import { Check, CheckCircle2, ChevronRight, Printer, ScanLine } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { routes } from "@/config/site";
import { getBillingState } from "@/features/billing/server";
import { listSdsDocuments } from "@/features/sds/queries";
import {
  practiceTypeLabel,
  stateName,
} from "@/features/clinics/constants";
import { requireClinic } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const { clinic } = await requireClinic();
  const [docs, billing] = await Promise.all([listSdsDocuments(clinic.id), getBillingState(clinic.id)]);
  const e = billing.entitlement;
  const current = docs.filter((d) => d.status === "current").length;
  const toReview = docs.filter((d) => d.status === "needs_review").length;
  const SETUP_STEPS = [
    { title: "Create your clinic", body: "Done — you're the owner.", icon: Check, done: true, href: null },
    {
      title: "Print your team QR poster",
      body: "Staff scan it for SDSs and emergency steps.",
      icon: Printer,
      done: Boolean(clinic.qrPosterPrintedAt),
      href: routes.teamAccessPrint,
    },
    { title: "Scan your first SDS", body: "Photo of a label or the PDF.", icon: ScanLine, done: docs.length > 0, href: routes.sdsScan },
    {
      title: "Confirm it for your team",
      body: "Reviewed SDSs go live on the poster.",
      icon: CheckCircle2,
      done: current > 0,
      href: toReview > 0 ? routes.sdsLibrary : routes.sdsScan,
    },
  ];
  const done = SETUP_STEPS.filter((s) => s.done).length;

  return (
    <>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {practiceTypeLabel(clinic.practiceType)} · {stateName(clinic.state)}
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">{clinic.name}</h1>
      </div>
      {e.kind === "trial" || e.kind === "expired" || e.kind === "past_due" ? (
        <div
          className={`mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-sm ${
            e.kind === "trial" ? "border-sky-100 bg-brand-soft text-sky-900" : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <p className="font-medium">
            {e.kind === "trial"
              ? `Free trial: ${e.daysLeft} ${e.daysLeft === 1 ? "day" : "days"} left — everything included, no card needed yet.`
              : e.kind === "expired"
                ? "Your free trial has ended. Choose a plan to keep adding SDSs — team QR access stays on."
                : "Your last payment didn't go through. Update your card to keep adding SDSs."}
          </p>
          <Link href={routes.billing} className="font-semibold underline underline-offset-2">
            {e.kind === "past_due" ? "Update payment" : "See plans"}
          </Link>
        </div>
      ) : null}

      <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Get audit-ready</h2>
            <p className="text-sm text-muted-foreground">
              {done} of {SETUP_STEPS.length} steps complete
            </p>
          </div>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${(done / SETUP_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
        <ol className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {SETUP_STEPS.map(({ title, body, icon: Icon, done: isDone, href }) => (
            <li key={title} className="group relative flex gap-3 p-5 transition-colors has-[a]:hover:bg-slate-50/80">
              <span
                className={
                  isDone
                    ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-success text-white"
                    : "flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-primary"
                }
              >
                <Icon className="size-4" />
              </span>
              <div>
                <p className={isDone ? "text-sm font-medium text-slate-400 line-through" : "text-sm font-medium text-foreground"}>
                  {title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
                {href && !isDone ? (
                  <Link href={href} className="mt-2 inline-flex items-center gap-0.5 text-xs font-semibold text-primary after:absolute after:inset-0">
                    Start
                    <ChevronRight className="size-3.5" />
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {docs.length === 0 ? (
        <section className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-sky-200 bg-white px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft">
            <ScanLine className="size-6 text-primary" />
          </span>
          <h2 className="mt-5 text-lg font-semibold text-foreground">Your SDS library is empty</h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
            Scan your first Safety Data Sheet — we&apos;ll extract all 16 sections
            automatically.
          </p>
          <Button asChild size="xl" className="mt-6">
            <Link href={routes.sdsScan}>
              <ScanLine data-icon="inline-start" />
              Scan an SDS
            </Link>
          </Button>
        </section>
      ) : (
        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "SDSs current", value: current, tone: "text-emerald-700" },
            { label: "Waiting for your review", value: toReview, tone: "text-amber-700" },
            { label: "Total scanned", value: docs.length, tone: "text-slate-900" },
          ].map((s) => (
            <Link
              key={s.label}
              href={routes.sdsLibrary}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-200/50 transition-shadow hover:shadow-xl"
            >
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className={`mt-1 font-heading text-3xl font-semibold tabular ${s.tone}`}>{s.value}</p>
            </Link>
          ))}
        </section>
      )}
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="h-4 w-40 rounded bg-slate-200/60" />
      <div className="mt-3 h-8 w-64 rounded-md bg-slate-200/70" />
      <div className="mt-8 h-40 rounded-xl bg-slate-200/50" />
      <div className="mt-6 h-64 rounded-xl bg-slate-200/40" />
    </div>
  );
}
