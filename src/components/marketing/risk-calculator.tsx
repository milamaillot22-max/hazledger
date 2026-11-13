"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ArrowRight, ExternalLink, PawPrint, Scale, SlidersHorizontal, Stethoscope } from "lucide-react";

import { Magnetic } from "@/components/fx/magnetic";
import { Tooth } from "@/components/icons/tooth";
import { Eyebrow } from "@/components/marketing/section-heading";
import { CORE_HAZCOM_REQUIREMENTS, OSHA_PENALTIES } from "@/config/compliance";
import { getPlan } from "@/config/pricing";
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

/** Bar colors validated for a white surface (dataviz validator): emphasis vs de-emphasis.
 *  The gray is below 3:1 contrast, relieved by direct value labels and the table view. */
const BAR_HAZLEDGER = "#0284c7";
const BAR_BINDER = "#a3adbd";

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const hrs = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString("en-US")} h`;

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
  const plan = getPlan();

  // Pure and cheap: recomputed synchronously on every input event — no lag, no tween.
  const r = useMemo(
    () => calculate({ sector, employees, rooms, products: productsOverride, assumptions, monthlyPrice: plan.monthly }),
    [sector, employees, rooms, productsOverride, assumptions, plan.monthly]
  );
  const reductionPct = Math.round(r.risk.sizeReduction * 100);
  const maxHours = Math.max(r.time.manualHours, r.time.hazledgerHours, 1);

  return (
    <section id="calculator" aria-labelledby="calc-title" className="relative scroll-mt-20 overflow-hidden">
      <div aria-hidden="true" className="bg-aurora pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>
            <Scale className="size-3.5" />
            OSHA risk &amp; ROI calculator
          </Eyebrow>
          <h2 id="calc-title" className="mt-4 font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-slate-900 sm:text-5xl">
            What is a paper SDS binder really costing you?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            Published {OSHA_PENALTIES.effectiveYear} OSHA maximums, your headcount, and time assumptions you control.
          </p>
        </div>

        <div className="card-soft mt-12 grid overflow-hidden rounded-[1.75rem] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* ── Controls ─────────────────────────────── */}
          <div className="p-6 sm:p-8">
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
                        "flex flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center text-xs font-medium transition-colors duration-150 outline-none focus-visible:ring-4 focus-visible:ring-sky-200",
                        active ? "border-sky-300 bg-sky-50 text-sky-900" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
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
              <RangeField label="Employees" hint="All locations" value={employees} min={LIMITS.employees.min} max={150} inputMax={LIMITS.employees.max} onChange={setEmployees} />
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

            <details className="group mt-8 rounded-xl border border-slate-200/80 bg-slate-50/60">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-slate-700 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-primary" />
                  Assumptions
                </span>
                <span className="text-xs text-slate-500 group-open:hidden">Edit</span>
              </summary>
              <div className="grid gap-4 border-t border-slate-200/80 p-4 sm:grid-cols-2">
                <NumberField
                  label="Hazardous products"
                  suffix={productsOverride === undefined ? "estimated" : "your count"}
                  value={r.products}
                  min={LIMITS.products.min}
                  max={LIMITS.products.max}
                  onChange={setProductsOverride}
                  help={`Estimate: ${estimateProducts(sector, rooms)}`}
                />
                <NumberField label="Staff cost per hour" prefix="$" value={assumptions.hourlyCost} min={0} max={500} onChange={(v) => setAssumptions((a) => ({ ...a, hourlyCost: v }))} help="Fully loaded wage" />
                <NumberField label="Manual min / product / yr" value={assumptions.manualMinutesPerProduct} min={0} max={600} onChange={(v) => setAssumptions((a) => ({ ...a, manualMinutesPerProduct: v }))} help="Find, print, file, check revisions" />
                <NumberField label="Binder audit h / month" value={assumptions.auditHoursPerMonth} min={0} max={40} step={0.5} onChange={(v) => setAssumptions((a) => ({ ...a, auditHoursPerMonth: v }))} />
                <NumberField label="Lookup h / employee / yr" value={assumptions.lookupHoursPerEmployee} min={0} max={40} step={0.5} onChange={(v) => setAssumptions((a) => ({ ...a, lookupHoursPerEmployee: v }))} />
                <NumberField label="HazLedger min / product / yr" value={assumptions.hazledgerMinutesPerProduct} min={0} max={120} onChange={(v) => setAssumptions((a) => ({ ...a, hazledgerMinutesPerProduct: v }))} help="Scan + review" />
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

          {/* ── Dashboard ────────────────────────────── */}
          <div className="border-t border-slate-100 bg-slate-50/70 p-6 sm:p-8 lg:border-t-0 lg:border-l" aria-live="polite">
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Penalty exposure · per serious citation</p>
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 ring-1 ring-rose-100">
                  {reductionPct > 0 ? `−${reductionPct}% size reduction` : "No size reduction"}
                </span>
              </div>
              {/* Hero figure — one per view */}
              <p className="mt-3 font-heading text-[2.6rem] leading-none font-semibold tracking-[-0.03em] text-slate-900 sm:text-5xl">
                {usd(r.risk.seriousAfterSizeReduction)}
                <span className="mx-2 text-slate-300">–</span>
                {usd(r.risk.seriousMax)}
              </p>
              <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-slate-200/70">
                  <dt className="text-xs text-slate-500">Cited on all {r.risk.coreRequirements} core requirements</dt>
                  <dd className="mt-0.5 font-semibold text-slate-900">up to {usd(r.risk.allCoreMax)}</dd>
                </div>
                <div className="rounded-xl bg-white px-3.5 py-2.5 shadow-sm ring-1 ring-slate-200/70">
                  <dt className="text-xs text-slate-500">Willful or repeated, per violation</dt>
                  <dd className="mt-0.5 font-semibold text-rose-700">up to {usd(r.risk.willfulOrRepeatedMax)}</dd>
                </div>
              </dl>

              {/* Hours comparison — emphasis bar vs de-emphasized gray, direct labels */}
              <div className="mt-8">
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Staff hours on SDS paperwork · per year</p>
                <div className="mt-3 space-y-3">
                  <Bar label="Paper binder" value={r.time.manualHours} max={maxHours} color={BAR_BINDER} />
                  <Bar label={siteConfig.name} value={r.time.hazledgerHours} max={maxHours} color={BAR_HAZLEDGER} />
                </div>
              </div>

              {/* KPI tiles */}
              <div className="mt-8 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Return</p>
                <span className="rounded-lg bg-slate-200/60 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {plan.name} · ${plan.monthly}/month
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Kpi label="Hours saved" value={hrs(r.time.hoursSaved)} />
                <Kpi label="Staff time saved" value={usd(r.time.valueSaved)} />
                <Kpi label={`${plan.name} / year`} value={usd(r.subscriptionAnnual)} />
                <Kpi
                  label="ROI on staff time"
                  value={r.roiPercent === null ? "—" : `${r.roiPercent >= 0 ? "+" : ""}${r.roiPercent}%`}
                  tone={r.roiPercent !== null && r.roiPercent >= 0 ? "good" : "neutral"}
                />
              </dl>

              <p className="mt-5 rounded-xl bg-success-soft px-4 py-3 text-sm leading-relaxed text-emerald-900 ring-1 ring-emerald-100">
                {r.yearsCoveredByOneCitation !== null ? (
                  <>
                    One serious citation at your size ({usd(r.risk.seriousAfterSizeReduction)}) equals{" "}
                    <span className="font-semibold text-emerald-950">{r.yearsCoveredByOneCitation} years</span> of {siteConfig.name}.
                  </>
                ) : null}
                {r.roiPercent !== null && r.roiPercent < 0 ? " Time savings alone don't cover the plan at this size — the case is compliance risk." : null}
              </p>

              <details className="mt-4 text-xs text-slate-500">
                <summary className="cursor-pointer hover:text-slate-900">Show the numbers as a table</summary>
                <table className="mt-3 w-full text-left">
                  <tbody className="tabular">
                    {[
                      ["Hazardous products", `${r.products}${r.productsEstimated ? " (estimated)" : ""}`],
                      ["Paper binder, hours / year", hrs(r.time.manualHours)],
                      [`${siteConfig.name}, hours / year`, hrs(r.time.hazledgerHours)],
                      ["Hours saved", hrs(r.time.hoursSaved)],
                      ["Staff time saved", usd(r.time.valueSaved)],
                      [`${plan.name} subscription / year`, usd(r.subscriptionAnnual)],
                      ["Payback", r.paybackDays === null ? "—" : `${r.paybackDays} days`],
                    ].map(([k, v]) => (
                      <tr key={k} className="border-t border-slate-200/70">
                        <th scope="row" className="py-1.5 pr-3 font-normal">{k}</th>
                        <td className="py-1.5 text-right font-medium text-slate-800">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>

              <Magnetic className="mt-6 w-full">
                <Link
                  href={`${siteConfig.links.startTrial}?plan=${plan.id}&source=calculator`}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgb(2_132_199/0.45)] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_0_4px_rgb(2_132_199/0.12)]"
                >
                  Start {siteConfig.trialDays}-Day Free Trial
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-4xl text-center text-xs leading-relaxed text-slate-500">
          Penalties: statutory maximums for {OSHA_PENALTIES.effectiveYear} ({OSHA_PENALTIES.source}{" "}
          <a href={OSHA_PENALTIES.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline">
            Source <ExternalLink className="size-3" />
          </a>
          ). Size reduction per OSHA&apos;s Field Operations Manual, Ch. 6 (July 2025). Actual penalties depend on gravity, history and
          good faith. Core requirements: {CORE_HAZCOM_REQUIREMENTS.map((c) => c.ref).join(", ")}. Time figures are estimates from the
          assumptions above, not a guarantee.
        </p>
      </div>
    </section>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.max(2, (value / max) * 100);
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)_64px] items-center gap-3 text-sm">
      <span className="truncate text-slate-600">{label}</span>
      <span className="h-3 overflow-hidden rounded-r bg-slate-200/50" role="img" aria-label={`${label}: ${hrs(value)} per year`}>
        <span
          className="block h-full origin-left rounded-r motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"
          style={{ width: "100%", transform: `scaleX(${pct / 100})`, backgroundColor: color }}
        />
      </span>
      <span className="text-right font-semibold text-slate-900">{hrs(value)}</span>
    </div>
  );
}

function Kpi({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "good" | "neutral" }) {
  return (
    <div className="rounded-xl bg-white px-3 py-3 shadow-sm ring-1 ring-slate-200/70">
      <dt className="text-[11px] leading-tight text-slate-500">{label}</dt>
      <dd className={cn("mt-1 text-lg font-semibold", tone === "good" ? "text-emerald-700" : "text-slate-900")}>{value}</dd>
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
  const fill = ((Math.min(value, max) - min) / (max - min)) * 100;
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
        onInput={(e) => onChange(Number((e.target as HTMLInputElement).value))}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-4 focus-visible:ring-sky-100 [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(2,132,199,0.4)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-100 active:[&::-webkit-slider-thumb]:scale-110"
        style={{ background: `linear-gradient(to right, #0284c7 ${fill}%, #e2e8f0 ${fill}%)` }}
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
