import Image from "next/image";

import bandPhoto from "@/assets/images/fullbleed-reception.webp";
import { OSHA_PENALTIES } from "@/config/compliance";

/** Every figure maps to a published number or a shipped capability (README "Claims policy"). */
const STATS = [
  { value: `$${OSHA_PENALTIES.seriousMax.toLocaleString("en-US")}`, label: "Max OSHA penalty per serious HazCom violation (2026)" },
  { value: "≈30 s", label: "To extract a Safety Data Sheet with AI" },
  { value: "16/16", label: "SDS sections structured and searchable" },
  { value: "0", label: "Logins your staff need to reach an SDS" },
];

/** Full-width photographic band with the key figures set on the image. */
export function StatsBand() {
  return (
    <section aria-labelledby="stats-title" className="relative isolate overflow-hidden bg-slate-950">
      <Image src={bandPhoto} alt="" fill placeholder="blur" sizes="100vw" className="-z-20 object-cover object-[50%_55%]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#06213a]/85 via-[#06213a]/75 to-[#06213a]/90" />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <p className="font-mono text-[11px] tracking-[0.22em] text-sky-200/80 uppercase">Why it matters</p>
        <h2 id="stats-title" className="mt-3 max-w-2xl font-heading text-3xl leading-tight font-semibold tracking-[-0.03em] text-white sm:text-4xl">
          Built for the day OSHA walks in.
        </h2>
        <dl className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white/[0.04] px-6 py-7 backdrop-blur-sm">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-heading text-4xl font-semibold tracking-[-0.03em] text-white tabular sm:text-5xl">{s.value}</dd>
              <dd className="mt-2 text-sm leading-snug text-white/70">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
