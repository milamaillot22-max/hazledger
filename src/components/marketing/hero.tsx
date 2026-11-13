import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Landmark, LockKeyhole, ScanLine, ShieldCheck } from "lucide-react";

import heroPhoto from "@/assets/images/fullbleed-clinic.webp";
import { Magnetic } from "@/components/fx/magnetic";
import { OSHA_PENALTIES } from "@/config/compliance";
import { routes, siteConfig } from "@/config/site";

const REASSURANCE = ["$0 for 14 days", "Set up in minutes", "Cancel anytime"];

/** Every badge must stay literally true — see README "Claims policy". */
const BADGES = [
  { icon: ShieldCheck, label: "Built for OSHA HazCom", detail: "29 CFR 1910.1200" },
  { icon: LockKeyhole, label: "256-bit encryption", detail: "AES-256 at rest · TLS in transit" },
  { icon: Landmark, label: "US data hosting", detail: "Built for US healthcare" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      <Image
        src={heroPhoto}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover object-[70%_50%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/60 lg:via-slate-950/60 lg:to-slate-950/15" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-slate-950/50 to-transparent" />

      <div className="mx-auto grid min-h-[620px] max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:min-h-[680px] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <Link
            href={routes.blogPost("hazcom-2024-compliance-deadlines")}
            className="group inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pr-3 pl-1 text-xs text-white/85 ring-1 ring-white/20 backdrop-blur transition-colors hover:bg-white/15"
          >
            <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 font-semibold text-emerald-200">New</span>
            For US dental, veterinary &amp; medical practices
            <ArrowRight className="size-3 text-white/60 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1 className="mt-7 font-heading text-[2.6rem] leading-[1.03] font-semibold tracking-[-0.04em] text-white sm:text-[4rem]">
            OSHA Compliance Isn&apos;t Optional.{" "}
            <span className="bg-gradient-to-r from-sky-300 via-sky-200 to-emerald-300 bg-clip-text text-transparent">
              Stay Inspection-Ready, Every Day.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            A single serious HazCom citation can reach ${OSHA_PENALTIES.seriousMax.toLocaleString("en-US")}.{" "}
            {siteConfig.name} keeps every Safety Data Sheet in your practice current, reviewed and one QR scan away for
            your team — so you have the answer the day OSHA walks in.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href={siteConfig.links.startTrial}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white shadow-[0_10px_30px_-8px_rgb(2_132_199/0.7)] transition-all duration-200 hover:bg-primary-hover sm:w-auto"
              >
                Start {siteConfig.trialDays}-Day Clinic Trial — Instant Access
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Link
              href={routes.pricing}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white/10 px-6 text-[15px] font-medium text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-white/20 sm:w-auto"
            >
              See pricing
            </Link>
          </div>

          <ul className="mt-5 flex flex-col gap-x-6 gap-y-2 text-sm text-white/80 sm:flex-row sm:flex-wrap">
            {REASSURANCE.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-300" />
                {item}
              </li>
            ))}
          </ul>

          <ul aria-label="Compliance and security" className="mt-10 grid gap-2.5 border-t border-white/15 pt-6 sm:grid-cols-3">
            {BADGES.map(({ icon: Icon, label, detail }) => (
              <li key={label} className="lift flex items-center gap-2.5 rounded-xl bg-white/10 px-3 py-2.5 ring-1 ring-white/15 backdrop-blur">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-200">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-white">{label}</span>
                  <span className="block text-[11px] leading-snug text-white/65">{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <HeroCards />
      </div>
    </section>
  );
}

/** Product proof floating over the photo (illustrative example clinic). */
function HeroCards() {
  return (
    <div className="relative hidden h-full min-h-[360px] lg:block">
      <div className="lift absolute top-[12%] right-0 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-2xl ring-1 shadow-slate-950/30 ring-white/60 backdrop-blur motion-safe:animate-[float-y_7s_ease-in-out_infinite]">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-primary">
          <ScanLine className="size-[18px]" />
        </span>
        <div>
          <p className="text-xs font-semibold text-slate-900">Label scanned</p>
          <p className="text-[11px] text-slate-500">Glutaraldehyde 2.5% · 16/16 sections</p>
        </div>
      </div>

      <div className="lift absolute right-6 bottom-[8%] w-[17rem] rounded-2xl bg-white p-4 shadow-2xl ring-1 shadow-slate-950/30 ring-white/60">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Sunset Family Dental</p>
          <CheckCircle2 className="size-4 text-success" />
        </div>
        <p className="text-xs text-slate-500">Example clinic · San Diego, CA</p>
        <div className="mt-3 flex items-end justify-between">
          <span className="font-heading text-2xl font-semibold text-emerald-700 tabular">100%</span>
          <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
            Inspection-ready
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-full rounded-full bg-success" />
        </div>
        <p className="mt-2 text-[11px] text-slate-500">86 SDSs current · 6 rooms with QR access</p>
      </div>
    </div>
  );
}

