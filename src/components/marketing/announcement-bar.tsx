import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { formatUsDate, HAZCOM_2024 } from "@/config/compliance";
import { routes } from "@/config/site";

const employerSubstances = HAZCOM_2024.milestones[1];

export function AnnouncementBar() {
  return (
    <div className="border-b border-slate-200/70 bg-white">
      <Link
        href={routes.blogPost("hazcom-2024-compliance-deadlines")}
        className="group mx-auto flex max-w-6xl items-center justify-center gap-2.5 px-4 py-2 text-center text-[13px] text-slate-600 sm:px-6"
      >
        <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
          HazCom 2024
        </span>
        <span>
          Employer deadline for substances:{" "}
          <span className="font-semibold text-slate-900">{formatUsDate(employerSubstances.date)}</span>
          <span className="hidden sm:inline"> — see the full timeline</span>
        </span>
        <ArrowRight className="hidden size-3.5 text-primary transition-transform group-hover:translate-x-0.5 sm:block" />
      </Link>
    </div>
  );
}
