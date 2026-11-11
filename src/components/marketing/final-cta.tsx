import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import waitingRoomPhoto from "@/assets/images/clinic-waiting-room.webp";
import { Magnetic } from "@/components/fx/magnetic";
import { OSHA_PENALTIES } from "@/config/compliance";
import { getPlan } from "@/config/pricing";
import { routes, siteConfig } from "@/config/site";

const pro = getPlan("pro");

export function FinalCta({ title }: { title?: string }) {
  return (
    <section id="demo" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">
      <div className="card-soft relative mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div aria-hidden="true" className="bg-aurora pointer-events-none absolute inset-0" />
        <div className="relative px-6 py-14 text-center sm:px-12 sm:py-16 lg:py-20 lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <ShieldCheck className="size-3.5" />
            One serious citation: up to ${OSHA_PENALTIES.seriousMax.toLocaleString("en-US")}
          </p>
          <h2 className="mt-6 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-slate-900 sm:text-5xl">
            {title ?? "Be inspection-ready before your next patient."}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base lg:mx-0 leading-relaxed text-slate-500 sm:text-lg">
            Start on {pro.name} for {siteConfig.trialDays} days, free. We import your binder, you print your team QR poster today.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href={`${routes.signup}?plan=${pro.id}&source=final-cta`}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgb(2_132_199/0.45)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_0_4px_rgb(2_132_199/0.12),0_12px_28px_-8px_rgb(2_132_199/0.5)] sm:w-auto"
              >
                Start {siteConfig.trialDays}-Day {pro.name} Trial
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Link
              href={routes.pricing}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-white px-6 text-[15px] font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 hover:text-slate-900 sm:w-auto"
            >
              Compare plans
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">No credit card · Cancel anytime · ${pro.monthly}/month per location after the trial</p>
        </div>
        <div className="relative hidden min-h-[22rem] [mask-image:linear-gradient(to_right,transparent,black_28%)] lg:block">
          <Image
            src={waitingRoomPhoto}
            alt="Calm, modern clinic waiting room"
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 480px, 0px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
