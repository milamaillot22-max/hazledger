import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Landmark, LockKeyhole, ScanLine, ShieldCheck } from "lucide-react";

import operatoryPhoto from "@/assets/images/clinic-dental-operatory.webp";
import dentalTeamPhoto from "@/assets/images/team-dental-xray.webp";
import { Magnetic } from "@/components/fx/magnetic";
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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-50/70 via-white to-white" />
      <div aria-hidden="true" className="bg-aurora pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="hero-fluid pointer-events-none absolute -inset-[10%]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:pb-28">
        <div>
          <Link
            href={routes.blogPost("hazcom-2024-compliance-deadlines")}
            className="group inline-flex items-center gap-2 rounded-full bg-white py-1 pr-3 pl-1 text-xs text-slate-600 shadow-sm ring-1 ring-slate-200/80 transition-colors hover:ring-slate-300"
          >
            <span className="rounded-full bg-success-soft px-2 py-0.5 font-semibold text-emerald-700">New</span>
            For US dental, veterinary &amp; medical practices
            <ArrowRight className="size-3 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1 className="mt-7 font-heading text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.04em] text-slate-900 sm:text-[3.5rem]">
            OSHA Compliance Isn&apos;t Optional.{" "}
            <span className="text-gradient-brand">Stay Inspection-Ready, Every Day.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            A single serious HazCom citation can reach ${OSHA_PENALTIES.seriousMax.toLocaleString("en-US")}.{" "}
            {siteConfig.name} keeps every Safety Data Sheet in your practice current, reviewed and one QR scan away for
            your team — so you have the answer the day OSHA walks in.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
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

          <ul className="mt-5 flex flex-col gap-x-6 gap-y-2 text-sm text-slate-600 sm:flex-row sm:flex-wrap">
            {REASSURANCE.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-success" />
                {item}
              </li>
            ))}
          </ul>

          <ul aria-label="Compliance and security" className="mt-8 grid gap-2.5 border-t border-slate-200/70 pt-6 sm:grid-cols-3">
            {BADGES.map(({ icon: Icon, label, detail }) => (
              <li key={label} className="lift flex items-center gap-2.5 rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-slate-200/70 backdrop-blur">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-slate-900">{label}</span>
                  <span className="block text-[11px] leading-snug text-slate-500">{detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl pb-14 sm:pb-10 lg:pb-0">
      {/* Geometry: echo arch, dot lattice and a fine ring — depth without noise */}
      <div
        aria-hidden="true"
        className="absolute top-[-3%] left-[6%] h-[88%] w-[66%] rounded-[50%_50%_2.5rem_2.5rem/38%_38%_2.5rem_2.5rem] border border-sky-300/50 bg-gradient-to-b from-sky-100/50 via-white/10 to-emerald-100/40"
      />
      <div aria-hidden="true" className="bg-dots absolute top-[6%] -right-3 size-36 sm:-right-8" />
      <div aria-hidden="true" className="absolute bottom-[14%] -left-4 size-24 rounded-full border border-emerald-300/50 sm:-left-10" />
      <div aria-hidden="true" className="absolute -bottom-2 left-[38%] h-px w-40 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

      {/* Main photo in an arch frame */}
      <div className="relative ml-auto aspect-[4/4.9] w-[80%] overflow-hidden rounded-[50%_50%_2.5rem_2.5rem/41%_41%_2.5rem_2.5rem] shadow-[0_40px_80px_-40px_rgb(15_23_42/0.45)] ring-1 ring-slate-200/70">
        <Image
          src={operatoryPhoto}
          alt="Bright, modern dental operatory"
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 460px, 80vw"
          className="object-cover object-[35%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent" />
      </div>

      {/* Secondary photo, layered asymmetrically over the arch */}
      <div className="lift absolute top-[30%] left-0 aspect-[4/5] w-[34%] overflow-hidden rounded-[1.75rem] shadow-[0_24px_48px_-24px_rgb(15_23_42/0.45)] ring-4 ring-white">
        <Image
          src={dentalTeamPhoto}
          alt="Dental team member reviewing an X-ray on a tablet with a patient"
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 200px, 34vw"
          className="object-cover object-[40%_50%]"
        />
      </div>

      {/* Floating: label scan result (illustrative) */}
      <div className="lift absolute top-[9%] right-0 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg ring-1 shadow-slate-300/40 ring-slate-200/70 backdrop-blur motion-safe:animate-[float-y_7s_ease-in-out_infinite] sm:-right-6">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-primary">
          <ScanLine className="size-[18px]" />
        </span>
        <div>
          <p className="text-xs font-semibold text-slate-900">Label scanned</p>
          <p className="text-[11px] text-slate-500">Glutaraldehyde 2.5% · 16/16 sections</p>
        </div>
      </div>

      {/* Floating: compliance status (illustrative example clinic) */}
      <div className="lift absolute right-2 -bottom-2 w-[16.5rem] rounded-2xl bg-white p-4 shadow-xl ring-1 shadow-slate-300/40 ring-slate-200/70 sm:-right-8 lg:-bottom-8">
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
