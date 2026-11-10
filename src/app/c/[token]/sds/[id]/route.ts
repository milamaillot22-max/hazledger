import type { NextRequest } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

const TOKEN = /^[0-9a-f]{32}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Opens the original SDS file for staff who scanned the team QR.
 * The token is checked by a database function (current SDSs of that clinic
 * only), then a 5-minute signed link is issued with the service role.
 */
export async function GET(_req: NextRequest, ctx: RouteContext<"/c/[token]/sds/[id]">) {
  const { token, id } = await ctx.params;
  if (!TOKEN.test(token) || !UUID.test(id)) return new Response("Not found", { status: 404 });

  const { data: path } = await createPublicClient().rpc("get_public_sds_source", {
    p_token: token,
    p_document_id: id,
  });
  if (!path) return new Response("Not found", { status: 404 });

  const admin = createAdminClient();
  if (!admin) return new Response("Full documents are not available yet.", { status: 503 });

  const { data } = await admin.storage.from("sds-files").createSignedUrl(path, 300);
  if (!data?.signedUrl) return new Response("Document unavailable.", { status: 502 });

  return new Response(null, {
    status: 302,
    headers: { Location: data.signedUrl, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}
