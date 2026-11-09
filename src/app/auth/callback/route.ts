import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

import { routes } from "@/config/site";
import { safeNextPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

/**
 * Lands here from:
 *  - the magic-link email (PKCE `code`, or `token_hash` + `type` if the email
 *    template is customized to link straight to this route), and
 *  - Google OAuth (`code`).
 * Users without a clinic are sent on to /onboarding by the dashboard guard.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNextPath(searchParams.get("next"));
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();
  let failed = true;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    failed = Boolean(error);
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    failed = Boolean(error);
  }

  if (failed) {
    const url = new URL(routes.login, origin);
    url.searchParams.set("error", "link_invalid");
    return NextResponse.redirect(url);
  }

  return NextResponse.redirect(new URL(next, origin));
}
