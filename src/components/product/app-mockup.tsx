import { CheckCircle2, LayoutGrid, Library, QrCode, ScanLine, Search, Sparkles } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { GhsDiamond } from "@/components/marketing/ghs-pictogram";
import type { GhsCode } from "@/features/sds/schema";
import { cn } from "@/lib/utils";

/**
 * Code-rendered product shot of the real app. Sample data: invented brands,
 * real CAS numbers. Animations are motion-safe only.
 */
const ROWS: { name: string; maker: string; cas: string; ghs: GhsCode[]; status: "current" | "review" | "missing" }[] = [
  { name: "ClearGuard Surface Disinfectant Wipes", maker: "Northline Medical Supply", cas: "67-63-0", ghs: ["GHS02", "GHS07"], status: "current" },
  { name: "Glutaraldehyde 2.5% High-Level Disinfectant", maker: "Brightline Health", cas: "111-30-8", ghs: ["GHS05", "GHS06", "GHS08"], status: "review" },
  { name: "Phosphoric Acid Etchant Gel 37%", maker: "Apex Dental Materials", cas: "7664-38-2", ghs: ["GHS05"], status: "current" },
  { name: "Formalin 10% Neutral Buffered", maker: "Lakeshore Lab Supply", cas: "50-00-0", ghs: ["GHS07", "GHS08"], status: "current" },
  { name: "Isoflurane, USP", maker: "—", cas: "26675-46-7", ghs: [], status: "missing" },
];

const STATUS = {
  current: { label: "Current", cls: "bg-emerald-50 text-emerald-700 ring-emerald-100", dot: "bg-emerald-500" },
  review: { label: "New revision", cls: "bg-amber-50 text-amber-700 ring-amber-100", dot: "bg-amber-500" },
  missing: { label: "Missing SDS", cls: "bg-rose-50 text-rose-700 ring-rose-100", dot: "bg-rose-500" },
} as const;

export function AppMockup({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)} role="img" aria-label="HazLedger dashboard: SDS library with 97.7% audit readiness and an SDS scan in progress">
      <div className="card-soft overflow-hidden rounded-2xl shadow-[0_1px_2px_rgb(15_23_42/0.04),0_30px_80px_-30px_rgb(15_23_42/0.18)]">
        {/* chrome */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-slate-200" />
            <span className="size-2.5 rounded-full bg-slate-200" />
            <span className="size-2.5 rounded-full bg-slate-200" />
          </div>
          <span className="rounded-md bg-white px-3 py-0.5 text-[11px] text-slate-400 ring-1 ring-slate-200/80">gethazledger.com/dashboard/sds</span>
          <span className="w-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[180px_minmax(0,1fr)]">
          {/* sidebar */}
          <aside className="hidden flex-col gap-1 border-r border-slate-100 bg-slate-50/50 p-3 md:flex">
            <div className="mb-3 flex items-center gap-2 px-2 pt-1 text-slate-900">
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
                  active ? "bg-white font-medium text-slate-900 shadow-sm ring-1 ring-slate-200/80" : "text-slate-500"
                )}
              >
                <Icon className={cn("size-3.5", active && "text-primary")} />
                {label}
              </span>
            ))}
            <div className="mt-auto rounded-lg bg-white p-2.5 ring-1 ring-slate-200/80">
              <p className="text-[11px] font-medium text-slate-800">Sunset Family Dental</p>
              <p className="text-[10px] text-slate-400">San Diego, CA</p>
            </div>
          </aside>

          {/* main */}
          <div className="min-w-0 bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-400">Sunset Family Dental</p>
                <p className="font-heading text-[17px] font-semibold tracking-tight text-slate-900">SDS library</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-[11px] text-slate-400 ring-1 ring-slate-200 sm:flex">
                  <Search className="size-3" />
                  Search product, CAS…
                </span>
                <span className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-600/20">
                  <ScanLine className="size-3" />
                  Scan SDS
                </span>
              </div>
            </div>

            {/* KPIs */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="col-span-2 flex items-center gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70 sm:col-span-1">
                <Ring value={97.7} />
                <div>
                  <p className="text-[10px] text-slate-500">Audit readiness</p>
                  <p className="text-[15px] font-semibold text-slate-900">97.7%</p>
                </div>
              </div>
              {[
                { label: "Current", value: "82", cls: "text-emerald-700" },
                { label: "Needs review", value: "3", cls: "text-amber-700" },
                { label: "Missing", value: "1", cls: "text-rose-700" },
              ].map((k) => (
                <div key={k.label} className="rounded-xl bg-slate-50/70 p-3 ring-1 ring-slate-200/70">
                  <p className="text-[10px] text-slate-500">{k.label}</p>
                  <p className={cn("text-[17px] font-semibold", k.cls)}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* table */}
            <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-slate-200/70">
              {ROWS.map((r, i) => {
                const s = STATUS[r.status];
                return (
                  <div
                    key={r.name}
                    className={cn(
                      "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_86px_70px_auto]",
                      i > 0 && "border-t border-slate-100",
                      i === 1 && "bg-sky-50/50"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium text-slate-800">{r.name}</p>
                      <p className="truncate text-[10.5px] text-slate-400">{r.maker}</p>
                    </div>
                    <span className="hidden text-[11px] text-slate-500 tabular sm:block">{r.cas}</span>
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
      <div className="absolute -right-3 -bottom-8 hidden w-64 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-left shadow-[0_20px_50px_-20px_rgb(15_23_42/0.25)] backdrop-blur-xl sm:block lg:-right-10 motion-safe:animate-[float-y_6s_ease-in-out_infinite]">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-sky-700">
            <Sparkles className="size-3.5" />
            Claude AI · extracting
          </p>
          <span className="text-[10px] text-slate-400">≈30 s</span>
        </div>
        <p className="mt-2 truncate text-[12.5px] font-medium text-slate-900">Glutaraldehyde 2.5% — rev. 03/2026</p>
        <div className="relative mt-2 h-1 overflow-hidden rounded-full bg-slate-100">
          <div className="absolute inset-y-0 left-0 w-[72%] rounded-full bg-gradient-to-r from-sky-500 to-emerald-500" />
          <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent motion-safe:animate-[shimmer_1.8s_ease-in-out_infinite]" />
        </div>
        <ul className="mt-3 space-y-1.5 text-[11px]">
          {["Hazards · H314 · H331", "PPE · nitrile, goggles", "Sections · 16 / 16"].map((t) => (
            <li key={t} className="flex items-center gap-1.5 text-slate-600">
              <CheckCircle2 className="size-3 text-emerald-600" />
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
      <circle cx="20" cy="20" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
      <circle cx="20" cy="20" r={r} fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
    </svg>
  );
}
