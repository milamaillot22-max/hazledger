import type { Metadata } from "next";

import { AhaDemo } from "@/components/marketing/aha-demo";
import { Faq } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Pricing } from "@/components/marketing/pricing";
import { ProductVideo } from "@/components/marketing/product-video";
import { RiskCalculator } from "@/components/marketing/risk-calculator";
import { Specialties } from "@/components/marketing/specialties";

// Open Graph (incl. the share image from app/opengraph-image.tsx) is inherited
// from the root layout; redefining `openGraph` here would drop that image.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Home: one path — understand, quantify the risk, pick a plan, start. */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <AhaDemo />
      <HowItWorks />
      <ProductVideo />
      <RiskCalculator />
      <Specialties />
      <Pricing showDetailsLink />
      <Faq />
      <FinalCta />
    </>
  );
}
