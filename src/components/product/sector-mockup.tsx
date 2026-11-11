import { CheckCircle2, Clock3, QrCode } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import type { Solution } from "@/features/solutions/data";
import { cn } from "@/lib/utils";

/** Compact library preview built from a solution's own chemical list. */
export function SectorMockup({ solution, className }: { solution: Solution; className?: string }) {
  const rows = solution.chemicals.slice(0, 5);
  return (
    <div className={cn("relative", className)} role="img" aria-label={`SDS library preview for ${solution.name.toLowerCase()}`}>
      <div className="card-soft overflow-hidden rounded-2xl shadow-[0_1px_2px_rgb(15_23_42/0.04),0_24px_60px_-28px_rgb(15_23_42/0.2)]">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/60 px-4 py-3">
          <span className="flex items-center gap-2 text-slate-900">
            <LogoMark className="size-4" />
            <span className="font-heading text-[13px] font-semibold tracking-tight">SDS library</span>
          </span>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-medium text-emerald-700 ring-1 ring-emerald-100">
            Inspection-ready
          </span>
        </div>
        <ul>
          {rows.map((c, i) => {
            const review = i === 1;
            return (
              <li key={c.name} className={cn("flex items-center gap-3 px-4 py-2.5", i > 0 && "border-t border-slate-100")}>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium text-slate-800">{c.name}</p>
                  <p className="truncate text-[10.5px] text-slate-400">{c.note}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1",
                    review ? "bg-amber-50 text-amber-700 ring-amber-100" : "bg-emerald-50 text-emerald-700 ring-emerald-100"
                  )}
                >
                  {review ? <Clock3 className="size-3" /> : <CheckCircle2 className="size-3" />}
                  {review ? "Review" : "Current"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="absolute -bottom-7 -left-4 flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-[0_16px_40px_-16px_rgb(15_23_42/0.25)] backdrop-blur-xl sm:-left-8">
        <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-primary ring-1 ring-sky-100">
          <QrCode className="size-[18px]" />
        </span>
        <div>
          <p className="text-[12px] font-semibold text-slate-900">Team QR poster</p>
          <p className="text-[10.5px] text-slate-500">{solution.rooms.slice(0, 3).join(" · ")}</p>
        </div>
      </div>
    </div>
  );
}
