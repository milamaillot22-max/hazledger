"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { routes, siteConfig } from "@/config/site";
import { SOLUTIONS } from "@/features/solutions/data";

const SECTIONS = [
  { title: "Product", links: [{ label: "Overview", href: routes.product }, { label: "Pricing", href: routes.pricing }] },
  { title: "Solutions", links: SOLUTIONS.map((s) => ({ label: s.name, href: routes.solution(s.slug) })) },
  { title: "Resources", links: [{ label: "Blog", href: routes.blog }] },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // Close when the route changes (state adjusted during render, no effect needed).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="flex size-10 items-center justify-center rounded-lg text-slate-200 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:outline-none"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div id="mobile-menu" className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-white/10 bg-night px-4 pt-6 pb-10">
          <nav aria-label="Mobile" className="space-y-7">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{section.title}</p>
                <ul className="mt-2">
                  {section.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="block py-2.5 text-lg font-medium text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="mt-8 grid gap-3">
            <Link
              href={siteConfig.links.startTrial}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-white font-semibold text-night"
            >
              Start {siteConfig.trialDays}-day trial
              <ArrowRight className="size-4" />
            </Link>
            <Link href={siteConfig.links.signIn} className="flex h-12 items-center justify-center rounded-xl font-medium text-slate-300 ring-1 ring-white/15">
              Sign in
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
