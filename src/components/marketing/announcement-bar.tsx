import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { DeadlineCountdown } from "@/components/marketing/deadline-countdown";
import { formatUsDate, HAZCOM_2024 } from "@/config/compliance";
import { routes } from "@/config/site";

/** Employer deadline for substances under HCS 2024 (91 FR 1695). */
const employerSubstances = HAZCOM_2024.milestones[1];

/**
 * Institutional top bar: the federal HCS 2024 deadline, a live day countdown
 * (client-side) and two direct paths — the fine-risk calculator and pricing.
 */
export function AnnouncementBar() {
  const date = formatUsDate(employerSubstances.date);
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-sky-900 via-sky-800 to-sky-700 text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/20" />
      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-[12.5px] sm:px-6 sm:text-[13px]">
        <p className="flex min-w-0 items-center gap-2">
          <Zap className="size-3.5 shrink-0 text-amber-300" fill="currentColor" aria-hidden="true" />
          <span className="min-w-0 text-sky-50">
            <span className="hidden md:inline">Federal OSHA HazCom 2024 deadline for employers: </span>
            <span className="md:hidden">HazCom 2024: </span>
            <span className="whitespace-nowrap">
              <Link
                href={routes.blogPost("hazcom-2024-compliance-deadlines")}
                title={`${employerSubstances.who} — ${employerSubstances.what}`}
                className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
              >
                {date}
              </Link>
              <DeadlineCountdown date={employerSubstances.date} />
            </span>
            <span className="hidden xl:inline"> — secure your clinic today.</span>
          </span>
        </p>
        <span className="flex shrink-0 items-center gap-2">
          <Link
            href="/#calculator"
            className="group inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 font-semibold text-sky-900 shadow-sm transition-colors hover:bg-sky-50"
          >
            <span className="hidden sm:inline">Check your fine risk</span>
            <span className="sm:hidden">Your risk</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={routes.pricing}
            className="hidden rounded-full px-2.5 py-0.5 font-medium text-white ring-1 ring-white/35 transition-colors hover:bg-white/10 sm:inline-flex"
          >
            See pricing
          </Link>
        </span>
      </div>
    </div>
  );
}
