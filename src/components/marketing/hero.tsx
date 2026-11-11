import Link from "next/link";
import { ArrowRight, CheckCircle2, Landmark, LockKeyhole, ShieldCheck } from "lucide-react";

import { Magnetic } from "@/components/fx/magnetic";
import { AppMockup } from "@/components/product/app-mockup";
import { OSHA_PENALTIES } from "@/config/compliance";
import { routes, siteConfig } from "@/config/site";

const REASSURANCE = ["No credit card required", "Set up in minutes", "Cancel anytime"];

/** Every badge must stay literally true — see README "Claims policy". */
const BADGES = [
  { icon: ShieldCheck, label: "Built for OSHA HazCom", detail: "29 CFR 1910.1200" },
  { icon: LockKeyhole, label: "256-bit encryption", detail: "AES-256 at rest · TLS in transit" },
  { icon: Landmark, label: "US data hosting", detail: "Built for US healthcare" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div aria-hidden="true" className="bg-aurora pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-24 sm:px-6 sm:pt-28 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href={routes.blogPost("hazcom-2024-compliance-deadlines")}
            className="group inline-flex items-center gap-2 rounded-full bg-white py-1 pr-3 pl-1 text-xs text-slate-600 shadow-sm ring-1 ring-slate-200/80 transition-colors hover:ring-slate-300"
          >
            <span className="rounded-full bg-success-soft px-2 py-0.5 font-semibold text-emerald-700">New</span>
            For US dental, veterinary &amp; medical practices
            <ArrowRight className="size-3 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1 className="mt-8 font-heading text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.04em] text-slate-900 sm:text-[4.2rem]">
            OSHA Compliance Isn&apos;t Optional.{" "}
            <span className="text-gradient-brand">Stay Inspection-Ready, Every Day.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
            A single serious HazCom citation can reach ${OSHA_PENALTIES.seriousMax.toLocaleString("en-US")}.{" "}
            {siteConfig.name} keeps every Safety Data Sheet in your practice current, reviewed and one QR scan away for
            your team.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href={siteConfig.links.startTrial}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgb(2_132_199/0.2),0_8px_24px_-8px_rgb(2_132_199/0.45)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_0_4px_rgb(2_132_199/0.12),0_12px_28px_-8px_rgb(2_132_199/0.5)] sm:w-auto"
              >
                Start {siteConfig.trialDays}-Day Clinic Trial — Instant Access
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Link
              href={routes.pricing}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-6 text-[15px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
            >
              Compare plans
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            {REASSURANCE.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <AppMockup className="mx-auto mt-16 max-w-5xl" />

        <ul aria-label="Compliance and security" className="mx-auto mt-20 grid max-w-4xl gap-3 sm:grid-cols-3">
          {BADGES.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="card-soft flex items-center gap-3 rounded-2xl px-4 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success ring-1 ring-emerald-100">
                <Icon className="size-4" />
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-slate-900">{label}</span>
                <span className="block text-xs leading-snug text-slate-500">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
