import Link from "next/link";
import { ArrowRight, Clock3, QrCode, ShieldCheck, type LucideIcon } from "lucide-react";

import { ScanPhoneMockup } from "@/components/marketing/scan-phone-mockup";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ComplianceFlow } from "@/components/product/compliance-flow";
import { siteConfig } from "@/config/site";

const POINTS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Clock3,
    title: "About 30 seconds per SDS",
    body: "Snap a bottle or drop in the manufacturer's PDF. On Pro, we import your existing binder for you.",
  },
  {
    icon: ShieldCheck,
    title: "Nothing goes live unchecked",
    body: "Invalid CAS numbers, old revisions and low-confidence fields are flagged for your review first.",
  },
  {
    icon: QrCode,
    title: "One poster, always current",
    body: "Staff scan with any phone camera — no app, no login. New SDSs appear on it automatically.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="band-pearl scroll-mt-20 border-y border-slate-200/70">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
        <SectionHeading eyebrow="How it works" title="From supply closet to inspection-ready in one afternoon." />

        <ComplianceFlow className="mt-14" />

        <div className="mt-20 grid items-center gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="relative mx-auto w-60 sm:w-64">
            <div aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(2_132_199/0.10),transparent)] blur-2xl" />
            <ScanPhoneMockup />
          </div>
          <div>
            <ul className="space-y-7">
              {POINTS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm ring-1 ring-slate-200/80">
                    <Icon className="size-[18px]" />
                  </span>
                  <div>
                    <p className="font-heading text-lg font-semibold tracking-tight text-slate-900">{title}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-slate-500">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link
              href={siteConfig.links.startTrial}
              className="group mt-10 inline-flex items-center gap-2 text-[15px] font-semibold text-primary hover:text-primary-hover"
            >
              Scan your first SDS free
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
