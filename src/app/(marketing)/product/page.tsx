import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, KeyRound, Landmark, LockKeyhole, RefreshCw, type LucideIcon } from "lucide-react";

import { Magnetic } from "@/components/fx/magnetic";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { Comparison } from "@/components/marketing/comparison";
import { Features } from "@/components/marketing/features";
import { FinalCta } from "@/components/marketing/final-cta";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ProductShowcase } from "@/components/marketing/product-showcase";
import { SectionHeading } from "@/components/marketing/section-heading";
import { AppMockup } from "@/components/product/app-mockup";
import { routes, siteConfig } from "@/config/site";
import { jsonLd, productStructuredData } from "@/lib/seo";

const DESCRIPTION =
  "How HazLedger works: AI extraction of Safety Data Sheets, human review with CAS validation, a login-free team QR poster, and US-hosted, encrypted storage.";

export const metadata: Metadata = {
  title: "Product — AI SDS management for clinics",
  description: DESCRIPTION,
  alternates: { canonical: routes.product },
  openGraph: { url: routes.product, title: `Product | ${siteConfig.name}`, description: DESCRIPTION, siteName: siteConfig.name, type: "website" },
};

/** Facts only: each line maps to how the system is actually built. */
const SECURITY: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Landmark, title: "Hosted in the US", body: "Database and file storage run in a US region (us-east-1)." },
  { icon: LockKeyhole, title: "Encrypted", body: "AES-256 encryption at rest and TLS in transit." },
  { icon: Database, title: "Isolated per clinic", body: "Row-level security keeps every clinic's records and files separate." },
  { icon: KeyRound, title: "Revocable staff access", body: "Regenerate your team QR code at any time; old posters stop working immediately." },
];

const ROADMAP = [
  "Supplier revision alerts",
  "GHS secondary label printing",
  "Inspector-ready PDF export",
  "Per-room product mapping",
  "Multi-location dashboard",
];

export default function ProductPage() {
  return (
    <>
      {productStructuredData(DESCRIPTION).map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(d)} />
      ))}

      <section className="relative overflow-hidden bg-white">
        <div aria-hidden="true" className="bg-aurora pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-24 sm:px-6 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-primary">Product</p>
            <h1 className="mt-4 font-heading text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.04em] text-slate-900 sm:text-6xl">
              The SDS system built for clinics, <span className="text-gradient-brand">not factories.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
              Scan a label or a PDF, review what the AI extracted, and give your whole team instant, login-free access to
              every Safety Data Sheet — in one focused tool.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic className="w-full sm:w-auto">
                <Link
                  href={siteConfig.links.startTrial}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgb(2_132_199/0.45)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_0_4px_rgb(2_132_199/0.12)] sm:w-auto"
                >
                  Start {siteConfig.trialDays}-Day Clinic Trial
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Magnetic>
              <Link href={routes.pricing} className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-6 text-[15px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 sm:w-auto">
                See pricing
              </Link>
            </div>
          </div>
          <AppMockup className="mx-auto mt-16 max-w-5xl" />
        </div>
      </section>

      <ProductShowcase />
      <HowItWorks />
      <Features />

      <section aria-labelledby="security-title" className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <SectionHeading
            eyebrow="Security & privacy"
            title="Built to the standard your patients expect."
            description="Safety Data Sheets aren't patient records, but we treat your clinic's data with the same care."
          />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY.map(({ icon: Icon, title, body }) => (
              <li key={title}>
                <SpotlightCard glow="emerald" className="h-full rounded-2xl border border-slate-200/80 bg-white p-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-success-soft text-success ring-1 ring-emerald-100">
                    <Icon className="size-[18px]" />
                  </span>
                  <p className="mt-4 font-heading text-base font-semibold tracking-tight text-slate-900">{title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{body}</p>
                </SpotlightCard>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Comparison />

      <section aria-labelledby="roadmap-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <RefreshCw className="size-4" />
              Roadmap
            </p>
            <h2 id="roadmap-title" className="mt-3 font-heading text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl">
              What we&apos;re building next
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
              Not available yet — listed so you can plan. Pro customers get each one as soon as it ships.
            </p>
          </div>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {ROADMAP.map((r) => (
              <li key={r} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200/70">
                {r}
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-500 uppercase ring-1 ring-slate-200">Soon</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
