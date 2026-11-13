import { siteConfig } from "@/config/site";

export type LegalSection = { title: string; body: (string | string[])[] };

/** Plain, readable layout for legal documents. Strings are paragraphs; arrays are bullet lists. */
export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="text-sm font-semibold text-primary">Legal</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold tracking-[-0.03em] text-slate-900">{title}</h1>
      <p className="mt-3 text-sm text-slate-500">Last updated {updated}</p>
      <p className="mt-6 text-[17px] leading-relaxed text-slate-700">{intro}</p>
      <div className="mt-10 space-y-9">
        {sections.map((s, i) => (
          <section key={s.title} aria-labelledby={`s-${i}`}>
            <h2 id={`s-${i}`} className="font-heading text-xl font-semibold tracking-tight text-slate-900">
              {i + 1}. {s.title}
            </h2>
            <div className="mt-3 space-y-3">
              {s.body.map((b, j) =>
                Array.isArray(b) ? (
                  <ul key={j} className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate-700">
                    {b.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={j} className="text-[15px] leading-relaxed text-slate-700">
                    {b}
                  </p>
                )
              )}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-12 rounded-2xl border border-slate-200/80 bg-white p-5 text-sm text-slate-600">
        Questions about this document? Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`} className="font-medium text-primary hover:underline">
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </article>
  );
}
