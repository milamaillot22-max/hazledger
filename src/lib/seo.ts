import { CURRENCY, PLANS } from "@/config/pricing";
import { routes, siteConfig } from "@/config/site";
import type { Post } from "@/features/blog/posts";
import type { Solution } from "@/features/solutions/data";
import { env } from "@/lib/env";

export const absoluteUrl = (path: string) => new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();

/** Serialize JSON-LD safely for a <script> tag. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

/** Shipped capabilities only — keep in sync with the product. */
const FEATURE_LIST = [
  "AI extraction of Safety Data Sheets from PDFs and label photos",
  "Human review with CAS-number validation before records go live",
  "Login-free staff access by team QR poster",
  "Emergency-first staff view: first aid, spills, PPE",
];

/**
 * schema.org SoftwareApplication. Only verifiable facts: no ratings or reviews
 * until real ones exist.
 */
function softwareApplication({ path, description, audience }: { path: string; description: string; audience?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    url: absoluteUrl(path),
    description,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Safety Data Sheet (SDS) management and OSHA HazCom compliance",
    operatingSystem: "Web browser (desktop and mobile)",
    audience: {
      "@type": "BusinessAudience",
      audienceType: audience ?? "Dental, veterinary and medical practices",
      geographicArea: { "@type": "Country", name: "United States" },
    },
    featureList: FEATURE_LIST,
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
  };
}

function faqPage(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: siteConfig.name, path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function solutionStructuredData(s: Solution) {
  const path = routes.solution(s.slug);
  return [
    softwareApplication({ path, description: s.metaDescription, audience: s.audience }),
    faqPage(s.faq),
    breadcrumbs([{ name: s.name, path }]),
  ];
}

export function productStructuredData(description: string) {
  return [softwareApplication({ path: routes.product, description }), breadcrumbs([{ name: "Product", path: routes.product }])];
}

export function pricingStructuredData(faq: { q: string; a: string }[]) {
  return [
    softwareApplication({ path: routes.pricing, description: siteConfig.description }),
    faqPage(faq),
    breadcrumbs([{ name: "Pricing", path: routes.pricing }]),
  ];
}

export function articleStructuredData(post: Post) {
  const path = routes.blogPost(post.slug);
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      inLanguage: "en-US",
      keywords: post.keywords.join(", "),
      mainEntityOfPage: absoluteUrl(path),
      image: absoluteUrl(post.cover.src),
      author: { "@type": "Organization", name: `${siteConfig.name} Editorial`, url: absoluteUrl("/") },
      publisher: { "@type": "Organization", name: siteConfig.name, url: absoluteUrl("/") },
      citation: post.sources.map((s) => s.url),
    },
    breadcrumbs([
      { name: "Blog", path: routes.blog },
      { name: post.title, path },
    ]),
  ];
}
