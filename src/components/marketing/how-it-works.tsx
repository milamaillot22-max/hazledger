import Image from "next/image";
import { Camera, QrCode, Sparkles, type LucideIcon } from "lucide-react";

import hygienePhoto from "@/assets/images/clinic-hygiene.webp";
import { ScanPhoneMockup } from "@/components/marketing/scan-phone-mockup";
import { SectionHeading } from "@/components/marketing/section-heading";

const STEPS: { icon: LucideIcon; title: string; body: string; meta: string }[] = [
  {
    icon: Camera,
    title: "Snap the label or the SDS",
    body: "Photograph a disinfectant bottle or drop in the manufacturer's PDF. On Pro, we import your existing binder for you.",
    meta: "Photo · PDF",
  },
  {
    icon: Sparkles,
    title: "We extract all 16 sections",
    body: "Product, manufacturer, CAS numbers, hazards, PPE and first aid are structured automatically. Anything uncertain is flagged for a quick review.",
    meta: "About 30 seconds per SDS",
  },
  {
    icon: QrCode,
    title: "Post a QR code in each room",
    body: "Operatories, sterilization, lab, surgery suite. Staff scan with any phone camera — no app, no login, no barriers to access.",
    meta: "Works on every shift",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-slate-200/70 bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-lg pb-16 lg:pb-0">
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-3xl ring-1 ring-slate-200/70">
            <Image
              src={hygienePhoto}
              alt="Clinic team member using a disinfectant dispenser"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 512px, 100vw"
              className="object-cover"
            />
          </div>
          <ScanPhoneMockup className="absolute right-2 -bottom-4 w-48 sm:-right-6 sm:w-56 lg:-bottom-12" />
        </div>

        <div>
          <SectionHeading
            eyebrow="How it works"
            title="From binder to inspection-ready in one afternoon."
          />
          <ol className="mt-10 space-y-6">
            {STEPS.map(({ icon: Icon, title, body, meta }, i) => (
              <li key={title} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary ring-1 ring-sky-100">
                    <Icon className="size-5" />
                  </span>
                  {i < STEPS.length - 1 ? (
                    <span className="mt-2 w-px flex-1 bg-slate-200" aria-hidden="true" />
                  ) : null}
                </div>
                <div className="pb-2">
                  <p className="text-xs font-semibold text-sky-700">Step {i + 1}</p>
                  <h3 className="mt-0.5 text-lg font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-600">{body}</p>
                  <p className="mt-2 text-xs font-medium text-slate-500">{meta}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
