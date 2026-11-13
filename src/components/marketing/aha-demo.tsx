"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, Camera, CheckCircle2, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";

import { GhsDiamond } from "@/components/marketing/ghs-pictogram";
import { Eyebrow } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const STEP_MS = 4200;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}

const STEPS: { icon: LucideIcon; label: string; title: string; body: string }[] = [
  {
    icon: Camera,
    label: "Snap",
    title: "Snap the label or upload the SDS",
    body: "Your assistant photographs the bottle or drops in the manufacturer's PDF.",
  },
  {
    icon: Sparkles,
    label: "AI analysis",
    title: "Claude AI reads it for you",
    body: "Hazards, PPE, first aid and all 16 sections — extracted in about 30 seconds.",
  },
  {
    icon: ShieldCheck,
    label: "Compliant",
    title: "Your clinic turns green",
    body: "You confirm, the library updates, and your team's QR poster shows it instantly.",
  },
];

export function AhaDemo() {
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0); // bumps to replay animations
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const autoplay = !userPaused && !reducedMotion;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay || !inView) return;
    const t = setTimeout(() => {
      setActive((a) => (a + 1) % STEPS.length);
      setCycle((c) => c + 1);
    }, STEP_MS);
    return () => clearTimeout(t);
  }, [active, autoplay, inView]);

  function select(i: number) {
    setUserPaused(true);
    setActive(i);
    setCycle((c) => c + 1);
  }

  return (
    <section ref={ref} id="demo-steps" aria-labelledby="aha-title" className="scroll-mt-20 border-t border-slate-200/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>See it in action</Eyebrow>
          <h2 id="aha-title" className="mt-4 text-3xl leading-tight font-semibold text-slate-900 sm:text-4xl">
            From the supply closet to inspection-ready in three steps.
          </h2>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => {
            const isActive = i === active;
            const Icon = step.icon;
            return (
              <li key={step.label} className="relative">
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={isActive}
                  className={cn(
                    "group flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-white text-left transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-sky-200",
                    isActive
                      ? "border-primary/60 shadow-xl ring-4 shadow-sky-100 ring-sky-50 md:-translate-y-1"
                      : "border-slate-200/80 shadow-sm hover:border-sky-200 hover:shadow-md"
                  )}
                >
                  {/* progress */}
                  <span className="h-1 w-full bg-slate-100">
                    {isActive ? (
                      <span
                        key={`bar-${cycle}`}
                        className={cn("block h-full bg-primary", autoplay && inView ? "origin-left motion-safe:animate-[grow_linear_forwards]" : "w-full")}
                        style={autoplay && inView ? { animationDuration: `${STEP_MS}ms` } : undefined}
                      />
                    ) : i < active ? (
                      <span className="block h-full w-full bg-sky-200" />
                    ) : null}
                  </span>

                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50/60">
                    {i === 0 ? <ScanVisual active={isActive} cycle={cycle} /> : null}
                    {i === 1 ? <AnalysisVisual active={isActive} cycle={cycle} /> : null}
                    {i === 2 ? <ComplianceVisual active={isActive} cycle={cycle} /> : null}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-2 text-xs font-semibold text-sky-700">
                      <span className={cn("flex size-6 items-center justify-center rounded-full text-[11px]", isActive ? "bg-primary text-white" : "bg-brand-soft text-sky-700")}>
                        {i + 1}
                      </span>
                      <Icon className="size-3.5" />
                      {step.label}
                    </p>
                    <h3 className="mt-2.5 text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{step.body}</p>
                  </div>
                </button>
                {i < STEPS.length - 1 ? (
                  <ArrowRight aria-hidden="true" className="absolute top-28 -right-4 z-10 hidden size-5 rounded-full bg-white p-0.5 text-slate-300 ring-1 ring-slate-200 md:block" />
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="mt-10 flex flex-col items-center gap-3">
          <Button asChild size="xl">
            <Link href={siteConfig.links.startTrial}>
              Try it with your own SDS
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <p className="text-sm text-slate-500">Free for {siteConfig.trialDays} days · Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}

/* ── Step visuals ─────────────────────────────────────────────── */

function ScanVisual({ active, cycle }: { active: boolean; cycle: number }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* bottle */}
      <div className="relative">
        <div className="mx-auto h-5 w-10 rounded-t-md bg-slate-300" />
        <div className="flex h-40 w-36 items-center justify-center rounded-2xl bg-gradient-to-b from-sky-100 to-sky-200/80 shadow-inner">
          <div className="w-[88%] rounded-lg bg-white p-2 shadow-sm ring-1 ring-slate-200">
            <p className="text-[7px] font-bold tracking-widest text-sky-700">STERIGUARD</p>
            <p className="text-[10px] leading-tight font-semibold text-slate-900">Surface Disinfectant</p>
            <div className="mt-1 flex items-center gap-0.5">
              <GhsDiamond code="GHS02" className="size-4" />
              <GhsDiamond code="GHS07" className="size-4" />
              <span className="ml-0.5 text-[7px] font-bold text-red-600">WARNING</span>
            </div>
            <p className="mt-0.5 text-[6px] leading-snug text-slate-500">Isopropyl alcohol 55%. Flammable liquid and vapor.</p>
          </div>
        </div>
        {/* scan frame */}
        <div className={cn("pointer-events-none absolute -inset-3 transition-opacity duration-300", active ? "opacity-100" : "opacity-40")}>
          {["top-0 left-0 border-t-2 border-l-2 rounded-tl-lg", "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg", "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg", "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg"].map((c) => (
            <span key={c} className={`absolute size-6 border-sky-500 ${c}`} />
          ))}
          {active ? (
            <span key={cycle} className="absolute inset-x-2 top-1/2 h-0.5 rounded-full bg-sky-500 shadow-[0_0_12px_2px_rgba(14,165,233,0.45)] motion-safe:animate-[scan_2.2s_ease-in-out_infinite]" />
          ) : null}
        </div>
      </div>
      <span
        className={cn(
          "absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-opacity",
          active ? "opacity-100" : "opacity-0"
        )}
      >
        <Camera className="size-3.5 text-primary" />
        Label captured
      </span>
    </div>
  );
}

const EXTRACTED: { label: string; value: React.ReactNode }[] = [
  { label: "Product", value: "SteriGuard Surface Disinfectant" },
  {
    label: "Hazards",
    value: (
      <span className="flex items-center gap-1">
        <GhsDiamond code="GHS02" className="size-4" />
        <GhsDiamond code="GHS07" className="size-4" />
        <span className="font-bold text-amber-600">WARNING</span>
      </span>
    ),
  },
  { label: "H226", value: "Flammable liquid and vapor" },
  { label: "PPE", value: "Gloves · Eye protection" },
  { label: "First aid", value: "Rinse eyes for 15 minutes" },
];

function AnalysisVisual({ active, cycle }: { active: boolean; cycle: number }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center px-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-sky-700 shadow-sm ring-1 ring-sky-100">
          <Sparkles className={cn("size-3.5", active && "motion-safe:animate-pulse")} />
          Claude AI
        </span>
        <span className="text-[11px] font-medium text-slate-500 tabular">≈ 30 s</span>
      </div>
      <ul key={active ? `run-${cycle}` : "idle"} className="mt-3 space-y-1.5">
        {EXTRACTED.map((row, i) => (
          <li
            key={row.label}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-1.5 text-[11px] shadow-sm ring-1 ring-slate-200/80",
              active && "motion-safe:animate-[fade-up_0.45s_ease-out_both]"
            )}
            style={active ? { animationDelay: `${250 + i * 380}ms` } : undefined}
          >
            <span className="shrink-0 font-semibold text-slate-500">{row.label}</span>
            <span className="flex min-w-0 items-center gap-1 truncate font-medium text-slate-900">
              {row.value}
              <CheckCircle2 className="size-3 shrink-0 text-success" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComplianceVisual({ active, cycle }: { active: boolean; cycle: number }) {
  // Starts at 94% each time the step activates, then fills to 100%.
  const [settledCycle, setSettledCycle] = useState(-1);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setSettledCycle(cycle), 500);
    return () => clearTimeout(t);
  }, [active, cycle]);
  const score = !active || settledCycle === cycle ? 100 : 94;

  const r = 38;
  const circumference = 2 * Math.PI * r;
  const done = score === 100;

  return (
    <div className="absolute inset-0 flex items-center justify-center gap-5 px-5">
      <div className="relative size-28 shrink-0">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={done ? "#059669" : "#0284c7"}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - score / 100)}
            className="motion-safe:transition-[stroke-dashoffset,stroke] motion-safe:duration-1000 motion-safe:ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-heading text-2xl font-semibold tabular transition-colors duration-700", done ? "text-emerald-700" : "text-sky-700")}>
            {score}%
          </span>
          <span className="text-[9px] font-medium text-slate-500">ready</span>
        </div>
      </div>
      <div className="min-w-0 space-y-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition-colors duration-700",
            done ? "bg-success-soft text-emerald-700 ring-emerald-100" : "bg-brand-soft text-sky-700 ring-sky-100"
          )}
        >
          <ShieldCheck className="size-3.5" />
          Inspection-ready
        </span>
        <div
          key={active ? `row-${cycle}` : "idle"}
          className={cn("rounded-lg bg-white px-3 py-2 shadow-sm ring-1 ring-emerald-100", active && "motion-safe:animate-[fade-up_0.5s_ease-out_both]")}
          style={active ? { animationDelay: "700ms" } : undefined}
        >
          <p className="truncate text-[11px] font-semibold text-slate-900">SteriGuard Surface Disinfectant</p>
          <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-700">
            <CheckCircle2 className="size-3" />
            Added · Current
          </p>
        </div>
        <p className="text-[10px] text-slate-500 tabular">87 SDSs current · QR poster updated</p>
      </div>
    </div>
  );
}
