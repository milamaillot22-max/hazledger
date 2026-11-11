import { CheckCircle2, LayoutGrid, Library, QrCode, ScanLine, Search, Sparkles } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { GhsDiamond } from "@/components/marketing/ghs-pictogram";
import type { GhsCode } from "@/features/sds/schema";
import { cn } from "@/lib/utils";

/**
 * Code-rendered product shot of the real app (dark theme). Sample data:
 * invented brands, real CAS numbers. Animations are motion-safe only.
 */
const ROWS: { name: string; maker: string; cas: string; ghs: GhsCode[]; status: "current" | "review" | "missing" }[] = [
  { name: "ClearGuard Surface Disinfectant Wipes", maker: "Northline Medical Supply", cas: "67-63-0", ghs: ["GHS02", "GHS07"], status: "current" },
  { name: "Glutaraldehyde 2.5% High-Level Disinfectant", maker: "Brightline Health", cas: "111-30-8", ghs: ["GHS05", "GHS06", "GHS08"], status: "review" },
  { name: "Phosphoric Acid Etchant Gel 37%", maker: "Apex Dental Materials", cas: "7664-38-2", ghs: ["GHS05"], status: "current" },
  { name: "Formalin 10% Neutral Buffered", maker: "Lakeshore Lab Supply", cas: "50-00-0", ghs: ["GHS07", "GHS08"], status: "current" },
  { name: "Isoflurane, USP", maker: "—", cas: "26675-46-7", ghs: [], status: "missing" },
];

const STATUS = {
  current: { label: "Current", cls: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20", dot: "bg-emerald-400" },
  review: { label: "New revision", cls: "bg-amber-400/10 text-amber-300 ring-amber-400/20", dot: "bg-amber-400" },
  missing: { label: "Missing SDS", cls: "bg-rose-400/10 text-rose-300 ring-rose-400/20", dot: "bg-rose-400" },
} as const;

export function AppMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} role="img" aria-label="HazLedger dashboard: SDS library with 97.7% audit readiness and an SDS scan in progress">
      {/* glow */}
      <div aria-hidden="true" className="absolute -inset-x-10 -top-10 -bottom-6 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgb(56_189_248/0.22),transparent_70%)] blur-2xl" />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1220]/90 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.8)] ring-1 ring-black/40 backdrop-blur-xl">
        {/* chrome */}
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-white/10" />
            <span className="size-2.5 rounded-full bg-white/10" />
            <span className="size-2.5 rounded-full bg-white/10" />
          </div>
          <span className="rounded-md bg-white/[0.04] px-3 py-0.5 text-[11px] text-slate-400 ring-1 ring-white/[0.06]">gethazledger.com/dashboard/sds</span>
          <span className="w-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)]">
          {/* sidebar */}
          <aside className="hidden flex-col gap-1 border-r border-white/[0.06] p-3 md:flex">
            <div className="mb-3 flex items-center gap-2 px-2 pt-1 text-white">
              <LogoMark className="size-4" />
              <span className="font-heading text-[13px] font-semibold tracking-tight">HazLedger</span>
            </div>
            {[
              { icon: LayoutGrid, label: "Overview" },
              { icon: Library, label: "SDS library", active: true },
              { icon: ScanLine, label: "Scan" },
              { icon: QrCode, label: "Team QR" },
            ].map(({ icon: Icon, label, active }) => (
              <span
                key={label}
                className={cn(
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px]",
                  active ? "bg-sky-400/10 text-sky-200 ring-1 ring-sky-400/15" : "text-slate-400"
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </span>
            ))}
            <div className="mt-auto rounded-lg bg-white/[0.03] p-2.5 ring-1 ring-white/[0.06]">
              <p className="text-[11px] font-medium text-slate-200">Sunset Family Dental</p>
              <p className="text-[10px] text-slate-500">San Diego, CA</p>
            </div>
          </aside>

          {/* main */}
          <div className="min-w-0 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-500">Sunset Family Dental</p>
                <p className="font-heading text-[17px] font-semibold tracking-tight text-white">SDS library</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-md bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-slate-500 ring-1 ring-white/[0.06] sm:flex">
                  <Search className="size-3" />
                  Search product, CAS…
                </span>
                <span className="flex items-center gap-1.5 rounded-md bg-sky-500 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-[0_0_20px_-4px_rgb(14_165_233/0.8)]">
                  <ScanLine className="size-3" />
                  Scan SDS
                </span>
              </div>
            </div>

            {/* KPIs */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="col-span-2 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.06] sm:col-span-1">
                <Ring value={97.7} />
                <div>
                  <p className="text-[10px] text-slate-500">Audit readiness</p>
                  <p className="text-[15px] font-semibold text-white">97.7%</p>
                </div>
              </div>
              {[
                { label: "Current", value: "82", cls: "text-emerald-300" },
                { label: "Needs review", value: "3", cls: "text-amber-300" },
                { label: "Missing", value: "1", cls: "text-rose-300" },
              ].map((k) => (
                <div key={k.label} className="rounded-xl bg-white/[0.03] p-3 ring-1 ring-white/[0.06]">
                  <p className="text-[10px] text-slate-500">{k.label}</p>
                  <p className={cn("text-[17px] font-semibold", k.cls)}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* table */}
            <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-white/[0.06]">
              {ROWS.map((r, i) => {
                const s = STATUS[r.status];
                return (
                  <div
                    key={r.name}
                    className={cn(
                      "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_86px_70px_auto]",
                      i > 0 && "border-t border-white/[0.05]",
                      i === 1 && "bg-sky-400/[0.04]"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-slate-100">{r.name}</p>
                      <p className="truncate text-[10.5px] text-slate-500">{r.maker}</p>
                    </div>
                    <span className="hidden text-[11px] text-slate-400 tabular sm:block">{r.cas}</span>
                    <span className="hidden items-center gap-0.5 sm:flex">
                      {r.ghs.map((g) => (
                        <GhsDiamond key={g} code={g} className="size-[18px]" />
                      ))}
                    </span>
                    <span className={cn("inline-flex items-center gap-1.5 justify-self-end rounded-full px-2 py-0.5 text-[10.5px] font-medium whitespace-nowrap ring-1", s.cls)}>
                      <span className={cn("size-1.5 rounded-full", s.dot)} />
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* floating scan card */}
      <div className="glass-night absolute -right-3 -bottom-8 hidden w-64 rounded-2xl p-4 text-left sm:block lg:-right-10 motion-safe:animate-[float-y_6s_ease-in-out_infinite]">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-200">
            <Sparkles className="size-3.5" />
            Claude AI · extracting
          </p>
          <span className="text-[10px] text-slate-400">≈30 s</span>
        </div>
        <p className="mt-2 truncate text-[12.5px] font-medium text-white">Glutaraldehyde 2.5% — rev. 03/2026</p>
        <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-y-0 left-0 w-[72%] rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" />
          <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-[shimmer_1.8s_ease-in-out_infinite]" />
        </div>
        <ul className="mt-3 space-y-1.5 text-[11px]">
          {["Hazards · H314 · H331", "PPE · nitrile, goggles", "Sections · 16 / 16"].map((t) => (
            <li key={t} className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="size-3 text-emerald-400" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 40 40" className="size-10 -rotate-90" aria-hidden="true">
      <circle cx="20" cy="20" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="4" />
      <circle cx="20" cy="20" r={r} fill="none" stroke="#34d399" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
    </svg>
  );
}
