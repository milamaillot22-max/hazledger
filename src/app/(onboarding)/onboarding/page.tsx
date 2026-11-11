import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Check } from "lucide-react";

import { routes } from "@/config/site";
import { OnboardingForm } from "@/features/clinics/onboarding-form";
import { getActiveClinic, requireUser } from "@/lib/auth/dal";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Account", state: "done" },
  { label: "Your clinic", state: "current" },
  { label: "Print QR poster", state: "todo" },
] as const;

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <ol className="flex items-center gap-2 text-sm" aria-label="Setup progress">
        {STEPS.map((step, i) => (
          <li key={step.label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                step.state === "done" && "bg-success text-white",
                step.state === "current" && "bg-primary text-white ring-4 ring-sky-100",
                step.state === "todo" && "bg-white text-slate-400 ring-1 ring-slate-200"
              )}
            >
              {step.state === "done" ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span
              className={cn(
                "font-medium",
                step.state === "todo" ? "text-slate-400" : "text-slate-700"
              )}
              aria-current={step.state === "current" ? "step" : undefined}
            >
              {step.label}
            </span>
            {i < STEPS.length - 1 ? (
              <span className="mx-1 h-px w-6 bg-slate-200 sm:w-10" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>

      <h1 className="mt-8 text-3xl font-semibold text-slate-900 sm:text-[2.5rem] sm:leading-[1.15]">
        Tell us about your clinic
      </h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-600">
        It takes 30 seconds. We use it to apply the right OSHA HazCom
        requirements — and any state-plan rules where you operate.
      </p>

      <div className="mt-10 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-10">
        <Suspense fallback={<FormSkeleton />}>
          <OnboardingGate />
        </Suspense>
      </div>
    </div>
  );
}

async function OnboardingGate() {
  await requireUser();
  if (await getActiveClinic()) redirect(routes.dashboard);
  return <OnboardingForm />;
}

function FormSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="grid gap-5 sm:grid-cols-[1fr_240px]">
        <div className="h-[72px] rounded-xl bg-slate-100" />
        <div className="h-[72px] rounded-xl bg-slate-100" />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </div>
  );
}
