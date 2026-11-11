import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const TONES = {
  sky: "from-sky-300 via-sky-500 to-sky-700 shadow-[0_12px_24px_-10px_rgb(2_132_199/0.7),inset_0_1px_0_rgb(255_255_255/0.6),inset_0_-4px_8px_rgb(7_89_133/0.55)]",
  emerald:
    "from-emerald-300 via-emerald-500 to-emerald-700 shadow-[0_12px_24px_-10px_rgb(5_150_105/0.7),inset_0_1px_0_rgb(255_255_255/0.6),inset_0_-4px_8px_rgb(6_78_59/0.55)]",
} as const;

/** Glossy, dimensional icon tile (CSS only) — a "3D icon" look without image assets. */
export function Icon3D({
  icon: Icon,
  tone = "sky",
  className,
}: {
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-white",
        TONES[tone],
        className
      )}
    >
      <span className="absolute inset-x-1 top-0.5 h-1/2 rounded-t-[0.9rem] bg-gradient-to-b from-white/50 to-transparent" />
      <span className="absolute -right-2 -bottom-3 size-8 rounded-full bg-white/15 blur-md" />
      <Icon className="relative size-6 drop-shadow-[0_2px_2px_rgb(15_23_42/0.35)]" strokeWidth={2.1} />
    </span>
  );
}
