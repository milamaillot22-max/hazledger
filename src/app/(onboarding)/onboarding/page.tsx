import { redirect } from "next/navigation";
import { Suspense } from "react";

import { routes } from "@/config/site";
import { OnboardingForm } from "@/features/clinics/onboarding-form";
import { getActiveClinic, requireUser } from "@/lib/auth/dal";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-xs font-medium tracking-[0.08em] text-primary uppercase">
        Clinic setup · 30 seconds
      </p>
      <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">
        Tell us about your clinic.
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
        We use this to apply the right OSHA HazCom requirements and any
        state-plan rules that apply where you operate.
      </p>
      <div className="mt-10 rounded-xl border border-border bg-card/60 p-5 sm:p-8">
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
    <div aria-hidden="true" className="animate-pulse space-y-8">
      <div className="grid gap-5 sm:grid-cols-[1fr_220px]">
        <div className="h-16 rounded-lg bg-slate-200/60" />
        <div className="h-16 rounded-lg bg-slate-200/60" />
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-slate-200/50" />
        ))}
      </div>
    </div>
  );
}
