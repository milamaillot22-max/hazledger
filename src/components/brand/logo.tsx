import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Small neutral symbol (ledger frame) for tight spaces — app chrome, posters.
 * Inherits text color; no accent color.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn("size-6", className)}>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="4.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.75 9.25h8.5M7.75 12.5h8.5M7.75 15.75h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Primary logo: a sober, typographic wordmark. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "inline-flex items-center rounded-md text-slate-900 outline-none focus-visible:ring-3 focus-visible:ring-sky-200",
        className
      )}
    >
      <span className="font-heading text-[19px] font-semibold tracking-[-0.035em]">{siteConfig.name}</span>
    </Link>
  );
}
