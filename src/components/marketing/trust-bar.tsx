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

const INDUSTRIES = [
  "Manufacturing",
  "Construction",
  "Auto & fleet",
  "Facilities",
  "Labs",
  "Janitorial",
  "Agriculture",
];

export function TrustBar() {
  return (
    <section aria-label="Compliance and security" className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {BADGES.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-center gap-3 px-2 py-5 lg:px-5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                <Icon className="size-4 text-primary" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{title}</span>
                <span className="block text-xs text-muted-foreground">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-border py-4 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Built for teams in</span>
          {INDUSTRIES.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
