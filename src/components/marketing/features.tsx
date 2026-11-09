import {
  BellRing,
  Boxes,
  ClipboardCheck,
  FileSearch,
  Printer,
  Users,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: FileSearch,
    title: "AI SDS scanner",
    body: "Turns any SDS or product label — photographed, scanned or PDF — into a searchable, structured record.",
  },
  {
    icon: BellRing,
    title: "Revision alerts",
    body: "Know when a dental or veterinary supplier publishes a newer SDS — before an inspector does."
  },
  {
    icon: Boxes,
    title: "Inventory by room",
    body: "Map every product to the operatory, sterilization area, lab or surgery suite where it's used.",
  },
  {
    icon: Printer,
    title: "GHS secondary labels",
    body: "Print compliant labels for decanted disinfectants and spray bottles in one click.",
  },
  {
    icon: ClipboardCheck,
    title: "Inspector mode",
    body: "Export your written HazCom program, chemical list and SDS index as one PDF.",
  },
  {
    icon: Users,
    title: "Roles & multi-site",
    body: "Owners and office managers edit, staff view. One account for every location of your practice.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        eyebrow="Platform"
        title="Everything HazCom asks of you. Nothing it doesn't."
        description="One focused tool for your SDS library and chemical inventory — built for busy practices, not for factories or EHS departments."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-slate-200/80 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-slate-200/50">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-soft">
              <Icon className="size-5 text-primary" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
