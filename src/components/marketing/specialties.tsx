import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SpotlightCard } from "@/components/fx/spotlight-card";
import { SECTOR_ICON } from "@/components/marketing/navbar";
import { SectionHeading } from "@/components/marketing/section-heading";
import { routes } from "@/config/site";
import { SOLUTIONS } from "@/features/solutions/data";

export function Specialties() {
  return (
    <section id="specialties" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Built for your specialty"
        title="Made for the chemicals your practice actually uses."
        description="Every specialty stocks different hazards. Pick yours to see what's covered from day one."
      />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {SOLUTIONS.map((s) => {
          const Icon = SECTOR_ICON[s.sector];
          return (
            <SpotlightCard
              key={s.slug}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-primary ring-1 ring-sky-100">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight text-slate-900">{s.name}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{s.pains[0].body}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Typical products on file">
                {s.chemicals.slice(0, 4).map((c) => (
                  <li key={c.name} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {c.name.split(/[,(&]/)[0].trim()}
                  </li>
                ))}
              </ul>
              <Link
                href={routes.solution(s.slug)}
                className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-primary after:absolute after:inset-0 hover:underline"
              >
                Explore {s.name.toLowerCase()}
                <ArrowRight className="size-4" />
              </Link>
            </SpotlightCard>
          );
        })}
      </div>
    </section>
  );
}
