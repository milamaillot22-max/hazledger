import { CheckCircle2, ChevronLeft, Zap } from "lucide-react";

import { GhsDiamond } from "@/components/marketing/ghs-pictogram";

/**
 * Code-rendered phone showing the label scanner on a disinfectant bottle.
 * Invented product and manufacturer; the chemical (isopropyl alcohol) is real.
 */
export function ScanPhoneMockup({ className }: { className?: string }) {
  return (
    <div
      className={className}
      role="img"
      aria-label="Phone scanning the label of a surface disinfectant spray and detecting its product name, manufacturer and hazards"
    >
      <div className="rounded-[2.2rem] bg-slate-900 p-2 shadow-2xl shadow-slate-900/30">
        <div className="overflow-hidden rounded-[1.8rem] bg-white">
          {/* status + header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-2 text-[10px] font-semibold text-slate-900">
            <span>9:41</span>
            <span className="h-4 w-16 rounded-full bg-slate-900" />
            <span>5G</span>
          </div>
          <div className="flex items-center justify-between px-4 pb-2">
            <ChevronLeft className="size-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-900">Scan label</span>
            <Zap className="size-4 text-slate-400" />
          </div>

          {/* viewfinder */}
          <div className="relative mx-2 flex aspect-[4/3.6] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-200 via-slate-100 to-sky-100">
            <div className="w-[68%] -rotate-3 rounded-lg bg-white p-2.5 shadow-md ring-1 ring-slate-200">
              <p className="text-[7px] font-bold tracking-widest text-sky-700">STERIGUARD</p>
              <p className="mt-0.5 text-[10px] leading-tight font-semibold text-slate-900">
                Surface Disinfectant Spray
              </p>
              <div className="mt-1.5 flex items-center gap-1">
                <GhsDiamond code="GHS02" className="size-4" />
                <GhsDiamond code="GHS07" className="size-4" />
                <span className="ml-1 text-[8px] font-bold text-red-600">WARNING</span>
              </div>
              <p className="mt-1 text-[7px] leading-snug text-slate-500">
                Contains isopropyl alcohol 55%. Flammable liquid and vapor. Causes eye irritation.
              </p>
            </div>
            {/* scan frame */}
            {[
              "top-3 left-3 border-t-2 border-l-2 rounded-tl-lg",
              "top-3 right-3 border-t-2 border-r-2 rounded-tr-lg",
              "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg",
              "bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg",
            ].map((c) => (
              <span key={c} className={`absolute size-6 border-sky-500 ${c}`} />
            ))}
            <span className="absolute inset-x-6 top-1/2 h-0.5 rounded-full bg-sky-500/80 shadow-[0_0_12px_2px_rgba(14,165,233,0.45)] motion-safe:animate-[scan_2.6s_ease-in-out_infinite]" />
          </div>

          {/* detection sheet */}
          <div className="space-y-1.5 px-3 pt-3 pb-4">
            {[
              ["Product", "SteriGuard Surface Disinfectant"],
              ["Manufacturer", "Brightline Health"],
              ["Hazards", "Flammable · Eye irritant"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5">
                <span className="text-[9px] text-slate-500">{k}</span>
                <span className="flex items-center gap-1 text-[9px] font-medium text-slate-900">
                  {v}
                  <CheckCircle2 className="size-3 text-success" />
                </span>
              </div>
            ))}
            <div className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-success-soft py-2 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <CheckCircle2 className="size-3.5" />
              SDS matched · revision 03/2026
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
