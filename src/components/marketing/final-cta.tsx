import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export function FinalCta() {
  return (
    <section id="demo" className="scroll-mt-20 px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-sky-50 via-white to-emerald-50 shadow-lg shadow-slate-200/50">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:p-16">
          <div>
            <h2 className="text-3xl leading-tight font-semibold text-slate-900 sm:text-4xl">
              Be inspection-ready before your next patient.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Start free, scan your binder, post your first QR code today. If an
              OSHA inspector walks into your practice tomorrow, you&apos;ll have
              the answer in your pocket.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild size="xl">
              <Link href={siteConfig.links.startTrial}>
                Start {siteConfig.trialDays}-day free trial
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50"
            >
              <a href={`mailto:${siteConfig.contactEmail}?subject=Demo%20request`}>
                <CalendarClock data-icon="inline-start" />
                Talk to a compliance specialist
              </a>
            </Button>
            <p className="text-center text-xs text-slate-500">
              No credit card · Setup in under 10 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
