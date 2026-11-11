"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Card with a cursor-following border glow and a faint inner sheen.
 * Pure CSS custom properties — no re-renders on pointer move.
 * The glow is decorative; under reduced motion it stays still but visible on hover.
 */
export function SpotlightCard({
  className,
  glow = "blue",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { glow?: "blue" | "emerald" }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
        el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
      }}
      data-glow={glow}
      className={cn("spotlight-card group/spot relative isolate", className)}
      {...props}
    >
      {children}
    </div>
  );
}
