"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Pulls its child gently toward the cursor (max `strength` px) and springs back.
 * Disabled for coarse pointers and reduced motion via CSS (see `.magnetic`).
 */
export function Magnetic({
  children,
  strength = 6,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={ref}
      className={cn("magnetic inline-flex", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength;
        const dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength * 0.6;
        el.style.setProperty("--mx", `${dx.toFixed(2)}px`);
        el.style.setProperty("--my", `${dy.toFixed(2)}px`);
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--mx", "0px");
        ref.current?.style.setProperty("--my", "0px");
      }}
    >
      {children}
    </span>
  );
}
