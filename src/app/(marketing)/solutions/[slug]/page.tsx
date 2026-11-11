import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, ChevronRight, FlaskConical, QrCode, ScanLine, ShieldCheck } from "lucide-react";

import { RiskCalculator } from "@/components/marketing/risk-calculator";
import { SectorMockup } from "@/components/product/sector-mockup";
import { Eyebrow } from "@/components/marketing/section-heading";
import { TrialForm } from "@/components/marketing/trial-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { routes, siteConfig } from "@/config/site";
import { getSolution, SOLUTIONS } from "@/features/solutions/data";
import { jsonLd, solutionStructuredData } from "@/lib/seo";

export function generateStaticParams() {
  return SOLUTIONS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  const path = routes.solution(s.slug);
  return {
    title: { absolute: `${s.metaTitle} | ${siteConfig.name}` },
    description: s.metaDescription,
    keywords: s.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName: siteConfig.name,
      locale: "en_US",
      title: s.metaTitle,
      description: s.metaDescription,
    },
    twitter: { card: "summary_large_image", title: s.metaTitle, description: s.metaDescription },
  };
}

const STEPS = [
  { icon: ScanLine, title: "Scan what's on the shelf", body: "Photograph a label or upload the manufacturer's PDF. Hazards, PPE and all 16 sections are extracted in about 30 seconds." },
  { icon: ShieldCheck, title: "Review and confirm", body: "You check every field against the document before it goes live. Invalid CAS numbers and old revisions are flagged." },
  { icon: QrCode, title: "Post one QR code", body: "Your team scans it with any phone camera — no app, no login — and new SDSs appear on it automatically." },
];

export default async function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();
  const others = SOLUTIONS.filter((o) => o.slug !== s.slug);

  return (
    <>
      {solutionStructuredData(s).map((data, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(data)} />
      ))}

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden="true" className="bg-aurora pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-12 pb-20 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pb-28">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <Link href="/" className="hover:text-slate-900">{siteConfig.name}</Link>
              <ChevronRight className="size-3" />
              <span className="text-slate-600">{s.name}</span>
            </nav>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <ShieldCheck className="size-3.5" />
              {s.eyebrow}
            </p>
            <h1 className="mt-5 font-heading text-[2.3rem] leading-[1.06] font-semibold tracking-[-0.035em] text-slate-900 sm:text-[3.3rem]">
              {s.title} <span className="text-gradient-brand">{s.titleAccent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-500">{s.intro}</p>
            <TrialForm source={s.slug} className="mt-9" />
          </div>
          <div className="relative mx-auto w-full max-w-md pb-40 sm:pb-36">
            <div className="relative aspect-[4/3.3] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgb(15_23_42/0.35)] ring-1 ring-slate-200/70">
              <Image
                src={s.photo}
                alt={s.photoAlt}
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 448px, 100vw"
                className="object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
            </div>
            <SectorMockup solution={s} rows={3} className="absolute inset-x-4 bottom-0 sm:-right-8 sm:left-10" />
          </div>
        </div>
      </section>

      {/* Pains */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="max-w-2xl text-3xl leading-tight font-semibold text-slate-900">Why SDS binders fail {s.name.toLowerCase()}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {s.pains.map((p) => (
              <div key={p.title} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50">
                <h3 className="text-lg font-semibold text-slate-900">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chemicals */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <Eyebrow>
              <FlaskConical className="size-3.5" />
              {s.chemicalsIntro}
            </Eyebrow>
            <h2 className="mt-4 text-3xl leading-tight font-semibold text-slate-900">The products inspectors expect an SDS for.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              Every hazardous chemical your employees can be exposed to needs a current Safety Data Sheet — not just the obvious
              ones. These are the products most practices like yours start with.
            </p>
          </div>
          <div>
          <div className="relative mb-5 aspect-[16/7] overflow-hidden rounded-3xl ring-1 ring-slate-200/70">
            <Image src={s.scenePhoto} alt={s.sceneAlt} fill placeholder="blur" sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {s.chemicals.map((c) => (
              <li key={c.name} className="rounded-2xl border border-slate-200/80 bg-white p-4">
                <p className="text-[15px] font-semibold text-slate-900">{c.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{c.note}</p>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-200/70 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-3xl leading-tight font-semibold text-slate-900">Inspection-ready in an afternoon</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-2xl border border-slate-200/80 bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-primary"><Icon className="size-5" /></span>
                  <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">{i + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <RiskCalculator defaultSector={s.sector} />

      {/* FAQ */}
      <section className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <h2 className="text-3xl leading-tight font-semibold text-slate-900">Questions from {s.name.toLowerCase()}</h2>
          <Accordion type="single" collapsible className="border-t border-slate-200">
            {s.faq.map((f, i) => (
              <AccordionItem key={f.q} value={`q-${i}`} className="border-b border-slate-200">
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-slate-900 hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-5 text-[15px] leading-relaxed text-slate-600">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200/80 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-8 shadow-lg shadow-slate-200/50 sm:p-12">
          <h2 className="max-w-2xl text-3xl leading-tight font-semibold text-slate-900">
            Start your {siteConfig.trialDays}-day trial today. Print your team QR poster in minutes.
          </h2>
          <TrialForm source={`${s.slug}-footer`} className="mt-8" />
        </div>
        <nav aria-label="Other solutions" className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1.5 text-slate-500"><Building2 className="size-4" />Also built for</span>
          {others.map((o) => (
            <Link key={o.slug} href={routes.solution(o.slug)} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200 hover:text-primary hover:ring-sky-200">
              {o.name}
              <ArrowRight className="size-3.5" />
            </Link>
          ))}
        </nav>
      </section>
    </>
  );
}
