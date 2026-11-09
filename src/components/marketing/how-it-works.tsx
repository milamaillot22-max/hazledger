import { Camera, QrCode, Sparkles, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";

const STEPS: { icon: LucideIcon; title: string; body: string; meta: string }[] = [
  {
    icon: Camera,
    title: "Snap, upload or forward",
    body: "Photograph the binder page, drop in a PDF, or forward the supplier email. Bulk import handles thousands at once.",
    meta: "PDF · JPG · email",
  },
  {
    icon: Sparkles,
    title: "We extract all 16 sections",
    body: "Product, manufacturer, CAS numbers, hazard classes, PPE and first aid are structured automatically — low-confidence fields are flagged for review.",
    meta: "~30 seconds per SDS",
  },
  {
    icon: QrCode,
    title: "Post a QR code per work area",
    body: "Employees scan with any phone camera. No app, no login, no barriers to access — exactly what HazCom asks for.",
    meta: "Works on every shift",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="From filing cabinet to audit-ready in one afternoon."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, body, meta }, i) => (
            <li key={title} className="flex flex-col bg-card p-7">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-soft">
                  <Icon className="size-5 text-primary" />
                </span>
                <span className="font-mono text-xs text-slate-400">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
              <p className="mt-6 border-t border-border pt-4 font-mono text-xs text-slate-500">
                {meta}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
