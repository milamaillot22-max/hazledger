import { z } from "zod";

/**
 * Typed, validated environment variables. The build fails fast when a
 * required public variable is missing (see .env.example).
 *
 * Server-only secrets live in `getServerEnv()` — call it only from server code.
 */
const publicSchema = z.object({
  /** Production domain by default; set http://localhost:3000 locally to test QR links. */
  NEXT_PUBLIC_SITE_URL: z.url().default("https://gethazledger.com"),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

/** Empty strings (e.g. `KEY=` in .env files or dashboards) count as "not set". */
const optionalSecret = () => z.preprocess((v) => (v === "" ? undefined : v), z.string().min(1).optional());

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: optionalSecret(),
  ANTHROPIC_API_KEY: optionalSecret(),
  /** Stripe secret key (sk_test_… or sk_live_…). Billing is disabled when unset. */
  STRIPE_SECRET_KEY: optionalSecret(),
  /** Signing secret of the /api/stripe/webhook endpoint (whsec_…). */
  STRIPE_WEBHOOK_SECRET: optionalSecret(),
  /** "true" once tax registrations exist in Stripe Tax. */
  STRIPE_AUTOMATIC_TAX: z.preprocess((v) => (v === "" ? undefined : v), z.enum(["true", "false"]).optional()),
});

// Next.js inlines NEXT_PUBLIC_* only when referenced explicitly.
export const env = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must not be called in the browser.");
  }
  return serverSchema.parse(process.env);
}
