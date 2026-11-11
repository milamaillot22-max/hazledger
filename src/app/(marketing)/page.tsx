import type { Metadata } from "next";

import { AhaDemo } from "@/components/marketing/aha-demo";
import { Comparison } from "@/components/marketing/comparison";
import { Faq } from "@/components/marketing/faq";
import { Features } from "@/components/marketing/features";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Pricing } from "@/components/marketing/pricing";
import { ProductShowcase } from "@/components/marketing/product-showcase";
import { RiskCalculator } from "@/components/marketing/risk-calculator";
import { RiskSection } from "@/components/marketing/risk-section";
import { Specialties } from "@/components/marketing/specialties";
import { TrustBar } from "@/components/marketing/trust-bar";

// Open Graph (incl. the share image from app/opengraph-image.tsx) is inherited
// from the root layout; redefining `openGraph` here would drop that image.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <AhaDemo />
      <RiskCalculator />
      <TrustBar />
      <ProductShowcase />
      <HowItWorks />
      <Specialties />
      <RiskSection />
      <Features />
      <Comparison />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
