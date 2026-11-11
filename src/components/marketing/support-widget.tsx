"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Calculator, CalendarClock, Mail, MessageCircle, Tag, X } from "lucide-react";

import { LogoMark } from "@/components/brand/logo";
import { routes, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { icon: CalendarClock, label: "When is the HazCom 2024 deadline?", href: routes.blogPost("hazcom-2024-compliance-deadlines") },
  { icon: Calculator, label: "What could a citation cost my clinic?", href: "/#calculator" },
  { icon: Tag, label: "Which plan fits my practice?", href: routes.pricing },
];

/**
 * Discreet "ask us" pill, bottom-right. It routes to real answers (articles,
 * calculator, pricing) and to email — it does not pretend to be a live chat.
 * When a staffed chat tool is added, swap the email action for it.
 */
export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const mailto = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent("OSHA HazCom question for HazLedger")}`;

  return (
    <div className="fixed right-4 bottom-24 z-40 flex flex-col items-end gap-3 print:hidden md:right-6 md:bottom-6">
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="card-soft w-[min(22rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl shadow-[0_1px_2px_rgb(15_23_42/0.05),0_30px_60px_-24px_rgb(15_23_42/0.35)] outline-none motion-safe:animate-[widget-in_220ms_cubic-bezier(0.22,1,0.36,1)]"
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80">
                <LogoMark className="size-6" />
              </span>
              <div>
                <p id={titleId} className="font-heading text-[15px] font-semibold tracking-tight text-slate-900">
                  Questions about OSHA compliance?
                </p>
                <p className="text-xs text-slate-500">Ask the {siteConfig.name} team</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close"
              className="rounded-md p-1 text-slate-400 hover:bg-white hover:text-slate-700"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="px-5 py-4">
            <p className="text-[13px] leading-relaxed text-slate-600">
              We help dental, veterinary and medical practices with SDS and HazCom questions. Start with a quick answer:
            </p>
            <ul className="mt-3 space-y-1.5">
              {QUICK_LINKS.map(({ icon: Icon, label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-700 ring-1 ring-slate-200/80 transition-colors hover:bg-sky-50/60 hover:text-slate-900 hover:ring-sky-200"
                  >
                    <Icon className="size-4 shrink-0 text-primary" />
                    <span className="flex-1">{label}</span>
                    <ArrowRight className="size-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={mailto}
              className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-primary text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-10px_rgb(2_132_199/0.6)] hover:bg-primary-hover"
            >
              <Mail className="size-4" />
              Email your question
            </a>
            <p className="mt-2.5 text-center text-[11px] leading-snug text-slate-400">
              {siteConfig.contactEmail} · General information, not legal advice.
            </p>
          </div>
        </div>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close compliance questions" : "Questions about OSHA compliance? Ask us"}
        className={cn(
          "lift group flex items-center gap-3 rounded-full bg-white/95 py-2 pr-2 pl-2 shadow-[0_1px_2px_rgb(15_23_42/0.06),0_16px_36px_-14px_rgb(15_23_42/0.35)] ring-1 ring-slate-200/80 backdrop-blur-xl sm:pr-5",
          open && "ring-sky-200"
        )}
      >
        <span className="relative flex size-10 items-center justify-center rounded-full bg-primary text-white">
          <span aria-hidden="true" className="absolute inset-0 rounded-full bg-primary/40 motion-safe:animate-ping [animation-duration:2.8s]" />
          {open ? <X className="relative size-[18px]" /> : <MessageCircle className="relative size-[18px]" />}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-[13px] leading-tight font-semibold text-slate-900">Compliance questions?</span>
          <span className="block text-[11.5px] leading-tight text-slate-500">Ask our team — we reply by email</span>
        </span>
      </button>
    </div>
  );
}
