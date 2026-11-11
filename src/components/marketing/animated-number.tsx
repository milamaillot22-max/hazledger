"use client";

import { useEffect, useRef, useState } from "react";

/** Eases from the previous value to the new one; instant under reduced motion. */
export function AnimatedNumber({
  value,
  format,
  duration = 450,
}: {
  value: number;
  format: (n: number) => string;
  duration?: number;
}) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = reduce ? 1 : Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = start + (value - start) * eased;
      setShown(next);
      from.current = next;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className="tabular">{format(shown)}</span>;
}
