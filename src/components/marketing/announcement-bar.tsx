import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { DeadlineCountdown } from "@/components/marketing/deadline-countdown";
import { formatUsDate, HAZCOM_2024 } from "@/config/compliance";
import { routes } from "@/config/site";

/** Employer deadline for substances under HCS 2024 (91 FR 1695). */
const employerSubstances = HAZCOM_2024.milestones[1];

/**
 * Thin urgency / reassurance bar above the navbar. The date comes from
 * config/compliance.ts; the countdown renders client-side only.
 */
export function AnnouncementBar() {
  const date = formatUsDate(employerSubstances.date);
  return (
    <div className="relative overflow-hidden border-b border-amber-100/80 bg-gradient-to-r from-amber-50/80 via-white to-sky-50/80">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-[12.5px] text-slate-700 sm:px-6 sm:text-[13px]">
        <p className="flex min-w-0 items-center gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 ring-1 ring-amber-200/70">
            <Zap className="size-3" fill="currentColor" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="hidden md:inline">Federal OSHA HCS 2024 compliance deadline: </span>
            <span className="md:hidden">HCS 2024: </span>
            <span className="whitespace-nowrap">
            <Link
              href={routes.blogPost("hazcom-2024-compliance-deadlines")}
              title={`${employerSubstances.who} — ${employerSubstances.what}`}
              className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-500"
            >
              {date}
            </Link>
            <DeadlineCountdown date={employerSubstances.date} />
            </span>
            <span className="hidden lg:inline"> — Secure your clinic today.</span>
          </span>
        </p>
        <span className="hidden h-3.5 w-px bg-slate-300/80 sm:block" aria-hidden="true" />
        <span className="flex shrink-0 items-center gap-3">
          <Link
            href="/#calculator"
            className="group inline-flex items-center gap-1 font-semibold text-primary hover:text-primary-hover"
          >
            <span className="hidden sm:inline">Check your fine risk</span>
            <span className="sm:hidden">Your risk</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href={routes.pricing} className="hidden font-medium text-slate-600 hover:text-slate-900 sm:inline">
            See pricing
          </Link>
        </span>
      </div>
    </div>
  );
}
