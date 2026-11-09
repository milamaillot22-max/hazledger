import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Medical-blue tile with a document and an emerald compliance check. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className={cn("size-7", className)}>
      <rect width="28" height="28" rx="8" className="fill-primary" />
      <path
        d="M9.5 7.5h6l3.5 3.5v9.5h-9.5z"
        fill="white"
        fillOpacity="0.95"
      />
      <path d="M15.5 7.5V11H19" fill="none" stroke="#bae6fd" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="19.5" cy="19.5" r="5" fill="#059669" stroke="white" strokeWidth="1.5" />
      <path
        d="m17.4 19.6 1.4 1.4 2.8-2.8"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        className
      )}
    >
      <LogoMark />
      <span className="font-heading text-[17px] font-bold text-slate-900">
        {siteConfig.name}
      </span>
    </Link>
  );
}
