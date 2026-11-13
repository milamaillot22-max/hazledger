"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { routes } from "@/config/site";
import { TRIAL_DAYS, trialEligible } from "@/features/billing/entitlement";
import { ensurePrice, getBillingState, saveCustomer } from "@/features/billing/server";
import { requireClinic } from "@/lib/auth/dal";
import { getServerEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { hasAdminClient } from "@/lib/supabase/admin";

const BILLING_ROLES = new Set(["owner", "admin"]);

/** Absolute origin of the current request (works on preview, vercel.app and the custom domain). */
async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

function fail(code: string): never {
  redirect(`${routes.billing}?error=${code}`);
}

async function requireBillingAdmin() {
  const ctx = await requireClinic();
  if (!BILLING_ROLES.has(ctx.clinic.role)) fail("forbidden");
  return ctx;
}

const checkoutSchema = z.object({
  plan: z.enum(["starter", "pro"]),
  billing: z.enum(["monthly", "annual"]),
});

/** Sends the owner to Stripe Checkout. First subscription: card required, 14-day free trial. */
export async function startCheckout(formData: FormData) {
  const { user, clinic } = await requireBillingAdmin();
  const parsed = checkoutSchema.safeParse({ plan: formData.get("plan"), billing: formData.get("billing") });
  if (!parsed.success) fail("invalid_plan");
  const { plan, billing } = parsed.data;

  const stripe = getStripe();
  if (!stripe || !hasAdminClient()) fail("not_configured");

  const state = await getBillingState(clinic.id);
  // Already paying: plan changes and cancellations go through the customer portal.
  const k = state.entitlement.kind;
  if (k === "trialing" || k === "subscribed" || k === "past_due") {
    return openBillingPortal();
  }

  let customerId = state.row?.stripe_customer_id ?? null;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      name: clinic.name,
      metadata: { clinic_id: clinic.id },
    });
    customerId = customer.id;
    await saveCustomer(clinic.id, customerId);
  }

  const withTrial = trialEligible(state.row);

  const price = await ensurePrice(stripe, plan, billing);
  const base = await origin();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: clinic.id,
    line_items: [{ price, quantity: 1 }],
    // Card is always collected, even when nothing is due today.
    payment_method_collection: "always",
    subscription_data: {
      metadata: { clinic_id: clinic.id },
      ...(withTrial
        ? { trial_period_days: TRIAL_DAYS, trial_settings: { end_behavior: { missing_payment_method: "cancel" as const } } }
        : {}),
    },
    allow_promotion_codes: true,
    billing_address_collection: "required",
    customer_update: { address: "auto", name: "auto" },
    automatic_tax: { enabled: getServerEnv().STRIPE_AUTOMATIC_TAX === "true" },
    custom_text: {
      submit: {
        message: withTrial
          ? `Free for ${TRIAL_DAYS} days, then billed automatically unless you cancel before the trial ends (Billing → Manage subscription). By starting your trial you agree to the HazLedger Terms of Service (${base}${routes.terms}).`
          : `Billed automatically each period until you cancel (Billing → Manage subscription). By subscribing you agree to the HazLedger Terms of Service (${base}${routes.terms}).`,
      },
    },
    success_url: `${base}${routes.billing}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}${routes.billing}?checkout=canceled`,
  });
  if (!session.url) fail("checkout_failed");
  redirect(session.url);
}

/** Stripe customer portal: change plan, update card, invoices, cancel. */
export async function openBillingPortal() {
  const { clinic } = await requireBillingAdmin();
  const stripe = getStripe();
  if (!stripe) fail("not_configured");

  const state = await getBillingState(clinic.id);
  const customerId = state.row?.stripe_customer_id;
  if (!customerId) fail("no_customer");

  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${await origin()}${routes.billing}`,
  });
  redirect(portal.url);
}
