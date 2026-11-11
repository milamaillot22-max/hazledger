import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {SOLUTIONS.map((s) => {
          const Icon = SECTOR_ICON[s.sector];
          return (
            <article
              key={s.slug}
              className="card-soft group relative flex flex-col overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-[0_1px_2px_rgb(15_23_42/0.04),0_28px_56px_-24px_rgb(15_23_42/0.25)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.photo}
                  alt={s.photoAlt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 768px) 370px, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 flex size-10 items-center justify-center rounded-xl bg-white/95 text-primary shadow-sm backdrop-blur">
                  <Icon className="size-5" />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-lg font-semibold tracking-tight text-slate-900">{s.name}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{s.pains[0].body}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Typical products on file">
                  {s.chemicals.slice(0, 4).map((c) => (
                    <li key={c.name} className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-sky-800 ring-1 ring-sky-100">
                      {c.name.split(/[,(&]/)[0].trim()}
                    </li>
                  ))}
                </ul>
                <Link
                  href={routes.solution(s.slug)}
                  className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-primary after:absolute after:inset-0 hover:underline"
                >
                  Explore {s.name.toLowerCase()}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
