import type { Metadata } from "next";
import { Suspense } from "react";
import { AlertTriangle, Check, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";

import { ANNUAL_DISCOUNT_PERCENT, PLANS, priceFor } from "@/config/pricing";
import { openBillingPortal, startCheckout } from "@/features/billing/actions";
import { limitsFor, type Entitlement } from "@/features/billing/entitlement";
import { getBillingState } from "@/features/billing/server";
import { requireClinic } from "@/lib/auth/dal";
import { isStripeConfigured } from "@/lib/stripe";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Billing" };

const ERRORS: Record<string, string> = {
  forbidden: "Only the clinic owner or an admin can manage billing.",
  invalid_plan: "That plan isn't available. Pick Starter or Pro.",
  not_configured: "Online payments aren't switched on yet. Email us and we'll set up your plan.",
  no_customer: "There's no subscription to manage yet. Choose a plan below.",
  checkout_failed: "We couldn't open the secure checkout. Please try again.",
};

const usDate = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default function BillingPage({ searchParams }: PageProps<"/dashboard/billing">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Billing</h1>
      <p className="mt-1 text-[15px] text-slate-600">Your plan, usage and invoices. Payments are processed securely by Stripe.</p>
      <Suspense fallback={<div className="mt-8 h-72 animate-pulse rounded-2xl bg-slate-100" />}>
        <BillingContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function BillingContent({ searchParams }: { searchParams: PageProps<"/dashboard/billing">["searchParams"] }) {
  const [{ clinic }, params] = await Promise.all([requireClinic(), searchParams]);
  const { entitlement, usage } = await getBillingState(clinic.id);
  const canManage = clinic.role === "owner" || clinic.role === "admin";
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;
  const success = params.checkout === "success";
  const paying = entitlement.kind === "subscribed" || entitlement.kind === "past_due";
  const limits = limitsFor(entitlement);

  return (
    <div className="mt-8 space-y-6">
      {success ? (
        <Notice tone="success">Thank you — your subscription is being activated. It can take a few seconds to appear here.</Notice>
      ) : null}
      {error ? <Notice tone="warning">{error}</Notice> : null}
      {!isStripeConfigured() && canManage ? (
        <Notice tone="warning">Online payments aren&apos;t switched on yet. Your trial keeps running normally.</Notice>
      ) : null}

      <section className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:p-8">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Current plan</p>
          <StatusLine entitlement={entitlement} />
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <Usage label="SDSs in library" value={usage.sdsCount} max={limits.maxSds} />
          <Usage label="AI scans this month" value={usage.scansThisMonth} max={limits.scansPerMonth} />
        </dl>
        {paying && canManage ? (
          <form action={openBillingPortal} className="sm:col-span-2">
            <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">
              <CreditCard className="size-4" />
              Manage subscription, card &amp; invoices
            </button>
          </form>
        ) : null}
      </section>

      {!paying ? (
        <section>
          <h2 className="font-heading text-lg font-semibold text-slate-900">Choose your plan</h2>
          <p className="mt-1 text-sm text-slate-600">
            Per location. Your remaining free-trial days carry over — you&apos;re only charged when the trial ends. Cancel anytime.
          </p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-3xl bg-white p-6 sm:p-7",
                  plan.featured ? "ring-2 ring-sky-300 shadow-lg shadow-sky-900/5" : "border border-slate-200/80 shadow-sm"
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                  {plan.featured ? (
                    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100">
                      Recommended
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-slate-600">{plan.tagline}</p>
                <p className="mt-4">
                  <span className="font-heading text-4xl font-semibold text-slate-900 tabular">${plan.monthly}</span>
                  <span className="text-sm text-slate-500"> / month per location</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {[...plan.limits, ...plan.features.map((f) => f.label)].map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                {canManage ? (
                  <div className="mt-auto grid gap-2 pt-6">
                    <form action={startCheckout}>
                      <input type="hidden" name="plan" value={plan.id} />
                      <input type="hidden" name="billing" value="monthly" />
                      <button
                        className={cn(
                          "h-11 w-full rounded-xl text-sm font-semibold",
                          plan.featured ? "bg-primary text-white hover:bg-primary-hover" : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
                        )}
                      >
                        Choose {plan.name} — ${plan.monthly}/month
                      </button>
                    </form>
                    <form action={startCheckout}>
                      <input type="hidden" name="plan" value={plan.id} />
                      <input type="hidden" name="billing" value="annual" />
                      <button className="h-10 w-full rounded-xl text-sm font-medium text-primary hover:bg-sky-50">
                        Or ${priceFor(plan, "annual").billedAmount.toLocaleString("en-US")}/year — save {ANNUAL_DISCOUNT_PERCENT}%
                      </button>
                    </form>
                  </div>
                ) : (
                  <p className="mt-auto pt-6 text-sm text-slate-500">Ask your clinic owner to choose a plan.</p>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
        Your team&apos;s QR access to Safety Data Sheets is never switched off for billing reasons — only adding new SDSs
        depends on your plan.
      </p>
    </div>
  );
}

function StatusLine({ entitlement: e }: { entitlement: Entitlement }) {
  if (e.kind === "subscribed") {
    const plan = PLANS.find((p) => p.id === e.plan)!;
    return (
      <>
        <p className="mt-2 flex items-center gap-2 font-heading text-2xl font-semibold text-slate-900">
          {plan.name}
          <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            {e.stripeStatus === "trialing" ? "Trial" : "Active"}
          </span>
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {e.cycle === "annual" ? "Billed yearly" : "Billed monthly"}
          {e.stripeStatus === "trialing" && e.trialEndsAt ? ` · first payment on ${usDate(e.trialEndsAt)}` : null}
          {e.stripeStatus !== "trialing" && e.renewsAt
            ? e.cancelAtPeriodEnd
              ? ` · ends on ${usDate(e.renewsAt)}`
              : ` · renews on ${usDate(e.renewsAt)}`
            : null}
        </p>
      </>
    );
  }
  if (e.kind === "past_due") {
    return (
      <>
        <p className="mt-2 font-heading text-2xl font-semibold text-slate-900">{e.plan === "pro" ? "Pro" : "Starter"}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-amber-700">
          <AlertTriangle className="size-4" />
          Your last payment didn&apos;t go through. Update your card to keep adding SDSs.
        </p>
      </>
    );
  }
  if (e.kind === "trial") {
    return (
      <>
        <p className="mt-2 font-heading text-2xl font-semibold text-slate-900">Free trial · everything included</p>
        <p className="mt-1 text-sm text-slate-600">
          {e.daysLeft} {e.daysLeft === 1 ? "day" : "days"} left · ends on {usDate(e.trialEndsAt)}. No card needed until you choose a plan.
        </p>
      </>
    );
  }
  return (
    <>
      <p className="mt-2 font-heading text-2xl font-semibold text-slate-900">Trial ended</p>
      <p className="mt-1 text-sm text-slate-600">
        Ended on {usDate(e.trialEndedAt)}. Choose a plan to keep adding SDSs — your library and team QR access stay available.
      </p>
    </>
  );
}

function Usage({ label, value, max }: { label: string; value: number; max: number | null }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 px-4 py-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-heading text-xl font-semibold text-slate-900 tabular">
        {value}
        <span className="text-sm font-normal text-slate-500">{max === null ? " · unlimited" : ` / ${max}`}</span>
      </dd>
    </div>
  );
}

function Notice({ tone, children }: { tone: "success" | "warning"; children: React.ReactNode }) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-medium",
        tone === "success" ? "border-emerald-100 bg-success-soft text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-900"
      )}
    >
      {tone === "success" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0" /> : <AlertTriangle className="mt-0.5 size-4 shrink-0" />}
      {children}
    </div>
  );
}
