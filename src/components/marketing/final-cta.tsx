import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, ShieldCheck } from "lucide-react";

import ctaPhoto from "@/assets/images/fullbleed-windows.webp";
import { Magnetic } from "@/components/fx/magnetic";
import { OSHA_PENALTIES } from "@/config/compliance";
import { getPlan } from "@/config/pricing";
import { routes, siteConfig } from "@/config/site";

const pro = getPlan("pro");

export function FinalCta({ title, calculatorHref = "/#calculator" }: { title?: string; calculatorHref?: string }) {
  return (
    <section id="demo" className="relative isolate scroll-mt-20 overflow-hidden bg-slate-950">
      <Image src={ctaPhoto} alt="" fill placeholder="blur" sizes="100vw" className="-z-20 object-cover object-[50%_45%]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/30" />
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-28">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/30 backdrop-blur">
            <ShieldCheck className="size-3.5" />
            One serious citation: up to ${OSHA_PENALTIES.seriousMax.toLocaleString("en-US")}
          </p>
          <h2 className="mt-6 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            {title ?? "Be inspection-ready before your next patient."}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Start on {pro.name} for {siteConfig.trialDays} days, free. We import your binder, you print your team QR poster today.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href={`${routes.signup}?plan=${pro.id}&source=final-cta`}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white shadow-[0_10px_30px_-8px_rgb(2_132_199/0.7)] transition-all duration-200 hover:bg-primary-hover sm:w-auto"
              >
                Start {siteConfig.trialDays}-Day {pro.name} Trial
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Link
              href={routes.pricing}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white/10 px-6 text-[15px] font-medium text-white ring-1 ring-white/30 backdrop-blur transition-colors hover:bg-white/20 sm:w-auto"
            >
              Compare plans
            </Link>
          </div>
          <p className="mt-5 text-xs text-white/65">No credit card required · Cancel anytime · ${pro.monthly}/month per location after the trial</p>
          <Link
            href={calculatorHref}
            className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-200 hover:text-white"
          >
            <Calculator className="size-4" />
            Not sure yet? Estimate your clinic&apos;s OSHA fine exposure
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
