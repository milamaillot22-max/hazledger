import { ArrowRight, CheckCircle2 } from "lucide-react";

import { routes, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Tone = "light" | "card" | "night";

/**
 * Plain GET form to /signup — works without JavaScript and prefills the
 * email on the sign-up page. `source` is recorded on the new account.
 */
export function TrialForm({ source, className, tone = "light" }: { source: string; className?: string; tone?: Tone }) {
  const night = tone === "night";
  return (
    <form action={routes.signup} method="get" className={cn("w-full max-w-xl", className)}>
      <input type="hidden" name="source" value={source} />
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl p-2 transition-shadow duration-300 focus-within:shadow-[0_0_0_4px_rgb(56_189_248/0.18)] sm:flex-row",
          tone === "card" && "bg-white shadow-lg ring-1 shadow-slate-200/60 ring-slate-200/80",
          tone === "light" && "bg-white/90 ring-1 ring-slate-200",
          night && "bg-white/[0.05] ring-1 ring-white/10 backdrop-blur"
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
          className={cn(
            "h-12 min-w-0 flex-1 rounded-xl bg-transparent px-4 text-[15px] outline-none",
            night ? "text-white placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-400"
          )}
        />
        <button
          type="submit"
          className={cn(
            "group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold transition-all duration-200 focus-visible:ring-4 focus-visible:outline-none",
            night
              ? "bg-white text-night hover:bg-sky-50 focus-visible:ring-sky-400/40"
              : "bg-primary text-white shadow-sm shadow-sky-600/20 hover:bg-primary-hover focus-visible:ring-sky-200"
          )}
        >
          Start {siteConfig.trialDays}-Day Clinic Trial
          <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
      <ul className={cn("mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm", night ? "text-slate-400" : "text-slate-600")}>
        {["No credit card required", "Instant access", "Cancel anytime"].map((t) => (
          <li key={t} className="flex items-center gap-1.5">
            <CheckCircle2 className={cn("size-4", night ? "text-emerald-400" : "text-success")} />
            {t}
          </li>
        ))}
      </ul>
    </form>
  );
}
