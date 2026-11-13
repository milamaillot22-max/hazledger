import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AlertTriangle, Check, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";

import { ANNUAL_DISCOUNT_PERCENT, getPlan, PLANS, priceFor } from "@/config/pricing";
import { routes } from "@/config/site";
import { openBillingPortal, startCheckout } from "@/features/billing/actions";
import { limitsFor, QR_GRACE_DAYS, TRIAL_DAYS, TRIAL_MAX_SDS, type Entitlement } from "@/features/billing/entitlement";
import { confirmCheckoutSession, getBillingState } from "@/features/billing/server";
import { requireClinic } from "@/lib/auth/dal";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Billing" };

const ERRORS: Record<string, string> = {
  forbidden: "Only the clinic owner or an admin can manage billing.",
  invalid_plan: "That plan isn't available. Please try again.",
  not_configured: "Online payments aren't switched on yet. Email us and we'll set up your plan.",
  no_customer: "There's no subscription to manage yet. Choose a plan below.",
  checkout_failed: "We couldn't open the secure checkout. Please try again.",
};

const DAY_MS = 86_400_000;
/** First charge date if a trial starts now (request time; this page is dynamic). */
const trialEndFromNow = () => new Date(Date.now() + TRIAL_DAYS * DAY_MS);
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
  let { entitlement, usage } = await getBillingState(clinic.id);
  const canManage = clinic.role === "owner" || clinic.role === "admin";
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;
  const success = params.checkout === "success";

  // Back from Checkout: activate now (don't wait for the webhook), then go print the team poster.
  const sessionId = typeof params.session_id === "string" ? params.session_id : null;
  if (success && sessionId && entitlement.kind === "none") {
    const stripe = getStripe();
    const confirmed = stripe ? await confirmCheckoutSession(stripe, clinic.id, sessionId).catch(() => false) : false;
    if (confirmed) ({ entitlement, usage } = await getBillingState(clinic.id));
  }
  if (success && entitlement.kind !== "none") redirect(`${routes.teamAccess}?welcome=1`);

  const paying = entitlement.kind === "trialing" || entitlement.kind === "subscribed" || entitlement.kind === "past_due";
  const firstTime = entitlement.kind === "none";
  const limits = limitsFor(entitlement);
  const firstChargeOn = trialEndFromNow();
  const plan = getPlan();

  return (
    <div className="mt-8 space-y-6">
      {success ? (
        <Notice tone="success">Thank you — your subscription is being activated. It can take a few seconds to appear here.</Notice>
      ) : null}
      {error ? <Notice tone="warning">{error}</Notice> : null}
      {!isStripeConfigured() && canManage ? (
        <Notice tone="warning">Online payments aren&apos;t switched on yet. Email us and we&apos;ll set up your plan.</Notice>
      ) : null}

      <section className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:p-8">
        <div>
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Current plan</p>
          <StatusLine entitlement={entitlement} />
        </div>
        {paying ? (
          <dl className="grid grid-cols-2 gap-3">
            <Usage label="SDSs in library" value={usage.sdsCount} max={limits.maxSds} />
            <Usage label="AI scans this month" value={usage.scansThisMonth} max={limits.scansPerMonth} />
          </dl>
        ) : null}
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
          <h2 className="font-heading text-lg font-semibold text-slate-900">
            {firstTime ? `Start your ${TRIAL_DAYS}-day free trial` : "Restart your plan"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {firstTime
              ? `Add your card — you pay $0 today. Your first charge is on ${usDate(firstChargeOn)}; cancel before then and you pay nothing. The trial includes up to ${TRIAL_MAX_SDS} SDSs.`
              : "Per location. Billed automatically each period. Cancel anytime."}
          </p>
          <div className="mt-5 grid gap-6 rounded-3xl bg-white p-6 shadow-lg shadow-sky-900/5 ring-2 ring-sky-300 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100">
                  Everything included
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{plan.tagline}</p>
              <p className="mt-4">
                <span className="font-heading text-4xl font-semibold text-slate-900 tabular">${plan.monthly}</span>
                <span className="text-sm text-slate-500"> / month per location</span>
              </p>
              {canManage ? (
                <div className="mt-auto grid gap-2 pt-6">
                  <form action={startCheckout}>
                    <input type="hidden" name="plan" value={plan.id} />
                    <input type="hidden" name="billing" value="monthly" />
                    <button className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary-hover">
                      {firstTime ? `Start free trial — then $${plan.monthly}/month` : `Restart — $${plan.monthly}/month`}
                    </button>
                  </form>
                  <form action={startCheckout}>
                    <input type="hidden" name="plan" value={plan.id} />
                    <input type="hidden" name="billing" value="annual" />
                    <button className="h-11 w-full rounded-xl bg-white text-sm font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50">
                      {firstTime ? "Or yearly after the trial: " : "Or yearly: "}${priceFor(plan, "annual").billedAmount.toLocaleString("en-US")}/year — save{" "}
                      {ANNUAL_DISCOUNT_PERCENT}%
                    </button>
                  </form>
                </div>
              ) : (
                <p className="mt-auto pt-6 text-sm text-slate-500">Ask your clinic owner to start the plan.</p>
              )}
            </div>
            <ul className="space-y-2 border-t border-slate-100 pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
              {[...plan.limits, ...plan.features.map((f) => f.label)].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success" />
        Cancel anytime from this page. If your subscription ends, your team&apos;s QR access stays on for {QR_GRACE_DAYS} more days,
        then pauses until you choose a plan. Your library is kept.
      </p>
    </div>
  );
}

function StatusLine({ entitlement: e }: { entitlement: Entitlement }) {
  const planName = (id: string) => PLANS.find((p) => p.id === id)?.name ?? id;
  if (e.kind === "trialing" || e.kind === "subscribed") {
    return (
      <>
        <p className="mt-2 flex items-center gap-2 font-heading text-2xl font-semibold text-slate-900">
          {planName(e.plan)}
          <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
            {e.kind === "trialing" ? "Free trial" : "Active"}
          </span>
        </p>
        <p className="mt-1 text-sm text-slate-600">
          {e.cycle === "annual" ? "Billed yearly" : "Billed monthly"}
          {e.kind === "trialing" && e.trialEndsAt
            ? e.cancelAtPeriodEnd
              ? ` · trial ends on ${usDate(e.trialEndsAt)}, you won't be charged`
              : ` · first payment on ${usDate(e.trialEndsAt)}`
            : null}
          {e.kind === "trialing" ? ` · up to ${TRIAL_MAX_SDS} SDSs during the trial` : null}
          {e.kind === "subscribed" && e.renewsAt
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
        <p className="mt-2 font-heading text-2xl font-semibold text-slate-900">{planName(e.plan)}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-amber-700">
          <AlertTriangle className="size-4" />
          Your last payment didn&apos;t go through. Update your card to keep your plan.
        </p>
      </>
    );
  }
  if (e.kind === "ended") {
    return (
      <>
        <p className="mt-2 font-heading text-2xl font-semibold text-slate-900">Subscription ended</p>
        <p className="mt-1 text-sm text-slate-600">
          {e.qrLive && e.qrUntil
            ? `Team QR access stays on until ${usDate(e.qrUntil)}. Choose a plan to keep it on and add SDSs.`
            : "Team QR access is paused. Choose a plan to switch it back on — your library is kept."}
        </p>
      </>
    );
  }
  return (
    <>
      <p className="mt-2 font-heading text-2xl font-semibold text-slate-900">No plan yet</p>
      <p className="mt-1 text-sm text-slate-600">
        Start your {TRIAL_DAYS}-day free trial below to scan SDSs and switch on your team QR poster.
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
