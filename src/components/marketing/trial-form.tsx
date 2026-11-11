import { ArrowRight, CheckCircle2 } from "lucide-react";

import { routes, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Plain GET form to /signup — works without JavaScript and prefills the
 * email on the sign-up page. `source` is recorded on the new account.
 */
export function TrialForm({ source, className, tone = "light" }: { source: string; className?: string; tone?: "light" | "card" }) {
  return (
    <form action={routes.signup} method="get" className={cn("w-full max-w-xl", className)}>
      <input type="hidden" name="source" value={source} />
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl p-2 sm:flex-row",
          tone === "card" ? "bg-white shadow-lg ring-1 shadow-slate-200/60 ring-slate-200/80" : "bg-white/90 ring-1 ring-slate-200"
        )}
      >
        <label htmlFor={`trial-email-${source}`} className="sr-only">
          Work email
        </label>
        <input
          id={`trial-email-${source}`}
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@yourclinic.com"
          className="h-12 min-w-0 flex-1 rounded-xl bg-transparent px-4 text-[15px] text-slate-900 outline-none placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-sky-100"
        />
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[15px] font-semibold text-white shadow-sm shadow-sky-600/20 transition-colors hover:bg-primary-hover focus-visible:ring-4 focus-visible:ring-sky-200 focus-visible:outline-none"
        >
          Start {siteConfig.trialDays}-Day Clinic Trial
          <ArrowRight className="size-4" />
        </button>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600">
        {["No credit card required", "Instant access", "Cancel anytime"].map((t) => (
          <li key={t} className="flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-success" />
            {t}
          </li>
        ))}
      </ul>
    </form>
  );
}
