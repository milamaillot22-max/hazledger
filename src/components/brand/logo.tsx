import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Document-with-check mark. Solid emerald, no gradients. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-6", className)}
    >
      <rect width="24" height="24" rx="6" className="fill-primary" />
      <path
        d="M8 6.5h5.5L17 10v7.5H8z"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m10.25 13.5 1.5 1.5 3-3"
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
        "inline-flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/40",
        className
      )}
    >
      <LogoMark />
      <span className="font-heading text-[17px] font-bold tracking-tight text-foreground">
        {siteConfig.name}
      </span>
    </Link>
  );
}
