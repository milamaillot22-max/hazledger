import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import bannerPhoto from "@/assets/images/banner-apothecary.webp";
import { DeadlineCountdown } from "@/components/marketing/deadline-countdown";
import { formatUsDate, HAZCOM_2024 } from "@/config/compliance";
import { routes } from "@/config/site";

/** Employer deadline for substances under HCS 2024 (91 FR 1695). */
const employerSubstances = HAZCOM_2024.milestones[1];

/**
 * Photographic banner above the navigation: an editorial still life with the
 * title set on the photo, the federal HazCom 2024 deadline (live countdown,
 * client-side) and direct paths to the risk calculator and pricing.
 */
export function AnnouncementBar() {
  const date = formatUsDate(employerSubstances.date);
  return (
    <div className="relative isolate overflow-hidden bg-slate-900 text-white">
      <Image
        src={bannerPhoto}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover object-[50%_58%]"
      />
      {/* Warm legibility wash: deep on the left (text), clear on the right (photo). */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1a120b]/80 via-[#1a120b]/35 to-transparent" />

      <div className="mx-auto flex min-h-[124px] max-w-6xl items-end justify-between gap-6 px-4 pt-6 pb-5 sm:px-6 md:min-h-[168px] md:pb-7">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] tracking-[0.2em] text-[#f3e6d0]/85 uppercase sm:text-[10.5px]">
            <span className="hidden sm:inline">OSHA HazCom 2024 · Employer deadline</span>
            <span className="sm:hidden">HazCom 2024</span>
            <Link
              href={routes.blogPost("hazcom-2024-compliance-deadlines")}
              title={`${employerSubstances.who} — ${employerSubstances.what}`}
              className="text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
            >
              {date}
            </Link>
            <DeadlineCountdown date={employerSubstances.date} />
          </p>
          <p className="mt-2 font-heading text-[22px] leading-[1.15] font-medium tracking-[-0.025em] text-balance text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.35)] sm:text-[26px] lg:text-[31px]">
            Every Safety Data Sheet, current and one scan away.
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 text-[13px] sm:flex">
          <Link
            href="/#calculator"
            className="group inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 font-semibold text-slate-900 shadow-sm transition-colors hover:bg-sky-50"
          >
            Check your fine risk
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={routes.pricing}
            className="rounded-full px-3.5 py-1.5 font-medium text-white ring-1 ring-white/40 backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            See pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
