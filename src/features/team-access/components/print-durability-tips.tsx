import { Droplets } from "lucide-react";

import { cn } from "@/lib/utils";

const TIPS = [
  {
    title: "Laminate it",
    body: "Print on regular paper, then seal it in a laminating pouch or a clear sign sleeve so it can be wiped with disinfectant. A matte finish avoids glare and scans best.",
  },
  {
    title: "Or use waterproof media",
    body: "Waterproof synthetic paper or adhesive vinyl / polyester label sheets resist water and wipes. Buy sheets made for your printer type (laser or inkjet).",
  },
  {
    title: "Prefer a laser printer",
    body: "Laser toner holds up better than inkjet ink to alcohol and disinfectant wipes.",
  },
  {
    title: "Place it well",
    body: "Eye level, near where chemicals are used, away from sinks and spray zones. Keep the QR code at least 2 in (5 cm) wide.",
  },
  {
    title: "Test and replace",
    body: "Scan it with a phone once it's up. Reprint it if it gets scratched or faded — the QR code never changes unless you regenerate it.",
  },
];

/** Advice for posters that live in clinical areas (cleaned and disinfected daily). */
export function PrintDurabilityTips({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <section
      aria-labelledby="durability-title"
      className={cn("rounded-2xl border border-sky-100 bg-brand-soft/60 p-5 sm:p-6", className)}
    >
      <h2 id="durability-title" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Droplets className="size-4 text-sky-700" />
        Make your poster last in a clinical area
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        Plain paper won&apos;t survive daily cleaning and disinfection. Protect the poster so staff can always scan it.
      </p>
      <ul className={cn("mt-4 grid gap-3", compact ? "sm:grid-cols-1" : "sm:grid-cols-2")}>
        {(compact ? TIPS.slice(0, 3) : TIPS).map((t) => (
          <li key={t.title} className="rounded-xl bg-white/80 px-4 py-3 ring-1 ring-slate-200/70">
            <p className="text-sm font-semibold text-slate-900">{t.title}</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-slate-600">{t.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
