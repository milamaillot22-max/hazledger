import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";

import { routes } from "@/config/site";
import { PrintButton } from "@/features/team-access/components/print-button";
import { PrintDurabilityTips } from "@/features/team-access/components/print-durability-tips";
import { QrPoster } from "@/features/team-access/components/qr-poster";
import { getTeamAccess, renderQrSvg } from "@/features/team-access/queries";
import { requirePlan } from "@/features/billing/server";

export const metadata: Metadata = { title: "Print team QR poster" };

export default function PrintPosterPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 print:max-w-none print:p-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={routes.teamAccess} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary">
          <ArrowLeft className="size-4" />
          Team QR access
        </Link>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs text-slate-500 sm:block">US Letter · portrait · “Background graphics” on</p>
          <PrintButton />
        </div>
      </div>
      <PrintDurabilityTips className="mb-6 print:hidden" />
      <Suspense fallback={<div className="aspect-[8.5/11] animate-pulse rounded-2xl bg-slate-100" />}>
        <Poster />
      </Suspense>
    </div>
  );
}

async function Poster() {
  const { clinic } = await requirePlan();
  const access = await getTeamAccess(clinic.id);
  const svg = await renderQrSvg(access.url);
  return <QrPoster clinicName={clinic.name} qrSvg={svg} url={access.url} />;
}
