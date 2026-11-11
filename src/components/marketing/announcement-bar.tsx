import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import textureSource from "@/assets/images/clinic-dental-operatory.webp";
import { DeadlineCountdown } from "@/components/marketing/deadline-countdown";
import { formatUsDate, HAZCOM_2024 } from "@/config/compliance";
import { routes } from "@/config/site";

/** Employer deadline for substances under HCS 2024 (91 FR 1695). */
const employerSubstances = HAZCOM_2024.milestones[1];

/**
 * Institutional top header: deep night-blue over a muted clinic photograph,
 * fine grain, the federal HazCom 2024 deadline with a live countdown
 * (client-side) and direct paths to the risk calculator and pricing.
 */
export function AnnouncementBar() {
  const date = formatUsDate(employerSubstances.date);
  return (
    <div className="bg-grain relative isolate overflow-hidden bg-[#06182f] text-white">
      <Image
        src={textureSource}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[50%_45%] opacity-40 mix-blend-luminosity"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#051428]/95 via-[#0a2648]/85 to-[#0b3460]/75" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6 md:py-2.5">
        <div className="min-w-0">
          <p className="hidden font-mono text-[10px] tracking-[0.22em] text-sky-200/80 uppercase md:block">
            OSHA HazCom 2024 · Federal deadline · Dental · Veterinary · Medical
          </p>
          <p className="flex flex-wrap items-center gap-x-2 text-[12.5px] text-sky-50 md:mt-0.5 md:text-[15px]">
            <span className="hidden md:inline md:font-heading md:font-medium md:tracking-tight">Employers must comply by</span>
            <span className="md:hidden">HazCom 2024:</span>
            <span className="whitespace-nowrap">
              <Link
                href={routes.blogPost("hazcom-2024-compliance-deadlines")}
                title={`${employerSubstances.who} — ${employerSubstances.what}`}
                className="font-semibold text-white underline decoration-white/35 underline-offset-[3px] hover:decoration-white md:font-heading"
              >
                {date}
              </Link>
              <DeadlineCountdown date={employerSubstances.date} />
            </span>
            <span className="hidden text-sky-100/80 xl:inline">— secure your clinic today.</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 text-[12.5px] md:text-[13px]">
          <Link
            href="/#calculator"
            className="group inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-[#0a2648] shadow-sm transition-colors hover:bg-sky-50"
          >
            <span className="hidden sm:inline">Check your fine risk</span>
            <span className="sm:hidden">Your risk</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={routes.pricing}
            className="hidden rounded-full px-3 py-1 font-medium text-white ring-1 ring-white/30 backdrop-blur-sm transition-colors hover:bg-white/10 sm:inline-flex"
          >
            See pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
