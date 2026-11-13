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

/**
 * Production Supabase project. Both values are public by design (they ship in the
 * browser bundle; access is enforced by row-level security). They are the fallback
 * when a dashboard value is missing or mangled by copy-paste, so sign-in never
 * depends on hand-pasted config.
 */
const SUPABASE_DEFAULT_URL = "https://nugbzlszrfetuzloiqrc.supabase.co";
const SUPABASE_DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Z2J6bHN6cmZldHV6bG9pcXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyNTExNjEsImV4cCI6MjEwOTgyNzE2MX0.uaNklDVwhx7zW2z0dxnauYpn3ScGtQX59LGcVFRBPs8";

/** Keeps only characters that can appear in a key (drops invisible or typographic characters). */
const keyChars = (v: unknown) => (typeof v === "string" ? v.replace(/[^A-Za-z0-9._-]/g, "") : "");

function pickSupabase(rawUrl: unknown, rawKey: unknown) {
  const url = compact(rawUrl);
  const key = keyChars(clean(rawKey));
  const validUrl = typeof url === "string" && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url) ? url.replace(/\/$/, "") : null;
  // Legacy anon keys are JWTs. New sb_publishable_ keys are sent as a Bearer token by
  // supabase-js, which the Auth API rejects (401), so they are not used here.
  const validKey = /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/.test(key) ? key : null;
  // Production project: always the known-good public key.
  if (!validUrl || validUrl === SUPABASE_DEFAULT_URL) return { url: SUPABASE_DEFAULT_URL, key: SUPABASE_DEFAULT_ANON_KEY };
  return { url: validUrl, key: validKey ?? clean(rawKey) };
}

// Next.js inlines NEXT_PUBLIC_* only when referenced explicitly.
const supabase = pickSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const env = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: supabase.url,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabase.key,
});

export function getServerEnv() {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() must not be called in the browser.");
  }
  return serverSchema.parse(process.env);
}
