import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AlertTriangle, CheckCircle2, ExternalLink, Printer, QrCode, ShieldCheck, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { routes } from "@/config/site";
import { listSdsDocuments } from "@/features/sds/queries";
import { CopyLinkButton } from "@/features/team-access/components/copy-link-button";
import { RotateTokenButton } from "@/features/team-access/components/rotate-button";
import { getTeamAccess, renderQrSvg } from "@/features/team-access/queries";
import { requirePlan } from "@/features/billing/server";

export const metadata: Metadata = { title: "Team QR access" };

export default function TeamAccessPage({ searchParams }: PageProps<"/dashboard/team-access">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Team QR access</h1>
      <p className="mt-1 max-w-2xl text-[15px] text-slate-600">
        One code for the whole team. Staff scan it with their phone camera to open your Safety Data Sheets and
        emergency procedures — no app, no login, on every shift.
      </p>
      <Suspense fallback={<div className="mt-8 h-96 animate-pulse rounded-2xl bg-slate-100" />}>
        <TeamAccess searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function TeamAccess({ searchParams }: { searchParams: PageProps<"/dashboard/team-access">["searchParams"] }) {
  const [{ clinic, billing }, params] = await Promise.all([requirePlan(), searchParams]);
  const [access, docs] = await Promise.all([getTeamAccess(clinic.id), listSdsDocuments(clinic.id)]);
  const svg = await renderQrSvg(access.url);
  const visible = docs.filter((d) => d.status === "current").length;
  const pending = docs.filter((d) => d.status === "needs_review").length;
  const canManage = clinic.role === "owner" || clinic.role === "admin";
  const e = billing.entitlement;

  return (
    <>
      {e.kind === "ended" ? (
        <div role="alert" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <p className="font-medium">
            {e.qrLive && e.qrUntil
              ? `Your subscription has ended. This QR code stops working on ${e.qrUntil.toLocaleDateString("en-US", { month: "long", day: "numeric" })}.`
              : "This QR code is paused: your team sees “access paused” when they scan it."}
          </p>
          <Link href={routes.billing} className="font-semibold underline underline-offset-2">
            Choose a plan
          </Link>
        </div>
      ) : null}

      {params.welcome === "1" ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-6 shadow-lg shadow-slate-200/50">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="size-4" />
            {clinic.name} is set up
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Last step: print your team QR poster.</h2>
          <p className="mt-1 max-w-2xl text-[15px] text-slate-600">
            Hang it in the sterilization area or break room. You print it once — every SDS you scan and confirm
            appears on it automatically.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild size="xl">
              <Link href={routes.teamAccessPrint}>
                <Printer data-icon="inline-start" />
                Print my poster
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-slate-200 bg-white text-slate-700">
              <Link href={routes.sdsScan}>Scan my first SDS</Link>
            </Button>
          </div>
        </div>
      ) : null}

      {params.rotated === "1" ? (
        <div role="status" className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-100 bg-success-soft px-4 py-3 text-sm font-medium text-emerald-800">
          <CheckCircle2 className="size-4" />
          New QR code issued. Print and replace your posters — the old ones no longer work.
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* QR card */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
          <div className="mx-auto max-w-xs rounded-2xl border border-slate-100 bg-white p-5 text-center">
            <p className="text-sm font-semibold text-slate-900">{clinic.name}</p>
            <div
              className="mx-auto mt-4 w-full max-w-[240px] [&>svg]:h-auto [&>svg]:w-full"
              role="img"
              aria-label={`QR code linking to ${access.url}`}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
            <p className="mt-4 text-xs text-slate-500">Scan for Safety Data Sheets &amp; emergency procedures</p>
          </div>

          <div className="mt-6">
            <label htmlFor="access-url" className="text-xs font-medium text-slate-500">Team link</label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="access-url"
                readOnly
                value={access.url}
                className="h-9 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 tabular outline-none"
              />
              <CopyLinkButton url={access.url} />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl" className="flex-1">
              <Link href={routes.teamAccessPrint}>
                <Printer data-icon="inline-start" />
                Print poster
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="flex-1 border-slate-200 bg-white text-slate-700">
              <a href={access.url} target="_blank" rel="noreferrer">
                <ExternalLink data-icon="inline-start" />
                Preview staff view
              </a>
            </Button>
          </div>
        </section>

        <div className="space-y-6">
          {access.isLocalUrl ? (
            <Warning title="Development link">
              This QR points to {new URL(access.url).host}. Set <code className="font-semibold">NEXT_PUBLIC_SITE_URL</code> to your
              production domain before printing posters.
            </Warning>
          ) : null}
          {visible === 0 ? (
            <Warning title="Nothing to show yet">
              Staff only see SDSs you&apos;ve confirmed. {pending > 0 ? `${pending} scan${pending === 1 ? " is" : "s are"} waiting for your review.` : "Scan your first SDS to get started."}{" "}
              <Link href={pending > 0 ? routes.sdsLibrary : routes.sdsScan} className="font-semibold underline-offset-4 hover:underline">
                {pending > 0 ? "Review now" : "Scan an SDS"}
              </Link>
            </Warning>
          ) : null}

          <section className="rounded-2xl border border-slate-200/80 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-900">What your team sees</h2>
              <span className="rounded-full bg-success-soft px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 tabular">
                {visible} SDS{visible === 1 ? "" : "s"} live
              </span>
            </div>
            <ul className="mt-4 space-y-4">
              {[
                { icon: Smartphone, title: "Any phone camera", body: "No app to install and no account — exactly what OSHA's “no barriers to access” rule asks for." },
                { icon: ShieldCheck, title: "Only confirmed, current SDSs", body: "First aid, spills, handling and PPE come first. Scans waiting for review are never shown." },
                { icon: QrCode, title: "Always up to date", body: "The poster never changes: new or updated SDSs appear automatically." },
              ].map(({ icon: Icon, title, body }) => (
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
          </section>

          {canManage ? (
            <section className="rounded-2xl border border-red-100 bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">Lost or shared a poster?</h2>
              <p className="mt-1 text-sm text-slate-600">
                Regenerating issues a new code and immediately disables the old one.
                {access.rotatedAt ? ` Last regenerated ${new Date(access.rotatedAt).toLocaleDateString("en-US")}.` : ""}
              </p>
              <div className="mt-4">
                <RotateTokenButton />
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </>
  );
}

function Warning({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-sm text-amber-900">
      <p className="flex items-center gap-2 font-semibold text-amber-800">
        <AlertTriangle className="size-4" />
        {title}
      </p>
      <p className="mt-1.5 leading-relaxed">{children}</p>
    </div>
  );
}
