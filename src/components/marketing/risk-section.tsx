import { SectionHeading } from "@/components/marketing/section-heading";
import { OSHA_PENALTIES } from "@/config/compliance";

const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

const STATS = [
  {
    value: "Top 10",
    label: "Hazard Communication ranks among OSHA's most-cited standards year after year.",
  },
  {
    value: usd(OSHA_PENALTIES.seriousMax),
    label: `Maximum OSHA penalty per serious violation in ${OSHA_PENALTIES.effectiveYear} — each missing or outdated SDS can count.`,
  },
  {
    value: usd(OSHA_PENALTIES.willfulOrRepeatedMax),
    label: "Maximum penalty per willful or repeated violation.",
  },
];

export function RiskSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-12">
        <SectionHeading
          eyebrow="Why it matters"
          title="An outdated SDS binder is a citation waiting to happen."
          description="OSHA requires an SDS for every hazardous chemical in your practice — disinfectants, etchants, fixatives, anesthetic gases — readily accessible to your team on every shift. Paper binders go missing, go stale, and never make it to the second location."
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
