"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { routes } from "@/config/site";
import { safeNextPath } from "@/lib/auth/redirect";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type MagicLinkState =
  | { status: "idle" }
  | { status: "sent"; email: string }
  | { status: "error"; message: string; email?: string };

const emailSchema = z.object({
  email: z.email("Enter a valid work email.").trim().toLowerCase(),
  next: z.string().optional(),
  /** Acquisition source (e.g. "dental-compliance"), stored on new accounts. */
  source: z
    .string()
    .regex(/^[a-z0-9-]{1,48}$/)
    .optional()
    .catch(undefined),
});

async function getOrigin() {
  const h = await headers();
  return h.get("origin") ?? env.NEXT_PUBLIC_SITE_URL;
}

function callbackUrl(origin: string, next: string) {
  const url = new URL(routes.authCallback, origin);
  url.searchParams.set("next", safeNextPath(next));
  return url.toString();
}

export async function sendMagicLink(
  _prev: MagicLinkState,
  formData: FormData
): Promise<MagicLinkState> {
  const parsed = emailSchema.safeParse({
    email: formData.get("email"),
    next: formData.get("next") ?? undefined,
    source: formData.get("source") ?? undefined,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Enter a valid work email.",
      email: String(formData.get("email") ?? ""),
    };
  }

  const { email, next, source } = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl(await getOrigin(), next ?? routes.dashboard),
      shouldCreateUser: true,
      // Only applied when the account is created.
      data: source ? { signup_source: source } : undefined,
    },
  });

  if (error) {
    const message =
      error.status === 429
        ? "Too many requests. Wait a minute, then try again."
        : "We couldn't send your sign-in link. Please try again.";
    return { status: "error", message, email };
  }

  return { status: "sent", email };
}

export async function signInWithGoogle(formData: FormData) {
  const next = String(formData.get("next") ?? routes.dashboard);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl(await getOrigin(), next),
      queryParams: { prompt: "select_account" },
    },
  });

  if (error || !data.url) {
    redirect(`${routes.login}?error=oauth`);
  }
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(routes.login);
}
