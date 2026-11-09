import type { Metadata } from "next";
import { Check } from "lucide-react";

import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  robots: { index: false },
};

const POINTS = [
  "Unlimited SDS uploads during your trial",
  "Free import of your existing binders",
  "QR access for every work area",
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(420px,0.9fr)]">
      <div className="flex flex-col px-4 py-8 sm:px-10">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      <aside className="hidden flex-col justify-end bg-brand-deep p-12 text-white lg:flex">
        <p className="font-mono text-xs tracking-[0.08em] text-emerald-200/70 uppercase">
          OSHA HazCom · 29 CFR 1910.1200
        </p>
        <h2 className="mt-4 max-w-md text-3xl leading-tight font-bold">
          Every Safety Data Sheet, one scan away.
        </h2>
        <ul className="mt-8 space-y-3 text-sm text-emerald-50/85">
          {POINTS.map((p) => (
            <li key={p} className="flex items-center gap-2.5">
              <Check className="size-4 text-emerald-300" strokeWidth={2.5} />
              {p}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
