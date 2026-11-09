import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="border-b border-border bg-brand-deep text-white">
      <a
        href="#faq"
        className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-[13px] font-medium sm:px-6"
      >
        <span className="rounded-sm bg-white/10 px-1.5 py-0.5 font-mono text-[11px] tracking-wide text-emerald-100">
          HAZCOM 2024
        </span>
        <span className="text-white/90">
          Suppliers are reissuing SDSs under OSHA&apos;s updated standard. Is
          your library current?
        </span>
        <ArrowRight className="hidden size-3.5 text-white/70 sm:block" />
      </a>
    </div>
  );
}
