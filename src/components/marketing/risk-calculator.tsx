"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import {
  ArrowRight,
  Clock3,
  ExternalLink,
  PawPrint,
  Scale,
  SlidersHorizontal,
  Stethoscope,
  TrendingUp,
} from "lucide-react";

import { Tooth } from "@/components/icons/tooth";
import { AnimatedNumber } from "@/components/marketing/animated-number";
import { Eyebrow } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { CORE_HAZCOM_REQUIREMENTS, OSHA_PENALTIES } from "@/config/compliance";
import { siteConfig } from "@/config/site";
import {
  calculate,
  DEFAULT_ASSUMPTIONS,
  estimateProducts,
  LIMITS,
  SECTORS,
  type Assumptions,
  type Sector,
} from "@/features/roi/calculator";
import { cn } from "@/lib/utils";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const hrs = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString("en-US")} h`;
const pct = (n: number) => `${n >= 0 ? "+" : ""}${Math.round(n).toLocaleString("en-US")}%`;

const SECTOR_ICONS: Record<Sector, React.ComponentType<{ className?: string }>> = {
  dental: Tooth,
  veterinary: PawPrint,
  medical: Stethoscope,
};

export function RiskCalculator({ defaultSector = "dental" }: { defaultSector?: Sector }) {
  const [sector, setSector] = useState<Sector>(defaultSector);
  const [employees, setEmployees] = useState(12);
  const [rooms, setRooms] = useState(4);
  const [productsOverride, setProductsOverride] = useState<number | undefined>(undefined);
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);
  const price = siteConfig.pricing.monthlyPerLocation;

  const r = useMemo(
    () => calculate({ sector, employees, rooms, products: productsOverride, assumptions, monthlyPrice: price }),
    [sector, employees, rooms, productsOverride, assumptions, price]
  );
  const reductionPct = Math.round(r.risk.sizeReduction * 100);

  return (
    <section id="calculator" aria-labelledby="calc-title" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>
          <Scale className="size-3.5" />
          OSHA risk &amp; ROI calculator
        </Eyebrow>
        <h2 id="calc-title" className="mt-4 text-3xl leading-tight font-semibold text-slate-900 sm:text-4xl">
          What is a paper SDS binder really costing your practice?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Published {OSHA_PENALTIES.effectiveYear} OSHA penalty maximums, your headcount, and transparent time
          assumptions you can change.
        </p>
      </div>

      <div className="mt-12 grid overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Inputs */}
        <div className="border-b border-slate-100 p-6 sm:p-8 lg:border-r lg:border-b-0">
          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Your practice</legend>
            <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Practice type">
              {(Object.keys(SECTORS) as Sector[]).map((key) => {
                const Icon = SECTOR_ICONS[key];
                const active = key === sector;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setSector(key);
                      setProductsOverride(undefined);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center text-xs font-medium transition-all outline-none focus-visible:ring-4 focus-visible:ring-sky-200",
                      active
                        ? "border-primary bg-brand-soft text-sky-800 ring-4 ring-sky-50"
                        : "border-slate-200 text-slate-600 hover:border-sky-200 hover:bg-slate-50"
                    )}
                  >
                    <Icon className={cn("size-5", active ? "text-primary" : "text-slate-400")} />
                    {SECTORS[key].label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 space-y-7">
            <RangeField
              label="Employees"
              hint="All locations"
              value={employees}
              min={LIMITS.employees.min}
              max={150}
              inputMax={LIMITS.employees.max}
              onChange={setEmployees}
            />
            <RangeField
              label={SECTORS[sector].roomsLabel}
              value={rooms}
              min={LIMITS.rooms.min}
              max={30}
              inputMax={LIMITS.rooms.max}
              onChange={(n) => {
                setRooms(n);
                setProductsOverride(undefined);
              }}
            />
          </div>

          <details className="group mt-8 rounded-2xl border border-slate-200/80 bg-slate-50/60">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-slate-700 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" />
                Assumptions
              </span>
              <span className="text-xs text-slate-500">Edit</span>
            </summary>
            <div className="grid gap-4 border-t border-slate-200/80 p-4 sm:grid-cols-2">
              <NumberField
                label="Hazardous products"
                suffix={productsOverride === undefined ? "estimated" : "your count"}
                value={r.products}
                min={LIMITS.products.min}
                max={LIMITS.products.max}
                onChange={setProductsOverride}
                help={`Estimate: ${estimateProducts(sector, rooms)} for this practice`}
              />
              <NumberField
                label="Staff cost per hour"
                prefix="$"
                value={assumptions.hourlyCost}
                min={0}
                max={500}
                onChange={(v) => setAssumptions((a) => ({ ...a, hourlyCost: v }))}
                help="Fully loaded wage"
              />
              <NumberField
                label="Manual min / product / year"
                value={assumptions.manualMinutesPerProduct}
                min={0}
                max={600}
                onChange={(v) => setAssumptions((a) => ({ ...a, manualMinutesPerProduct: v }))}
                help="Find, print, file, check revisions"
              />
              <NumberField
                label="Binder audit h / month"
                value={assumptions.auditHoursPerMonth}
                min={0}
                max={40}
                step={0.5}
                onChange={(v) => setAssumptions((a) => ({ ...a, auditHoursPerMonth: v }))}
              />
              <NumberField
                label="Lookup h / employee / year"
                value={assumptions.lookupHoursPerEmployee}
                min={0}
                max={40}
                step={0.5}
                onChange={(v) => setAssumptions((a) => ({ ...a, lookupHoursPerEmployee: v }))}
              />
              <NumberField
                label="HazLedger min / product / year"
                value={assumptions.hazledgerMinutesPerProduct}
                min={0}
                max={120}
                onChange={(v) => setAssumptions((a) => ({ ...a, hazledgerMinutesPerProduct: v }))}
                help="Scan + review"
              />
              <button
                type="button"
                onClick={() => {
                  setAssumptions(DEFAULT_ASSUMPTIONS);
                  setProductsOverride(undefined);
                }}
                className="text-left text-xs font-semibold text-primary hover:underline sm:col-span-2"
              >
                Reset to defaults
              </button>
            </div>
          </details>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-br from-white via-white to-sky-50/50 p-6 sm:p-8" aria-live="polite">
          <ResultBlock icon={Scale} title="OSHA penalty exposure" tone="red">
            <p className="font-heading text-3xl font-semibold text-slate-900 sm:text-4xl">
              <AnimatedNumber value={r.risk.seriousAfterSizeReduction} format={usd} />
              <span className="mx-1.5 text-slate-300">–</span>
              {usd(r.risk.seriousMax)}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              per serious HazCom citation
              {reductionPct > 0
                ? `, after OSHA's maximum ${reductionPct}% size reduction for your headcount`
                : " (no size reduction above 250 employees)"}
              .
            </p>
            <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-slate-200/80">
                <dt className="text-xs text-slate-500">Cited on all {r.risk.coreRequirements} core HazCom requirements</dt>
                <dd className="mt-0.5 font-semibold text-slate-900">
                  up to <AnimatedNumber value={r.risk.allCoreMax} format={usd} />
                </dd>
              </div>
              <div className="rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-slate-200/80">
                <dt className="text-xs text-slate-500">Willful or repeated violation</dt>
                <dd className="mt-0.5 font-semibold text-red-700">up to {usd(r.risk.willfulOrRepeatedMax)}</dd>
              </div>
            </dl>
          </ResultBlock>

          <ResultBlock icon={Clock3} title="Staff time on SDS paperwork, per year" tone="blue">
            <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
              <div>
                <p className="text-xs text-slate-500">Paper binder</p>
                <p className="font-heading text-2xl font-semibold text-slate-900">
                  <AnimatedNumber value={r.time.manualHours} format={hrs} />
                </p>
              </div>
              <ArrowRight className="mb-2 size-4 text-slate-300" aria-hidden="true" />
              <div>
                <p className="text-xs text-slate-500">With {siteConfig.name}</p>
                <p className="font-heading text-2xl font-semibold text-sky-700">
                  <AnimatedNumber value={r.time.hazledgerHours} format={hrs} />
                </p>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                <AnimatedNumber value={r.time.hoursSaved} format={hrs} /> saved
              </span>{" "}
              ≈ <AnimatedNumber value={r.time.valueSaved} format={usd} /> of staff time · {r.products} products
              {r.productsEstimated ? " (estimated)" : ""}
            </p>
          </ResultBlock>

          <ResultBlock icon={TrendingUp} title={`${siteConfig.name} ${siteConfig.pricing.planName} plan`} tone="green" last>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-heading text-2xl font-semibold text-slate-900">
                  {usd(r.subscriptionAnnual)}
                  <span className="text-sm font-normal text-slate-500"> / year</span>
                </p>
                <p className="text-xs text-slate-500">{usd(price)} / month per location</p>
              </div>
              {r.roiPercent !== null ? (
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-semibold ring-1",
                    r.roiPercent >= 0
                      ? "bg-success-soft text-emerald-700 ring-emerald-100"
                      : "bg-slate-100 text-slate-600 ring-slate-200"
                  )}
                >
                  <AnimatedNumber value={r.roiPercent} format={pct} /> ROI on staff time
                </span>
              ) : null}
            </div>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              {r.roiPercent !== null && r.roiPercent >= 0 && r.paybackDays !== null ? (
                <li>
                  Pays for itself in <span className="font-semibold text-slate-900">{r.paybackDays} days</span> of saved
                  staff time.
                </li>
              ) : (
                <li>At this size, time savings alone don&apos;t cover the plan — the case is compliance risk.</li>
              )}
              {r.yearsCoveredByOneCitation !== null ? (
                <li>
                  One serious citation at your size ({usd(r.risk.seriousAfterSizeReduction)}) equals{" "}
                  <span className="font-semibold text-slate-900">{r.yearsCoveredByOneCitation} years</span> of{" "}
                  {siteConfig.name}.
                </li>
              ) : null}
            </ul>
            <Button asChild size="xl" className="mt-5 w-full sm:w-auto">
              <Link href={siteConfig.links.startTrial}>
                Start {siteConfig.trialDays}-Day Clinic Trial
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </ResultBlock>
        </div>
      </div>

      <p className="mx-auto mt-5 max-w-4xl text-center text-xs leading-relaxed text-slate-500">
        Penalties: statutory maximums for {OSHA_PENALTIES.effectiveYear} ({OSHA_PENALTIES.source}{" "}
        <a href={OSHA_PENALTIES.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline">
          Source <ExternalLink className="size-3" />
        </a>
        ). Size reduction per OSHA&apos;s Field Operations Manual, Ch. 6 (July 2025). Actual penalties depend on gravity,
        history and good faith. Core requirements: {CORE_HAZCOM_REQUIREMENTS.map((c) => c.ref).join(", ")}. Time figures are
        estimates from the assumptions above, not a guarantee.
      </p>
    </section>
  );
}

