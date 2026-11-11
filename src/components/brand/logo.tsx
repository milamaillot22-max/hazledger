import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Brand symbol: a hairline ledger frame (the register), two ruled entries,
 * and a small emerald seal (the verified record). Inherits text color.
 */
export function LogoMark({ className, seal = true }: { className?: string; seal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn("size-6", className)}>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.25" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7.5 9h9M7.5 12.25h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      {seal ? <rect x="14.5" y="14.5" width="3" height="3" rx="0.75" fill="#10b981" /> : null}
    </svg>
  );
}

export function Logo({
  className,
  tone = "light",
}: {
  className?: string;
  /** `dark` = placed on a dark surface. */
  tone?: "light" | "dark";
}) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-sky-400/40",
        tone === "dark" ? "text-white" : "text-slate-900",
        className
      )}
    >
      <LogoMark className="size-[22px]" />
      <span className="font-heading text-[17px] font-semibold tracking-[-0.03em]">{siteConfig.name}</span>
    </Link>
  );
}
