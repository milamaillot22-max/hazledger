import {
  FileCheck2,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  Tags,
  type LucideIcon,
} from "lucide-react";

const BADGES: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: ShieldCheck, title: "29 CFR 1910.1200", detail: "HazCom-aligned workflows" },
  { icon: Tags, title: "GHS-formatted", detail: "Labels & 16-section SDS" },
  { icon: Landmark, title: "US data residency", detail: "Hosted in US data centers" },
  { icon: LockKeyhole, title: "Encrypted", detail: "In transit & at rest" },
  { icon: FileCheck2, title: "Audit trail", detail: "Every change, timestamped" },
];

const SPECIALTIES = [
  "Dental",
  "Orthodontics",
  "Oral surgery",
  "Veterinary",
  "Dermatology",
  "Med spas",
  "Urgent care",
  "Optometry",
];

export function TrustBar() {
  return (
    <section aria-label="Compliance and security" className="border-y border-slate-200/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {BADGES.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-center gap-3 px-2 py-5 lg:px-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success-soft ring-1 ring-emerald-100">
                <Icon className="size-[18px] text-success" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{title}</span>
                <span className="block text-xs text-muted-foreground">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border py-4 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Built for practices in</span>
          {SPECIALTIES.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
