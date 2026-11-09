import type { Metadata } from "next";
import { Suspense } from "react";
import { Check, QrCode, ScanLine, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
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

const SETUP_STEPS = [
  { title: "Create your clinic", body: "Done — you're the owner.", icon: Check, done: true },
  { title: "Scan your first SDS", body: "Photo, PDF or supplier email.", icon: ScanLine, done: false },
  { title: "Post a QR code", body: "One per operatory, lab or supply room.", icon: QrCode, done: false },
  { title: "Invite your team", body: "Office manager, hygienists, techs.", icon: UserPlus, done: false },
];

async function DashboardContent() {
  const { clinic } = await requireClinic();
  const done = SETUP_STEPS.filter((s) => s.done).length;

  return (
    <>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">
          {practiceTypeLabel(clinic.practiceType)} · {stateName(clinic.state)}
        </p>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{clinic.name}</h1>
      </div>

      <section className="mt-8 rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Get audit-ready</h2>
            <p className="text-sm text-muted-foreground">
              {done} of {SETUP_STEPS.length} steps complete
            </p>
          </div>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(done / SETUP_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
        <ol className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {SETUP_STEPS.map(({ title, body, icon: Icon, done: isDone }) => (
            <li key={title} className="flex gap-3 p-5">
              <span
                className={
                  isDone
                    ? "flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : "flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-slate-500"
                }
              >
                <Icon className="size-4" />
              </span>
              <div>
                <p className={isDone ? "text-sm font-medium text-slate-400 line-through" : "text-sm font-medium text-foreground"}>
                  {title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-card/50 px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-brand-soft">
          <ScanLine className="size-6 text-primary" />
        </span>
        <h2 className="mt-5 text-lg font-semibold text-foreground">Your SDS library is empty</h2>
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
          Scan your first Safety Data Sheet — we&apos;ll extract all 16 sections
          automatically.
        </p>
        <Button size="xl" className="mt-6" disabled>
          <ScanLine data-icon="inline-start" />
          Scan an SDS
        </Button>
        <p className="mt-2 text-xs text-slate-400">Scanner ships in the next release</p>
      </section>
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
