import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { ProductPreview } from "@/components/marketing/product-preview";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const REASSURANCE = [
  "No credit card required",
  "We import your existing binders",
  "Cancel anytime",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid mask-fade-b pointer-events-none absolute inset-0 opacity-60"
      />
      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Built for OSHA HazCom · 29 CFR 1910.1200
          </p>

          <h1 className="mt-6 text-[2.5rem] leading-[1.05] font-bold text-foreground sm:text-6xl">
            Pass your next OSHA inspection.{" "}
            <span className="text-primary">Without the binder.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {siteConfig.name} scans, indexes and keeps every Safety Data Sheet
            current — so every employee, on every shift, can pull up the right
            SDS from their phone in seconds.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href={siteConfig.links.startTrial}>
                Start your {siteConfig.trialDays}-day free trial
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="w-full bg-card sm:w-auto"
            >
              <a href={siteConfig.links.bookDemo}>Book a 15-min demo</a>
            </Button>
          </div>

          <ul className="mt-6 flex flex-col items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground sm:flex-row">
            {REASSURANCE.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="size-4 text-primary" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div id="product" className="mx-auto mt-16 max-w-5xl scroll-mt-24">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
