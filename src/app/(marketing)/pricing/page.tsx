import type { Metadata } from "next";

import { FinalCta } from "@/components/marketing/final-cta";
import { Pricing } from "@/components/marketing/pricing";
import { RiskCalculator } from "@/components/marketing/risk-calculator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ANNUAL_DISCOUNT_PERCENT, ANNUAL_FREE_MONTHS, getPlan, priceFor } from "@/config/pricing";
import { routes, siteConfig } from "@/config/site";
import { jsonLd, pricingStructuredData } from "@/lib/seo";

const pro = getPlan();
const TITLE = `Pricing — $${pro.monthly}/month per location, everything included`;
const DESCRIPTION = `Simple per-location pricing for OSHA HazCom compliance. ${siteConfig.trialDays}-day free trial. Save ${ANNUAL_DISCOUNT_PERCENT}% with annual billing.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: routes.pricing },
  openGraph: { url: routes.pricing, title: `${TITLE} | ${siteConfig.name}`, description: DESCRIPTION, siteName: siteConfig.name, type: "website" },
};

const FAQ = [
  {
    q: "Do I need a credit card to start the trial?",
    a: `Yes, a card is required to start, but you pay $0 today. You get a ${siteConfig.trialDays}-day free trial (up to 15 SDSs). Cancel from Billing before the trial ends and you're never charged.`,
  },
  {
    q: "How does annual billing work?",
    a: `Annual billing gives you ${ANNUAL_FREE_MONTHS} months free: $${priceFor(pro, "annual").billedAmount.toLocaleString("en-US")} per year instead of $${(pro.monthly * 12).toLocaleString("en-US")}, billed once a year (${ANNUAL_DISCOUNT_PERCENT}% off).`,
  },
  {
    q: "What counts as an AI scan?",
    a: "Each document you upload for extraction — an SDS PDF or a label photo — counts as one scan. Reviewing, editing and sharing records never counts. Scans are unlimited under a fair-use policy covering your location's own documents.",
  },
  {
    q: "Is there a cheaper plan?",
    a: "No. There is one plan with everything included, so there are no limits to outgrow and no features held back. You only choose how you pay: monthly, or yearly with 2 months free.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, from Billing in your dashboard. Your plan stays active until the end of the period you have paid for and is not renewed. Your records remain yours — ask us for a copy at any time.",
  },
  {
    q: "We have several locations or a DSO.",
    a: `Pricing is per location. For groups, contact ${siteConfig.contactEmail} — a multi-location dashboard is on our roadmap.`,
  },
];

export default function PricingPage() {
  return (
    <>
      {pricingStructuredData(FAQ).map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={jsonLd(d)} />
      ))}
      <Pricing headingLevel="h1" />

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

      <FinalCta title="Start your 14-day free trial today." calculatorHref="#calculator" />
    </>
  );
}
