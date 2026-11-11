import { BadgeCheck, FileText, QrCode, Sparkles, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const NODES: { icon: LucideIcon; step: string; title: string; detail: string; tone: "sky" | "emerald" }[] = [
  { icon: FileText, step: "01", title: "Label or PDF", detail: "Photo of the bottle or the manufacturer's SDS", tone: "sky" },
  { icon: Sparkles, step: "02", title: "Claude AI extraction", detail: "Hazards, PPE, CAS numbers, 16 sections · ≈30 s", tone: "sky" },
  { icon: BadgeCheck, step: "03", title: "Human review", detail: "CAS check digits, revision age, low confidence flagged", tone: "emerald" },
  { icon: QrCode, step: "04", title: "Live for your team", detail: "On the QR poster instantly — no login", tone: "emerald" },
];

/** Glass pipeline diagram for dark surfaces. Connector motion is motion-safe. */
export function ComplianceFlow({ className }: { className?: string }) {
  return (
    <ol className={cn("relative grid gap-4 lg:grid-cols-4 lg:gap-5", className)} aria-label="How an SDS goes from document to your team">
      {NODES.map(({ icon: Icon, step, title, detail, tone }, i) => (
        <li key={title} className="relative">
          <div className="glass-night relative h-full rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl ring-1",
                  tone === "sky" ? "bg-sky-400/10 text-sky-300 ring-sky-400/20" : "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20"
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="font-heading text-xs font-medium text-slate-500">{step}</span>
            </div>
            <p className="mt-4 font-heading text-[15px] font-semibold tracking-tight text-white">{title}</p>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{detail}</p>
          </div>
          {i < NODES.length - 1 ? (
            <svg aria-hidden="true" className="absolute top-1/2 -right-5 z-10 hidden h-2 w-5 -translate-y-1/2 lg:block" viewBox="0 0 20 8">
              <line x1="0" y1="4" x2="20" y2="4" stroke="url(#flow-grad)" strokeWidth="1.5" strokeDasharray="3 3" className="motion-safe:animate-[dash-flow_1.2s_linear_infinite]" />
              <defs>
                <linearGradient id="flow-grad" x1="0" x2="1">
                  <stop offset="0" stopColor="#38bdf8" />
                  <stop offset="1" stopColor="#34d399" />
                </linearGradient>
              </defs>
            </svg>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
