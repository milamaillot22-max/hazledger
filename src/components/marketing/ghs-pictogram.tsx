import { Flame, FlaskConical, Skull, TriangleAlert } from "lucide-react";

import type { GhsPictogram } from "@/features/sds/types";
import { cn } from "@/lib/utils";

const ICONS: Partial<Record<GhsPictogram, typeof Flame>> = {
  GHS02: Flame,
  GHS05: FlaskConical,
  GHS06: Skull,
  GHS07: TriangleAlert,
};

const LABELS: Record<GhsPictogram, string> = {
  GHS01: "Explosive",
  GHS02: "Flammable",
  GHS03: "Oxidizer",
  GHS04: "Gas under pressure",
  GHS05: "Corrosive",
  GHS06: "Acute toxicity",
  GHS07: "Irritant",
  GHS08: "Health hazard",
  GHS09: "Environmental hazard",
};

/** Compact GHS diamond (red border on white, per GHS convention). */
export function GhsDiamond({
  code,
  className,
}: {
  code: GhsPictogram;
  className?: string;
}) {
  const Icon = ICONS[code] ?? TriangleAlert;
  return (
    <span
      title={`${code} · ${LABELS[code]}`}
      className={cn("relative inline-flex size-5 items-center justify-center", className)}
    >
      <span className="absolute inset-[2px] rotate-45 rounded-[2px] border-[1.5px] border-[#c8102e] bg-white" />
      <Icon className="relative size-2.5 text-slate-900" strokeWidth={2.5} />
      <span className="sr-only">{LABELS[code]}</span>
    </span>
  );
}
