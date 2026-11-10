import { AhaDemo } from "@/components/marketing/aha-demo";
import { Comparison } from "@/components/marketing/comparison";
import { Faq } from "@/components/marketing/faq";
import { Features } from "@/components/marketing/features";
import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { ProductShowcase } from "@/components/marketing/product-showcase";
import { RiskSection } from "@/components/marketing/risk-section";
import { Specialties } from "@/components/marketing/specialties";
import { TrustBar } from "@/components/marketing/trust-bar";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <AhaDemo />
      <TrustBar />
      <ProductShowcase />
      <HowItWorks />
      <Specialties />
      <RiskSection />
      <Features />
      <Comparison />
      <Faq />
      <FinalCta />
    </>
  );
}
