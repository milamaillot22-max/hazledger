import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { routes } from "@/config/site";
import type { ClinicRole, PracticeType } from "@/features/clinics/constants";
import { createClient } from "@/lib/supabase/server";

/**
 * Data Access Layer — the single place that resolves "who is the user" and
 * "which clinic are they acting for". Every page, Server Action and Route
 * Handler that touches tenant data goes through these helpers.
 * `cache()` dedupes the lookups within a single request.
 */

export type SessionUser = {
  id: string;
  email: string | null;
};

export type ActiveClinic = {
  id: string;
  name: string;
  state: string;
  practiceType: PracticeType;
  role: ClinicRole;
};

export const getUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  return {
    id: data.claims.sub,
    email: typeof data.claims.email === "string" ? data.claims.email : null,
  };
});

export async function requireUser(): Promise<SessionUser> {
  const user = await getUser();
  if (!user) redirect(routes.login);
  return user;
}

/** First clinic the user belongs to (multi-clinic switcher comes later). */
export const getActiveClinic = cache(async (): Promise<ActiveClinic | null> => {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinic_members")
    .select("role, clinics ( id, name, state, practice_type )")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(`Failed to load clinic: ${error.message}`);
  if (!data?.clinics) return null;

  return {
    id: data.clinics.id,
    name: data.clinics.name,
    state: data.clinics.state,
    practiceType: data.clinics.practice_type as PracticeType,
    role: data.role as ClinicRole,
  };
});

/** Use in every tenant-scoped page: sends users without a clinic to onboarding. */
export async function requireClinic(): Promise<{
  user: SessionUser;
  clinic: ActiveClinic;
}> {
  const user = await requireUser();
  const clinic = await getActiveClinic();
  if (!clinic) redirect(routes.onboarding);
  return { user, clinic };
}
