import type { Metadata } from "next";
import { ClipboardCheck, Clock3, QrCode, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { SectorMockup } from "@/components/product/sector-mockup";
import { SOLUTIONS } from "@/features/solutions/data";

export const metadata: Metadata = {
  robots: { index: false },
};

const BENEFITS = [
  { icon: Clock3, title: "Set up in minutes", body: "Create your clinic, print your team QR poster, scan your first SDS." },
  { icon: QrCode, title: "Instant access, every room", body: "Staff scan the poster with any phone. No app, no login." },
  { icon: ClipboardCheck, title: "Reviewed, always", body: "Nothing reaches your team until you confirm it." },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Form side */}
      <div className="flex flex-col px-4 py-8 sm:px-10">
        <Logo />
        <div className="flex flex-1 flex-col items-center justify-center py-10">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-10">
            {children}
          </div>
          <p className="mt-6 flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="size-3.5 text-success" />
            Encrypted · Hosted in the US · No credit card required
          </p>
        </div>
      </div>

      {/* Product panel */}
      <aside className="band-pearl relative hidden overflow-hidden border-l border-slate-200/70 lg:flex lg:flex-col lg:justify-center">
        <div aria-hidden="true" className="bg-aurora pointer-events-none absolute inset-0" />
        <div className="relative mx-auto w-full max-w-lg px-12 py-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <ShieldCheck className="size-3.5" />
            OSHA HazCom · 29 CFR 1910.1200
          </p>
          <h2 className="mt-5 font-heading text-[2.4rem] leading-[1.08] font-semibold tracking-[-0.035em] text-slate-900">
            Your SDS library, <span className="text-gradient-brand">inspection-ready.</span>
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
            The simplest way for dental, veterinary and medical practices to keep Safety Data Sheets current and in
            every employee&apos;s reach.
          </p>

          <SectorMockup solution={SOLUTIONS[0]} className="mt-10 mb-12" />

          <ul className="space-y-5">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-primary ring-1 ring-slate-200/80">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-slate-900">{title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
