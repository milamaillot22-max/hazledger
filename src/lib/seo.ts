import { CURRENCY, PLANS } from "@/config/pricing";
import { routes, siteConfig } from "@/config/site";
import type { Solution } from "@/features/solutions/data";
import { env } from "@/lib/env";

export const absoluteUrl = (path: string) => new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();

/** Serialize JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

/**
 * schema.org structured data for a solution page. Only verifiable facts:
 * no ratings or reviews until real ones exist.
 */
export function solutionStructuredData(s: Solution) {
  const url = absoluteUrl(routes.solution(s.slug));
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      url,
      description: s.metaDescription,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Safety Data Sheet (SDS) management and OSHA HazCom compliance",
      operatingSystem: "Web browser (desktop and mobile)",
      audience: { "@type": "BusinessAudience", audienceType: s.audience, geographicArea: { "@type": "Country", name: "United States" } },
      featureList: [
        "AI extraction of Safety Data Sheets from PDFs and photos",
        "Login-free staff access by QR code",
        "SDS library organized by room",
        "Human review before records go live",
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: CURRENCY,
        lowPrice: Math.min(...PLANS.map((p) => p.monthly)).toFixed(2),
        highPrice: Math.max(...PLANS.map((p) => p.monthly)).toFixed(2),
        offerCount: PLANS.length,
        offers: PLANS.map((p) => ({
          "@type": "Offer",
          name: `${siteConfig.name} ${p.name}`,
          price: p.monthly.toFixed(2),
          priceCurrency: CURRENCY,
          url: absoluteUrl(`${routes.signup}?plan=${p.id}`),
          description: `${p.name} plan, per location per month. ${siteConfig.trialDays}-day free trial, no credit card required.`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: s.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: siteConfig.name, item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: s.name, item: url },
      ],
    },
  ];
}
