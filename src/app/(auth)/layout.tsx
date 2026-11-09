import type { Metadata } from "next";
import Image from "next/image";
import {
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  PawPrint,
  QrCode,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import chairPhoto from "@/assets/images/clinic-dental-chair.webp";
import { Logo } from "@/components/brand/logo";
import { Tooth } from "@/components/icons/tooth";
import { Eyebrow } from "@/components/marketing/section-heading";

export const metadata: Metadata = {
  robots: { index: false },
};

const BENEFITS = [
  {
    icon: Clock3,
    title: "Set up in 10 minutes",
    body: "Snap your existing SDS binder — we digitize and organize every sheet.",
  },
  {
    icon: QrCode,
    title: "Instant access, every room",
    body: "A QR code per operatory, lab or supply room. No app, no login.",
  },
  {
    icon: ClipboardCheck,
    title: "Inspection-ready, always",
    body: "Your HazCom program and chemical list, exported in one click.",
  },
];

const CHECKS = [
  { label: "SDS library", value: "48 sheets" },
  { label: "QR posters", value: "6 rooms" },
  { label: "Written HazCom program", value: "Up to date" },
];

const SPECIALTIES = [
  { icon: Tooth, label: "Dental" },
  { icon: PawPrint, label: "Veterinary" },
  { icon: Stethoscope, label: "Medical" },
  { icon: Sparkles, label: "Med spa" },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Form side */}
      <div className="flex flex-col px-4 py-8 sm:px-10">
        <Logo />
        <div className="flex flex-1 flex-col items-center justify-center py-10">
          <Eyebrow tone="success" className="mb-6 lg:hidden">
            <ShieldCheck className="size-3.5" />
            OSHA-ready in 10 minutes
          </Eyebrow>
          <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-7 shadow-lg shadow-slate-200/50 sm:p-10">
            {children}
          </div>
          <p className="mt-6 flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="size-3.5 text-success" />
            Encrypted · Hosted in the US · No credit card required
          </p>
        </div>
      </div>

      {/* Bright, welcoming value panel */}
      <aside className="relative hidden overflow-hidden border-l border-slate-200/70 bg-gradient-to-br from-sky-50 via-white to-emerald-50/70 lg:flex lg:flex-col lg:justify-center">
        <div className="mx-auto w-full max-w-lg px-12 py-12">
          <Eyebrow tone="success">
            <ShieldCheck className="size-3.5" />
            OSHA HazCom · 29 CFR 1910.1200
          </Eyebrow>
          <h2 className="mt-5 text-[2.5rem] leading-[1.1] font-semibold text-slate-900">
            OSHA-compliant in <span className="text-primary">10 minutes.</span>
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            The simplest way for medical, dental and veterinary practices to
            manage Safety Data Sheets — and be ready the day an inspector walks
            in.
          </p>

          {/* Clinic photo with overlapping compliance status card */}
          <div className="relative mt-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl ring-1 ring-slate-200/70">
              <Image
                src={chairPhoto}
                alt="Bright, modern dental treatment room"
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 512px, 0px"
                className="object-cover"
              />
            </div>
            <div className="relative mx-3 -mt-14 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-200/50">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-tint text-primary">
                    <Tooth className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Sunset Family Dental
                    </p>
                    <p className="text-xs text-slate-500">San Diego, CA</p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs whitespace-nowrap font-semibold text-emerald-700 ring-1 ring-emerald-100">
                  <CheckCircle2 className="size-3.5" />
                  Inspection-ready
                </span>
              </div>
              <ul className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                {CHECKS.map((c) => (
                  <li
                    key={c.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2.5 text-slate-700">
                      <CheckCircle2 className="size-4 text-success" />
                      {c.label}
                    </span>
                    <span className="text-slate-500 tabular">{c.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ul className="mt-8 space-y-4">
            {BENEFITS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary shadow-sm ring-1 ring-slate-200/80">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-slate-900">
                    {title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-slate-200/70 pt-6">
            <span className="mr-1 text-xs font-medium text-slate-500">
              Trusted workflows for
            </span>
            {SPECIALTIES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
              >
                <Icon className="size-3.5 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
