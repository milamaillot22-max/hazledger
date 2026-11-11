import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Landmark, LockKeyhole, ScanLine, ShieldCheck, Stethoscope } from "lucide-react";

import operatoryPhoto from "@/assets/images/clinic-dental-operatory.webp";
import { Eyebrow } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { OSHA_PENALTIES } from "@/config/compliance";
import { siteConfig } from "@/config/site";

const REASSURANCE = ["No credit card required", "Set up in minutes", "Cancel anytime"];

/** Every badge must stay literally true — see README "Claims policy". */
const BADGES = [
  { icon: ShieldCheck, label: "Built for OSHA HazCom", detail: "29 CFR 1910.1200" },
  { icon: LockKeyhole, label: "256-bit encryption", detail: "AES-256 at rest · TLS in transit" },
  { icon: Landmark, label: "US data hosting", detail: "Built for US healthcare" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-background"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-14 pb-20 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pb-28">
        <div>
          <Eyebrow>
            <Stethoscope className="size-3.5" />
            For US dental, veterinary &amp; medical practices
          </Eyebrow>

          <h1 className="mt-6 text-[2.5rem] leading-[1.08] font-semibold text-slate-900 sm:text-[3.4rem]">
            OSHA Compliance Isn&apos;t Optional.{" "}
            <span className="text-primary">Stay Inspection-Ready, Every Day.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            A single serious HazCom citation can reach ${OSHA_PENALTIES.seriousMax.toLocaleString("en-US")}. {siteConfig.name} keeps
            every Safety Data Sheet in your practice current, reviewed and one QR
            scan away for your team — so you have the answer the day OSHA walks in.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href={siteConfig.links.startTrial}>
                Start {siteConfig.trialDays}-Day Clinic Trial — Instant Access
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="w-full border-slate-200 bg-white text-slate-700 shadow-xs sm:w-auto"
            >
              <a href={siteConfig.links.bookDemo}>Book a 15-min demo</a>
            </Button>
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
              <li key={label} className="flex items-center gap-2.5 rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-slate-200/70">
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
    <div className="relative mx-auto w-full max-w-xl pb-10 lg:pb-0">
      <div className="relative aspect-[4/3.3] overflow-hidden rounded-3xl shadow-xl ring-1 shadow-slate-300/40 ring-slate-200/70">
        <Image
          src={operatoryPhoto}
          alt="Bright, modern dental operatory"
          fill
          priority
          placeholder="blur"
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent" />
      </div>

      {/* Floating: label scan result */}
      <div className="absolute top-5 right-3 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg ring-1 shadow-slate-300/40 ring-slate-200/70 backdrop-blur sm:-right-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-primary">
          <ScanLine className="size-[18px]" />
        </span>
        <div>
          <p className="text-xs font-semibold text-slate-900">Label scanned</p>
          <p className="text-[11px] text-slate-500">Glutaraldehyde 2.5% · 16/16 sections</p>
        </div>
      </div>

      {/* Floating: compliance status */}
      <div className="absolute bottom-0 left-3 w-[17rem] rounded-2xl bg-white p-4 shadow-xl ring-1 shadow-slate-300/40 ring-slate-200/70 sm:-left-6 lg:-bottom-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Sunset Family Dental</p>
          <CheckCircle2 className="size-4 text-success" />
        </div>
        <p className="text-xs text-slate-500">San Diego, CA</p>
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
