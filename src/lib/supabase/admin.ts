import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { env, getServerEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Service-role client — bypasses RLS. Use only for narrowly scoped server
 * tasks that were authorized another way (e.g. signing a file URL after a
 * token check). Returns null when SUPABASE_SERVICE_ROLE_KEY isn't set.
 */
export function createAdminClient() {
  const { SUPABASE_SERVICE_ROLE_KEY } = getServerEnv();
  if (!SUPABASE_SERVICE_ROLE_KEY) return null;
  return createSupabaseClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function hasAdminClient() {
  return Boolean(getServerEnv().SUPABASE_SERVICE_ROLE_KEY);
}
