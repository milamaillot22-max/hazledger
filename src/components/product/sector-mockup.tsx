import { CheckCircle2, Clock3, QrCode } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import type { Solution } from "@/features/solutions/data";
import { cn } from "@/lib/utils";

/** Compact dark library preview built from a solution's own chemical list. */
export function SectorMockup({ solution, className }: { solution: Solution; className?: string }) {
  const rows = solution.chemicals.slice(0, 5);
  return (
    <div className={cn("relative", className)} role="img" aria-label={`SDS library preview for ${solution.name.toLowerCase()}`}>
      <div aria-hidden="true" className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(55%_55%_at_50%_45%,rgb(56_189_248/0.25),transparent_70%)] blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1220]/95 shadow-[0_30px_90px_-30px_rgb(0_0_0/0.8)]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <span className="flex items-center gap-2 text-white">
            <LogoMark className="size-4" />
            <span className="font-heading text-[13px] font-semibold tracking-tight">SDS library</span>
          </span>
          <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10.5px] font-medium text-emerald-300 ring-1 ring-emerald-400/20">
            Inspection-ready
          </span>
        </div>
        <ul>
          {rows.map((c, i) => {
            const review = i === 1;
            return (
              <li key={c.name} className={cn("flex items-center gap-3 px-4 py-2.5", i > 0 && "border-t border-white/[0.05]")}>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-medium text-slate-100">{c.name}</p>
                  <p className="truncate text-[10.5px] text-slate-500">{c.note}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1",
                    review ? "bg-amber-400/10 text-amber-300 ring-amber-400/20" : "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20"
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
      <div className="glass-night absolute -bottom-7 -left-4 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-8">
        <span className="flex size-9 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300 ring-1 ring-sky-400/20">
          <QrCode className="size-[18px]" />
        </span>
        <div>
          <p className="text-[12px] font-semibold text-white">Team QR poster</p>
          <p className="text-[10.5px] text-slate-400">{solution.rooms.slice(0, 3).join(" · ")}</p>
        </div>
      </div>
    </div>
  );
}
