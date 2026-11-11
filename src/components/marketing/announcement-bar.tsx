import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { formatUsDate, HAZCOM_2024 } from "@/config/compliance";
import { routes } from "@/config/site";

const employerSubstances = HAZCOM_2024.milestones[1];

export function AnnouncementBar() {
  return (
    <div className="bg-night text-slate-300">
      <Link
        href={routes.blogPost("hazcom-2024-compliance-deadlines")}
        className="group mx-auto flex max-w-6xl items-center justify-center gap-2.5 px-4 py-2 text-center text-[13px] sm:px-6"
      >
        <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-emerald-300 ring-1 ring-emerald-400/20">
          HazCom 2024
        </span>
        <span>
          Employer deadline for substances:{" "}
          <span className="font-semibold text-white">{formatUsDate(employerSubstances.date)}</span>
          <span className="hidden sm:inline"> — see the full timeline</span>
        </span>
        <ArrowRight className="hidden size-3.5 text-sky-300 transition-transform group-hover:translate-x-0.5 sm:block" />
      </Link>
    </div>
  );
}
