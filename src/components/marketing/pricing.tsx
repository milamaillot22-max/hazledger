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
import { PageBackdrop } from "@/components/marketing/page-backdrop";

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
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="relative scroll-mt-20 overflow-hidden border-t border-slate-200/70 bg-white">
      <PageBackdrop arch={false} />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>Pricing</Eyebrow>
          <Heading id="pricing-title" className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-slate-900 sm:text-5xl">
            Simple pricing. Serious protection.
          </Heading>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            One plan, everything included. Per location, no setup fees, no long contracts.
          </p>
        </div>

        <BillingToggle cycle={cycle} onChange={setCycle} />

        <div className="mx-auto mt-12 max-w-4xl">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} cycle={cycle} />
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/70 px-6 py-5 backdrop-blur sm:flex-row">
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <ShieldCheck className="size-4 shrink-0 text-success" />
            {siteConfig.trialDays}-day free trial · $0 today · Cancel anytime · Hosted in the US, encrypted
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
              Pricing details and FAQ
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
  const annual = priceFor(plan, "annual");
  const href = `${routes.signup}?plan=${plan.id}&billing=${cycle}`;
  const featured = plan.featured;

  const card = (
    <SpotlightCard
      glow="emerald"
      className="lift grid h-full gap-8 rounded-3xl bg-white/85 p-7 shadow-2xl shadow-sky-900/10 backdrop-blur-xl sm:p-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10"
    >
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-sky-600 to-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <Sparkles className="size-3" />
            Everything included
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{plan.tagline}</p>

        <div className="mt-7 flex items-baseline gap-1.5">
          <span className="font-heading text-5xl font-semibold tracking-tight text-slate-900 tabular">
            <AnimatedNumber value={price.perMonth} format={usd} duration={350} />
          </span>
          <span className="text-base font-medium text-slate-700">/ month</span>
          <span className="text-sm text-slate-500">per location</span>
        </div>
        <p className="mt-2 min-h-5 text-[13px] text-slate-500">
          {cycle === "annual" ? (
            <>
              Billed {usd(price.billedAmount)} yearly ·{" "}
              <span className="font-semibold text-emerald-700">save {usd(price.savings)}</span> vs. {usd(plan.monthly)}/month
            </>
          ) : (
            <>
              or {usd(annual.perMonth)}/month billed annually ({usd(annual.billedAmount)}/year) ·{" "}
              <span className="font-semibold text-emerald-700">{ANNUAL_DISCOUNT_PERCENT}% off</span>
            </>
          )}
        </p>

        <Magnetic className="mt-7 w-full">
          <Button asChild size="xl" className="w-full">
            <Link href={href}>
              Start {siteConfig.trialDays}-Day Free Trial
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </Magnetic>
        <p className="mt-2.5 text-center text-xs text-slate-500">$0 today · Cancel anytime before the trial ends</p>
      </div>

      <div className="border-t border-slate-100 pt-7 md:border-t-0 md:border-l md:pt-0 md:pl-10">
        <ul className="flex flex-wrap gap-1.5" aria-label={`${plan.name} limits`}>
          {plan.limits.map((l) => (
            <li key={l} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {l}
            </li>
          ))}
        </ul>
        <ul className="mt-6 space-y-3">
          {plan.features.map((f) => (
            <li key={f.label} className="flex items-start gap-2.5 text-sm text-slate-700">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success-soft text-success">
                <Check className="size-3" strokeWidth={3} />
              </span>
              <span className="font-medium text-slate-800">{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </SpotlightCard>
  );

  if (!featured) return card;
  // Featured: hairline gradient border + soft halo (glass effect).
  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-sky-400/70 via-sky-200/50 to-emerald-400/60 p-px">
      <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-b from-sky-200/40 to-emerald-200/30 blur-2xl" />
      <div className="h-full rounded-[calc(1.5rem-1px)] bg-gradient-to-b from-sky-50/60 to-white">{card}</div>
    </div>
  );
}
