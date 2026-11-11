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
    <section className="surface-night bg-grain overflow-hidden">
      <div aria-hidden="true" className="grid-night pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <Link
            href={routes.blogPost("hazcom-2024-compliance-deadlines")}
            className="group inline-flex items-center gap-2 rounded-full bg-white/[0.04] py-1 pr-3 pl-1 text-xs text-slate-300 ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]"
          >
            <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 font-semibold text-emerald-300">New</span>
            For US dental, veterinary &amp; medical practices
            <ArrowRight className="size-3 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1 className="mt-7 font-heading text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.04em] text-white sm:text-[4.2rem]">
            OSHA Compliance Isn&apos;t Optional.{" "}
            <span className="text-gradient-brand">Stay Inspection-Ready, Every Day.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            A single serious HazCom citation can reach ${OSHA_PENALTIES.seriousMax.toLocaleString("en-US")}.{" "}
            {siteConfig.name} keeps every Safety Data Sheet in your practice current, reviewed and one QR scan away for
            your team.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href={siteConfig.links.startTrial}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-night shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_10px_30px_-10px_rgb(56_189_248/0.6)] transition-all duration-200 hover:bg-sky-50 hover:shadow-[0_0_0_4px_rgb(56_189_248/0.18),0_16px_40px_-12px_rgb(56_189_248/0.7)] sm:w-auto"
              >
                Start {siteConfig.trialDays}-Day Clinic Trial — Instant Access
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Link
              href={routes.pricing}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl px-6 text-[15px] font-medium text-slate-200 ring-1 ring-white/15 transition-colors hover:bg-white/[0.05] hover:text-white sm:w-auto"
            >
              Compare plans
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400">
            {REASSURANCE.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-16 max-w-5xl [perspective:2000px]">
          <AppMockup className="motion-safe:transition-transform motion-safe:duration-700 lg:[transform:rotateX(6deg)] lg:hover:[transform:rotateX(0deg)]" />
        </div>

        <ul aria-label="Compliance and security" className="mx-auto mt-20 grid max-w-4xl gap-3 sm:grid-cols-3">
          {BADGES.map(({ icon: Icon, label, detail }) => (
            <li key={label} className="glass-night flex items-center gap-3 rounded-2xl px-4 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20">
                <Icon className="size-4" />
              </span>
              <span>
                <span className="block text-[13px] font-semibold text-white">{label}</span>
                <span className="block text-xs leading-snug text-slate-400">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
