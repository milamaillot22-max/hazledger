import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="border-b border-sky-100 bg-brand-soft text-sky-900">
      <a
        href="#faq"
        className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-[13px] font-medium sm:px-6"
      >
        <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
          HAZCOM 2024
        </span>
        <span className="text-sky-900">
          Suppliers are reissuing SDSs under OSHA&apos;s updated standard. Is
          your library current?
        </span>
        <ArrowRight className="hidden size-3.5 text-primary sm:block" />
      </a>
    </div>
  );
}
