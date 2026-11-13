import type { Metadata } from "next";
import { Suspense } from "react";
import { MapPin, Phone, QrCode, ShieldAlert } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { POISON_HELP_LINE, siteConfig } from "@/config/site";
import { stateName } from "@/features/clinics/constants";
import { PublicLibrary } from "@/features/team-access/components/public-library";
import { getPublicSafetyLibrary } from "@/features/team-access/queries";
import { hasAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Safety Data Sheets",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

/** Login-free staff view opened by the team QR poster. */
export default function PublicSafetyPage({ params }: PageProps<"/c/[token]">) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto max-w-2xl px-4 pt-6 pb-16">
        <Suspense fallback={<PageSkeleton />}>
          <Library params={params} />
        </Suspense>
        <footer className="mt-12 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <LogoMark className="size-4" />
          {siteConfig.name} · OSHA HazCom 29 CFR 1910.1200
        </footer>
      </div>
    </div>
  );
}

async function Library({ params }: { params: PageProps<"/c/[token]">["params"] }) {
  const { token } = await params;
  const library = await getPublicSafetyLibrary(token);

  if (!library) {
    return (
      <div className="mt-16 rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-lg shadow-slate-200/50">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
          <QrCode className="size-6" />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-slate-900">This QR code is no longer active</h1>
        <p className="mt-1.5 text-sm text-slate-600">Ask your practice manager for the current poster.</p>
        <EmergencyCard className="mt-6 text-left" />
      </div>
    );
  }

  if (library.suspended) {
    return (
      <div className="mt-16 rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-lg shadow-slate-200/50">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <QrCode className="size-6" />
        </span>
        <p className="mt-4 text-sm font-medium text-slate-500">{library.clinic.name}</p>
        <h1 className="mt-1 text-lg font-semibold text-slate-900">Access to this SDS library is paused</h1>
        <p className="mt-1.5 text-sm text-slate-600">
          Ask your practice manager for the Safety Data Sheets. The manager can switch this poster back on from {siteConfig.name}.
        </p>
        <EmergencyCard className="mt-6 text-left" />
      </div>
    );
  }

  return (
    <>
      <header>
        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPin className="size-3.5" />
          {stateName(library.clinic.state)}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">{library.clinic.name}</h1>
        <p className="text-[15px] text-slate-600">Safety Data Sheets &amp; emergency procedures</p>
      </header>

      <EmergencyCard className="mt-5" />

      <div className="mt-6">
        {library.documents.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
            No Safety Data Sheets have been published yet. Ask your practice manager.
          </p>
        ) : (
          <PublicLibrary token={token} documents={library.documents} canOpenFiles={hasAdminClient()} />
        )}
      </div>
    </>
  );
}

function EmergencyCard({ className }: { className?: string }) {
  return (
    <div className={`rounded-2xl border border-red-100 bg-red-50 p-4 ${className ?? ""}`}>
      <p className="flex items-center gap-2 text-sm font-semibold text-red-800">
        <ShieldAlert className="size-4" />
        In an emergency
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a href="tel:911" className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-3 text-sm font-semibold text-white shadow-sm">
          <Phone className="size-4" />
          Call 911
        </a>
        <a href={`tel:${POISON_HELP_LINE.tel}`} className="flex flex-col items-center justify-center rounded-xl bg-white px-3 py-2 text-red-800 ring-1 ring-red-200">
          <span className="text-[11px] font-medium">Poison Help</span>
          <span className="text-sm font-semibold tabular">{POISON_HELP_LINE.display}</span>
        </a>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="h-4 w-24 rounded bg-slate-200/70" />
      <div className="mt-2 h-7 w-56 rounded bg-slate-200/70" />
      <div className="mt-5 h-28 rounded-2xl bg-red-50" />
      <div className="mt-6 h-13 rounded-2xl bg-slate-100" />
      <div className="mt-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
