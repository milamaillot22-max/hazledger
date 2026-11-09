import { SectionHeading } from "@/components/marketing/section-heading";

/**
 * Figures are deliberately floors ("$16,000+") so they stay true after OSHA's
 * yearly inflation adjustment. Re-check osha.gov/penalties before launch.
 */
const STATS = [
  {
    value: "Top 10",
    label: "Hazard Communication ranks among OSHA's most-cited standards year after year.",
  },
  {
    value: "$16,000+",
    label: "Maximum penalty per serious violation — each missing or outdated SDS can count.",
  },
  {
    value: "$165,000+",
    label: "Maximum penalty per willful or repeated violation.",
  },
];

export function RiskSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-12">
        <SectionHeading
          eyebrow="The cost of a binder"
          title="An outdated SDS is a citation waiting to happen."
          description="OSHA requires an SDS for every hazardous chemical, readily accessible to employees during every shift. Paper binders go missing, go stale, and never cover the night crew."
        />
        <dl className="grid gap-4 md:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.value} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <p className="font-heading text-4xl font-semibold text-slate-900 tabular">
                  {s.value}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.label}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
