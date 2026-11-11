import { FileCheck2, FlaskConical, HeartPulse, QrCode, ShieldCheck, type LucideIcon } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

/**
 * Decorative "control interface" overlay for the hero photo: concentric rings,
 * transparent connection lines and small compliance nodes. Illustrative only
 * (aria-hidden) — every label maps to a real product capability.
 */
type Node = { angle: number; icon: LucideIcon; label: string; side: "left" | "right" };

const NODES: Node[] = [
  { angle: 205, icon: FlaskConical, label: "CAS validated", side: "left" },
  { angle: 155, icon: HeartPulse, label: "First aid first", side: "left" },
  { angle: 245, icon: FileCheck2, label: "16/16 sections", side: "left" },
  { angle: 118, icon: QrCode, label: "QR access live", side: "left" },
  { angle: 338, icon: ShieldCheck, label: "HazCom 2024", side: "right" },
];

const R = 42; // node radius, % of the HUD square

function pos(angle: number) {
  const a = (angle * Math.PI) / 180;
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
}

export function HeroHud({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute aspect-square", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id="hud-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#7dd3fc" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {/* Concentric rings */}
        <circle cx="50" cy="50" r="13" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="0.35" />
        <circle cx="50" cy="50" r="24" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="0.3" />
        <circle className="hud-spin" cx="50" cy="50" r="33" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="0.35" strokeDasharray="0.6 2.4" />
        <circle cx="50" cy="50" r={R} fill="none" stroke="#fff" strokeOpacity="0.28" strokeWidth="0.25" />
        <g className="hud-spin-rev">
          <circle cx="50" cy="50" r="18.5" fill="none" stroke="#bae6fd" strokeOpacity="0.9" strokeWidth="0.5" strokeDasharray="10 48" strokeLinecap="round" />
        </g>
        {/* Connection lines */}
        {NODES.map((n) => {
          const p = pos(n.angle);
          return (
            <g key={n.label}>
              <line x1="50" y1="50" x2={p.x} y2={p.y} stroke="url(#hud-line)" strokeWidth="0.3" strokeOpacity="0.85" />
              <line className="hud-flow" x1="50" y1="50" x2={p.x} y2={p.y} stroke="#fff" strokeWidth="0.45" strokeDasharray="1 5" strokeLinecap="round" />
              <circle cx={(50 + p.x) / 2} cy={(50 + p.y) / 2} r="0.8" fill="#fff" fillOpacity="0.9" />
            </g>
          );
        })}
      </svg>

      {/* Core */}
      <span className="glass-capsule absolute top-1/2 left-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full">
        <span className="absolute inset-0 rounded-full ring-1 ring-sky-300/60 motion-safe:animate-ping [animation-duration:3.2s]" />
        <LogoMark className="relative size-6" />
      </span>

      {/* Nodes + micro-badges */}
      {NODES.map((n, i) => {
        const p = pos(n.angle);
        const Icon = n.icon;
        return (
          <span
            key={n.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span className="glass-capsule relative flex size-9 items-center justify-center rounded-full text-sky-700">
              <Icon className="size-4" />
            </span>
            <span
              className={cn(
                "glass-capsule hud-blink absolute top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-slate-700 sm:flex",
                n.side === "left" ? "right-full mr-1.5" : "left-full ml-1.5"
              )}
              style={{ animationDelay: `${i * 0.7}s` }}
            >
              <span className="size-1.5 rounded-full bg-emerald-500" />
              {n.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
