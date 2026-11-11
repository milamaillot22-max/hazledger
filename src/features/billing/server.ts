import "server-only";

import type Stripe from "stripe";

import { getPlan } from "@/config/pricing";
import {
  lookupKeyFor,
  resolveEntitlement,
  type BillingCycle,
  type BillingRow,
  type Entitlement,
  type PlanId,
} from "@/features/billing/entitlement";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type BillingState = {
  entitlement: Entitlement;
  row: (BillingRow & { stripe_customer_id: string | null; stripe_subscription_id: string | null }) | null;
  usage: { sdsCount: number; scansThisMonth: number };
};

/** Read with the member's session (RLS): billing row, trial clock and usage. */
export async function getBillingState(clinicId: string): Promise<BillingState> {
  const supabase = await createClient();
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [clinic, billing, total, month] = await Promise.all([
    supabase.from("clinics").select("created_at").eq("id", clinicId).single(),
    supabase
      .from("clinic_billing")
      .select("plan, billing_cycle, status, trial_ends_at, current_period_end, cancel_at_period_end, stripe_customer_id, stripe_subscription_id")
      .eq("clinic_id", clinicId)
      .maybeSingle(),
    supabase.from("sds_documents").select("id", { count: "exact", head: true }).eq("clinic_id", clinicId).neq("status", "failed"),
    supabase
      .from("sds_documents")
      .select("id", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .gte("created_at", monthStart.toISOString()),
  ]);
  if (clinic.error) throw new Error(`Failed to load clinic: ${clinic.error.message}`);

  return {
    entitlement: resolveEntitlement(billing.data ?? null, clinic.data.created_at),
    row: billing.data ?? null,
    usage: { sdsCount: total.count ?? 0, scansThisMonth: month.count ?? 0 },
  };
}

/** Finds the active price for a plan by lookup key; creates it if this Stripe account has none (fresh/test accounts). */
export async function ensurePrice(stripe: Stripe, plan: PlanId, cycle: BillingCycle): Promise<string> {
  const lookupKey = lookupKeyFor(plan, cycle);
  const existing = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  if (existing.data[0]) return existing.data[0].id;

  const config = getPlan(plan);
  const products = await stripe.products.list({ active: true, limit: 100 });
  const product =
    products.data.find((p) => p.metadata?.plan_id === plan) ??
    (await stripe.products.create({
      name: `HazLedger ${config.name}`,
      description: config.tagline,
      tax_code: "txcd_10103001",
      metadata: { plan_id: plan },
    }));

  const price = await stripe.prices.create({
    product: product.id,
    currency: "usd",
    unit_amount: (cycle === "monthly" ? config.monthly : config.monthly * 10) * 100,
    recurring: { interval: cycle === "monthly" ? "month" : "year" },
    tax_behavior: "exclusive",
    lookup_key: lookupKey,
    metadata: { plan_id: plan, billing: cycle },
  });
  return price.id;
}

function planFromPrice(price: Stripe.Price | null | undefined): { plan: PlanId | null; cycle: BillingCycle | null } {
  const plan = price?.metadata?.plan_id ?? price?.lookup_key?.split("_")[1] ?? null;
  const interval = price?.recurring?.interval;
  return {
    plan: plan === "starter" || plan === "pro" ? plan : null,
    cycle: interval === "year" ? "annual" : interval === "month" ? "monthly" : null,
  };
}

const iso = (unix: number | null | undefined) => (unix ? new Date(unix * 1000).toISOString() : null);

/**
 * Mirrors a Stripe subscription into clinic_billing (service role).
 * The clinic is resolved from subscription metadata, then from the customer.
 */
export async function syncSubscription(subscription: Stripe.Subscription, clinicIdHint?: string | null) {
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to sync billing.");

  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
  let clinicId: string | null = clinicIdHint || subscription.metadata?.clinic_id || null;
  if (!clinicId) {
    const { data } = await admin.from("clinic_billing").select("clinic_id").eq("stripe_customer_id", customerId).maybeSingle();
    clinicId = data?.clinic_id ?? null;
  }
  if (!clinicId) throw new Error(`No clinic found for Stripe customer ${customerId}.`);
  const resolvedClinicId: string = clinicId;

  const item = subscription.items.data[0];
  const { plan, cycle } = planFromPrice(item?.price);

  const { error } = await admin.from("clinic_billing").upsert(
    {
      clinic_id: resolvedClinicId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan,
      billing_cycle: cycle,
      status: subscription.status,
      trial_ends_at: iso(subscription.trial_end),
      current_period_end: iso(item?.current_period_end),
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: "clinic_id" }
  );
  if (error) throw new Error(`Failed to save billing: ${error.message}`);
}

/** Stores the Stripe customer for a clinic before checkout, so webhooks can resolve it. */
export async function saveCustomer(clinicId: string, customerId: string) {
  const admin = createAdminClient();
  if (!admin) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required to start checkout.");
  const { error } = await admin
    .from("clinic_billing")
    .upsert({ clinic_id: clinicId, stripe_customer_id: customerId }, { onConflict: "clinic_id" });
  if (error) throw new Error(`Failed to save Stripe customer: ${error.message}`);
}
