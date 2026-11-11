import type Stripe from "stripe";

import { syncSubscription } from "@/features/billing/server";
import { getServerEnv } from "@/lib/env";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe → HazLedger subscription mirror. Configure in Stripe Dashboard →
 * Developers → Webhooks with these events:
 *   checkout.session.completed
 *   customer.subscription.created / updated / deleted
 * The signing secret goes in STRIPE_WEBHOOK_SECRET (never in the repo).
 */
const SUBSCRIPTION_EVENTS = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
]);

export async function POST(request: Request) {
  const stripe = getStripe();
  const { STRIPE_WEBHOOK_SECRET } = getServerEnv();
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Billing is not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing signature." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(await request.text(), signature, STRIPE_WEBHOOK_SECRET);
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === "subscription" && session.subscription) {
        const id = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(id);
        await syncSubscription(subscription, session.client_reference_id);
      }
    } else if (SUBSCRIPTION_EVENTS.has(event.type)) {
      await syncSubscription(event.data.object as Stripe.Subscription);
    }
  } catch (error) {
    // 500 makes Stripe retry with backoff.
    console.error("Stripe webhook failed", event.type, event.id, error);
    return Response.json({ error: "Webhook processing failed." }, { status: 500 });
  }

  return Response.json({ received: true });
}
