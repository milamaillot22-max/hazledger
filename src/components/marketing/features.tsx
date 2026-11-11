import {
  BadgeCheck,
  ClipboardList,
  FileSearch,
  LockKeyhole,
  QrCode,
  Siren,
  type LucideIcon,
} from "lucide-react";

import { SpotlightCard } from "@/components/fx/spotlight-card";
import { SectionHeading } from "@/components/marketing/section-heading";

/** Shipped capabilities only; anything unreleased carries `soon`. */
const FEATURES: { icon: LucideIcon; title: string; body: string; soon?: boolean }[] = [
  {
    icon: FileSearch,
    title: "AI SDS scanner",
    body: "Turns any SDS or product label — photographed or PDF — into a searchable record with all 16 sections.",
  },
  {
    icon: BadgeCheck,
    title: "Human review, built in",
    body: "Nothing goes live until you confirm it. Invalid CAS numbers, old revisions and low-confidence fields are flagged.",
  },
  {
    icon: QrCode,
    title: "Team QR poster",
    body: "One printed code gives every employee login-free access to your SDSs — and it updates itself.",
  },
  {
    icon: Siren,
    title: "Emergency-first staff view",
    body: "First aid, spill response and PPE come first, with one-tap calls to 911 and Poison Help.",
  },
  {
    icon: LockKeyhole,
    title: "Private by design",
    body: "Files stored per clinic, hosted in the US, encrypted in transit and at rest. Staff only see confirmed SDSs.",
  },
  {
    icon: ClipboardList,
    title: "Inspection-ready report",
    body: "Print or save as PDF a dated SDS index — CAS numbers, revisions and items to check — for the day an inspector asks.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Platform"
        title="Everything HazCom asks of you. Nothing it doesn't."
        description="One focused tool for your SDS library and staff access — built for busy practices, not for factories or EHS departments."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body, soon }) => (
          <SpotlightCard
            key={title}
            className="card-soft lift rounded-3xl p-7"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft text-primary ring-1 ring-sky-100">
                <Icon className="size-5" />
              </span>
              {soon ? (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                  Coming soon
                </span>
              ) : null}
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{body}</p>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
