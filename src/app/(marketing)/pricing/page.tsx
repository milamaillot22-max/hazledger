import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";

import { FinalCta } from "@/components/marketing/final-cta";
import { Pricing } from "@/components/marketing/pricing";
import { RiskCalculator } from "@/components/marketing/risk-calculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ANNUAL_DISCOUNT_PERCENT, ANNUAL_FREE_MONTHS, PLAN_MATRIX, PLANS, type MatrixValue } from "@/config/pricing";
import { routes, siteConfig } from "@/config/site";
import { jsonLd, pricingStructuredData } from "@/lib/seo";
import { cn } from "@/lib/utils";

const TITLE = `Pricing — Starter $${PLANS[0].monthly}, Pro $${PLANS[1].monthly} per location`;
const DESCRIPTION = `Simple per-location pricing for OSHA HazCom compliance. ${siteConfig.trialDays}-day free trial, no credit card. Save ${ANNUAL_DISCOUNT_PERCENT}% with annual billing.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: routes.pricing },
  openGraph: { url: routes.pricing, title: `${TITLE} | ${siteConfig.name}`, description: DESCRIPTION, siteName: siteConfig.name, type: "website" },
};

const FAQ = [
  {
    q: "Do I need a credit card to start the trial?",
    a: `No. Every plan starts with a ${siteConfig.trialDays}-day free trial with every feature, and no credit card.`,
  },
  {
    q: "How does annual billing work?",
    a: `Annual billing gives you ${ANNUAL_FREE_MONTHS} months free — ${ANNUAL_DISCOUNT_PERCENT}% off the monthly price, billed once a year.`,
  },
  {
    q: "What counts as an AI scan?",
    a: "Each document you upload for extraction — an SDS PDF or a label photo — counts as one scan. Reviewing, editing and sharing records never counts. Starter includes 25 scans a month; Pro is unlimited under a fair-use policy covering your location's own documents.",
  },
  {
    q: "What does “we import your binder” mean on Pro?",
    a: "Send us your existing SDSs (scans or PDFs). Our team runs them through the scanner for you; you review and confirm each record before it goes live.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Monthly plans stop at the end of the current month, and your records remain yours — ask us for a copy at any time.",
  },
  {
    q: "We have several locations or a DSO.",
    a: `Pricing is per location. For groups, contact ${siteConfig.contactEmail} — a multi-location dashboard is on our roadmap.`,
  },
];

function Cell({ value }: { value: MatrixValue }) {
  if (value === true) {
    return (
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-success-soft text-success" aria-label="Included">
        <Check className="size-3" strokeWidth={3} />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex size-5 items-center justify-center text-slate-300" aria-label="Not included">
        <Minus className="size-4" />
      </span>
    );
  }
  return <span className="text-sm font-medium text-slate-800">{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      {pricingStructuredData(FAQ).map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(d)} />
      ))}
      <Pricing headingLevel="h1" />

      <section aria-labelledby="matrix-title" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <h2 id="matrix-title" className="font-heading text-2xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl">
          Compare plans
        </h2>
        <div className="card-soft relative mt-8 overflow-x-auto rounded-3xl">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th scope="col" className="px-5 py-4 text-sm font-medium text-slate-500">
                  <span className="sr-only">Feature</span>
                </th>
                {PLANS.map((p) => (
                  <th key={p.id} scope="col" className={cn("w-40 px-5 py-4 text-center", p.featured && "bg-sky-50/60")}>
                    <span className="block font-heading text-base font-semibold text-slate-900">{p.name}</span>
                    <span className="block text-xs font-normal text-slate-500">${p.monthly} / month</span>
                  </th>
                ))}
              </tr>
            </thead>
            {PLAN_MATRIX.map((group) => (
              <tbody key={group.group}>
                <tr>
                  <th colSpan={3} scope="colgroup" className="bg-slate-50/80 px-5 py-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    {group.group}
                  </th>
                </tr>
                {group.rows.map((r) => (
                  <tr key={r.label} className="border-t border-slate-100">
                    <th scope="row" className="px-5 py-3.5 text-sm font-normal text-slate-700">
                      {r.label}
                    </th>
                    <td className="px-5 py-3.5 text-center">
                      <Cell value={r.starter} />
                    </td>
                    <td className="bg-sky-50/40 px-5 py-3.5 text-center">
                      <Cell value={r.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <RiskCalculator />

      <section aria-labelledby="pricing-faq" className="border-t border-slate-200/70 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <h2 id="pricing-faq" className="font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-slate-900">
            Pricing questions
          </h2>
          <Accordion type="single" collapsible className="border-t border-slate-200">
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} value={`p-${i}`} className="border-b border-slate-200">
                <AccordionTrigger className="py-5 text-left text-base font-semibold text-slate-900 hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-5 text-[15px] leading-relaxed text-slate-600">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <FinalCta title="Start your trial on Pro. Downgrade anytime." calculatorHref="#calculator" />
    </>
  );
}
