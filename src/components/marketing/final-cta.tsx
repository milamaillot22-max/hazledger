import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function FinalCta() {
  return (
    <section id="demo" className="scroll-mt-20 px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-brand-deep">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-16">
          <div>
            <h2 className="text-3xl leading-tight font-bold text-white sm:text-4xl">
              Be inspection-ready before your next shift change.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-emerald-100/80 sm:text-lg">
              Start free, import your binders, post your first QR code today.
              If an inspector walks in tomorrow, you&apos;ll have the answer in
              your pocket.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              asChild
              size="xl"
              className="bg-white text-brand-deep hover:bg-emerald-50"
            >
              <Link href={siteConfig.links.startTrial}>
                Start {siteConfig.trialDays}-day free trial
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <a href={`mailto:${siteConfig.contactEmail}?subject=Demo%20request`}>
                <CalendarClock data-icon="inline-start" />
                Talk to a compliance specialist
              </a>
            </Button>
            <p className="text-center text-xs text-emerald-100/60">
              No credit card · Setup in under 10 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
