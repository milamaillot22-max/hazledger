"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Building2, Check, ShieldCheck, Sparkles } from "lucide-react";

import { Magnetic } from "@/components/fx/magnetic";
import { SpotlightCard } from "@/components/fx/spotlight-card";
import { AnimatedNumber } from "@/components/marketing/animated-number";
import { Eyebrow } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import {
  ANNUAL_DISCOUNT_PERCENT,
  PLANS,
  priceFor,
  type BillingCycle,
  type Plan,
} from "@/config/pricing";
import { routes, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function Pricing({
  showDetailsLink = false,
  headingLevel = "h2",
}: {
  /** Home: link to the full /pricing page. */
  showDetailsLink?: boolean;
  /** /pricing uses the section title as its page h1. */
  headingLevel?: "h1" | "h2";
}) {
  const Heading = headingLevel;
  const [cycle, setCycle] = useState<BillingCycle>("annual");

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative scroll-mt-20 overflow-hidden border-t border-slate-200/70 bg-white">
      <div aria-hidden="true" className="bg-aurora pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Pricing</Eyebrow>
          <Heading id="pricing-title" className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-slate-900 sm:text-5xl">
            Simple pricing. Serious protection.
          </Heading>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Per location, everything included in your {siteConfig.trialDays}-day trial. No setup fees, no long contracts.
          </p>
        </div>

        <BillingToggle cycle={cycle} onChange={setCycle} />

        <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 md:grid-cols-2">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} cycle={cycle} />
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/70 px-6 py-5 backdrop-blur sm:flex-row">
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <ShieldCheck className="size-4 shrink-0 text-success" />
            Every plan: {siteConfig.trialDays}-day free trial · No credit card · Cancel anytime · Hosted in the US, encrypted
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}?subject=Multi-location%20pricing`}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            <Building2 className="size-4" />
            Multiple locations or a DSO? Talk to us
          </a>
        </div>
        {showDetailsLink ? (
          <p className="mt-6 text-center">
            <Link href={routes.pricing} className="group inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              Full plan details and pricing FAQ
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}

function BillingToggle({ cycle, onChange }: { cycle: BillingCycle; onChange: (c: BillingCycle) => void }) {
  return (
    <div className="mt-10 flex justify-center">
      <div role="radiogroup" aria-label="Billing cycle" className="relative grid grid-cols-2 rounded-full bg-slate-100 p-1 ring-1 ring-slate-200/80">
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-sm ring-1 ring-slate-200/70 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            cycle === "annual" && "translate-x-full"
          )}
        />
        {(["monthly", "annual"] as const).map((c) => (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={cycle === c}
            onClick={() => onChange(c)}
            className={cn(
              "relative z-10 flex items-center justify-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-sky-200",
              cycle === c ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
            )}
          >
            {c === "monthly" ? "Monthly" : "Annual"}
            {c === "annual" ? (
              <span className="rounded-full bg-success-soft px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                −{ANNUAL_DISCOUNT_PERCENT}%
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
  const price = priceFor(plan, cycle);
  const href = `${routes.signup}?plan=${plan.id}&billing=${cycle}`;
  const featured = plan.featured;

  const card = (
    <SpotlightCard
      glow={featured ? "emerald" : "blue"}
      className={cn(
        "lift flex h-full flex-col rounded-3xl p-7 sm:p-8",
        featured
          ? "bg-white/85 shadow-2xl shadow-sky-900/10 backdrop-blur-xl"
          : "border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{plan.tagline}</p>
        </div>
        {featured ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-sky-600 to-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <Sparkles className="size-3" />
            Recommended for clinics
          </span>
        ) : null}
      </div>

      <div className="mt-7 flex items-end gap-1.5">
        <span className="font-heading text-5xl font-semibold tracking-tight text-slate-900">
          <AnimatedNumber value={price.perMonth} format={usd} duration={350} />
        </span>
        <span className="mb-1.5 text-sm text-slate-500">/ month per location</span>
      </div>
      <p className="mt-1.5 h-5 text-xs text-slate-500">
        {cycle === "annual" ? (
          <>
            Billed {usd(price.billedAmount)} yearly ·{" "}
            <span className="font-semibold text-emerald-700">save {usd(price.savings)}</span>
          </>
        ) : (
          "Billed monthly"
        )}
      </p>

      <Magnetic className="mt-7 w-full">
        <Button
          asChild
          size="xl"
          variant={featured ? "default" : "outline"}
          className={cn("w-full", !featured && "border-slate-200 bg-white text-slate-800 shadow-xs hover:border-sky-200 hover:bg-sky-50/60")}
        >
          <Link href={href}>
            Start {siteConfig.trialDays}-Day Clinic Trial
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </Magnetic>
      <p className="mt-2.5 text-center text-xs text-slate-500">No credit card required</p>

      <ul className="mt-7 flex flex-wrap gap-1.5" aria-label={`${plan.name} limits`}>
        {plan.limits.map((l) => (
          <li key={l} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {l}
          </li>
        ))}
      </ul>

      <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
        {plan.features.map((f) => (
          <li key={f.label} className={cn("flex items-start gap-2.5 text-sm", f.comingSoon ? "text-slate-500" : "text-slate-700")}>
            <span
              className={cn(
                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                f.comingSoon ? "bg-slate-100 text-slate-400" : "bg-success-soft text-success"
              )}
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span>
              {f.label}
              {f.comingSoon ? (
                <span className="ml-2 rounded-full bg-slate-100 px-1.5 py-0.5 align-middle text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                  Soon
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );

  if (!featured) return card;
  // Featured: hairline gradient border + soft halo (glass effect).
  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-sky-400/70 via-sky-200/50 to-emerald-400/60 p-px md:-my-3">
      <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-b from-sky-200/40 to-emerald-200/30 blur-2xl" />
      <div className="h-full rounded-[calc(1.5rem-1px)] bg-gradient-to-b from-sky-50/60 to-white">{card}</div>
    </div>
  );
}
