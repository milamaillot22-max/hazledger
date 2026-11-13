import { z } from "zod";

/**
 * Typed, validated environment variables. The build fails fast when a
 * required public variable is missing (see .env.example).
 *
 * Server-only secrets live in `getServerEnv()` — call it only from server code.
 */
/** Trims whitespace and stray quotes that sneak in when values are pasted into dashboards. */
const clean = (v: unknown) => (typeof v === "string" ? v.trim().replace(/^["'`]+|["'`]+$/g, "").trim() : v);

/**
 * API keys and URLs never contain whitespace: drop any line break or space pasted
 * in the middle (an invalid HTTP header otherwise makes every Supabase call fail).
 */
const compact = (v: unknown) => {
  const c = clean(v);
  return typeof c === "string" ? c.replace(/\s+/g, "") : c;
};

const publicSchema = z.object({
  /** Production domain by default; set http://localhost:3000 locally to test QR links. */
  NEXT_PUBLIC_SITE_URL: z.preprocess(clean, z.url().default("https://gethazledger.com")),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(compact, z.url()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(compact, z.string().min(1)),
});

/** Empty strings (e.g. `KEY=` in .env files or dashboards) count as "not set". */
const optionalSecret = () => z.preprocess((v) => (compact(v) === "" ? undefined : compact(v)), z.string().min(1).optional());

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
