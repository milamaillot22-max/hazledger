import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SpotlightCard } from "@/components/fx/spotlight-card";
import { FinalCta } from "@/components/marketing/final-cta";
import { routes, siteConfig } from "@/config/site";
import { POSTS } from "@/features/blog/posts";

const DESCRIPTION =
  "Practical guidance on OSHA Hazard Communication for dental, veterinary and medical practices: HazCom 2024 deadlines, inspection checklists and 2026 penalties.";

export const metadata: Metadata = {
  title: "Blog — OSHA HazCom guidance for clinics",
  description: DESCRIPTION,
  alternates: { canonical: routes.blog },
  openGraph: { url: routes.blog, title: `Blog | ${siteConfig.name}`, description: DESCRIPTION, siteName: siteConfig.name, type: "website" },
};

function formatPostDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function BlogIndexPage() {
  const [featured, ...rest] = POSTS;
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden="true" className="bg-aurora pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-16 sm:px-6 sm:pt-20">
          <p className="text-sm font-semibold text-primary">Resources</p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl leading-tight font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl">
            OSHA HazCom, explained for clinics.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">{DESCRIPTION}</p>

          <Link
            href={routes.blogPost(featured.slug)}
            className="card-soft group mt-12 block rounded-3xl p-7 transition-shadow duration-300 hover:shadow-[0_1px_2px_rgb(15_23_42/0.04),0_24px_48px_-20px_rgb(15_23_42/0.18)] sm:p-10"
          >
            <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
              Featured · {featured.category}
            </span>
            <h2 className="mt-3 max-w-3xl font-heading text-2xl leading-snug font-semibold tracking-[-0.02em] text-slate-900 sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-500">{featured.description}</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Read the article · {featured.readingMinutes} min
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ul className="grid gap-5 md:grid-cols-2">
          {rest.map((p) => (
            <li key={p.slug}>
              <SpotlightCard className="h-full rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-200/60">
                <p className="text-xs font-semibold tracking-wider text-primary uppercase">{p.category}</p>
                <h2 className="mt-3 font-heading text-xl leading-snug font-semibold tracking-[-0.02em] text-slate-900">
                  <Link href={routes.blogPost(p.slug)} className="after:absolute after:inset-0">
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{p.description}</p>
                <p className="mt-5 text-xs text-slate-500">
                  {formatPostDate(p.publishedAt)} · {p.readingMinutes} min read
                </p>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </section>

      <FinalCta />
    </>
  );
}
