"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { routes } from "@/config/site";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: routes.dashboard, label: "Overview", exact: true },
  { href: routes.sdsLibrary, label: "SDS library", exact: false },
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="App" className="flex items-center gap-1">
      {ITEMS.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || (pathname.startsWith(`${item.href}/`) && !pathname.startsWith(routes.sdsScan));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-brand-soft text-sky-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
