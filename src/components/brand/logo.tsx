import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Brand symbol: a compliance shield holding three ledger lines, with a small
 * emerald check seal. Solid fills only (no gradient ids), so any number of
 * instances can render on one page — app chrome, posters, mockups.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn("size-6 shrink-0", className)}>
      {/* Shield */}
      <path
        d="M16 2.75 26.25 6.4v8.1c0 6.55-4.25 12.1-10.25 14.25C10 26.6 5.75 21.05 5.75 14.5V6.4L16 2.75Z"
        fill="#0284C7"
      />
      {/* Soft top highlight for depth */}
      <path d="M16 2.75 26.25 6.4v3.1L16 5.85 5.75 9.5V6.4L16 2.75Z" fill="#fff" fillOpacity="0.16" />
      {/* Ledger lines */}
      <path d="M11 11.25h10M11 15h10M11 18.75h5.5" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
      {/* Check seal */}
      <circle cx="24.25" cy="23.75" r="5.25" fill="#059669" stroke="#fff" strokeWidth="1.75" />
      <path d="m21.9 23.8 1.6 1.6 3-3.15" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Primary logotype: symbol + wordmark, with an optional discreet badge.
 * The badge names the standard, not OSHA itself — OSHA does not certify or
 * endorse software (see README "Claims policy").
 */
export function Logo({ className, badge = false }: { className?: string; badge?: boolean }) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} home`}
      className={cn(
        "group/logo inline-flex items-center gap-2.5 rounded-lg text-slate-900 outline-none focus-visible:ring-3 focus-visible:ring-sky-200",
        className
      )}
    >
      <LogoMark className="size-[30px] transition-transform duration-300 group-hover/logo:-rotate-3" />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[19px] font-semibold tracking-[-0.04em]">
          Haz<span className="text-sky-700">Ledger</span>
        </span>
        <span className="mt-1 text-[9.5px] font-medium tracking-[0.16em] text-slate-400 uppercase">SDS Compliance</span>
      </span>
      {badge ? (
        <span
          title="Built for the updated OSHA Hazard Communication Standard (HCS 2024)"
          className="ml-1 hidden items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 ring-1 ring-emerald-100 xl:inline-flex"
        >
          <BadgeCheck className="size-3" aria-hidden="true" />
          HazCom 2024 Ready
        </span>
      ) : null}
    </Link>
  );
}