function ResultBlock({
  icon: Icon,
  title,
  tone,
  last,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone: "red" | "blue" | "green";
  last?: boolean;
  children: React.ReactNode;
}) {
  const tones = {
    red: "bg-red-50 text-red-700",
    blue: "bg-brand-soft text-primary",
    green: "bg-success-soft text-success",
  } as const;
  return (
    <div className={cn("py-5 first:pt-0", !last && "border-b border-slate-100")}>
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <span className={cn("flex size-7 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="size-4" />
        </span>
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function RangeField({
  label,
  hint,
  value,
  min,
  max,
  inputMax,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  inputMax: number;
  onChange: (n: number) => void;
}) {
  const id = useId();
  const pctFill = ((Math.min(value, max) - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
          {hint ? <span className="ml-1.5 text-xs font-normal text-slate-400">{hint}</span> : null}
        </label>
        <input
          type="number"
          aria-label={`${label} (exact)`}
          value={value}
          min={min}
          max={inputMax}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onChange(Math.min(inputMax, Math.max(min, Math.round(n))));
          }}
          className="h-9 w-20 rounded-lg border border-slate-200 bg-white px-2 text-right text-sm font-semibold text-slate-900 tabular outline-none focus:border-primary focus:ring-4 focus:ring-sky-100"
        />
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={Math.min(value, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0284c7] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-md"
        style={{ background: `linear-gradient(to right, #0284c7 ${pctFill}%, #e2e8f0 ${pctFill}%)` }}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  help,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  help?: string;
  onChange: (n: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-xs font-medium text-slate-600">
        {label}
        {suffix ? <span className="font-normal text-slate-400">{suffix}</span> : null}
      </label>
      <div className="mt-1 flex items-center rounded-lg border border-slate-200 bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-sky-100">
        {prefix ? <span className="pl-2.5 text-sm text-slate-400">{prefix}</span> : null}
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
          }}
          className="h-9 w-full rounded-lg bg-transparent px-2.5 text-sm font-semibold text-slate-900 tabular outline-none"
        />
      </div>
      {help ? <p className="mt-1 text-[11px] text-slate-400">{help}</p> : null}
    </div>
  );
}
