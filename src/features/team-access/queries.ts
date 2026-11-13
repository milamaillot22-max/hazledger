import "server-only";

import QRCode from "qrcode";

import { publicLibraryPath } from "@/config/site";
import type { SdsExtraction } from "@/features/sds/schema";
import { env } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export type TeamAccess = {
  token: string;
  enabled: boolean;
  rotatedAt: string | null;
  url: string;
  /** True when the QR would point at a dev URL — don't print it. */
  isLocalUrl: boolean;
};

export function buildAccessUrl(token: string) {
  return new URL(publicLibraryPath(token), env.NEXT_PUBLIC_SITE_URL).toString();
}

export async function getTeamAccess(clinicId: string): Promise<TeamAccess> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinics")
    .select("public_access_token, public_access_enabled, public_access_rotated_at")
    .eq("id", clinicId)
    .single();
  if (error || !data) throw new Error(`Failed to load team access: ${error?.message}`);
  const url = buildAccessUrl(data.public_access_token);
  const host = new URL(url).hostname;
  return {
    token: data.public_access_token,
    enabled: data.public_access_enabled,
    rotatedAt: data.public_access_rotated_at,
    url,
    isLocalUrl: host === "localhost" || host === "127.0.0.1" || host.endsWith(".local"),
  };
}

/** Crisp vector QR (prints sharply at any size). Error correction "Q" survives scuffed posters. */
export async function renderQrSvg(url: string) {
  return QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "Q",
    margin: 0,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}

export type PublicSdsDocument = {
  id: string;
  product_name: string | null;
  manufacturer: string | null;
  emergency_phone: string | null;
  revision_date: string | null;
  signal_word: "Danger" | "Warning" | null;
  pictograms: string[];
  hazard_statements: SdsExtraction["hazard_statements"];
  ppe: string[];
  document_type: "sds" | "label" | "other" | null;
  sections: SdsExtraction["sections"];
};

export type PublicSafetyLibrary = {
  clinic: { name: string; state: string };
  /** True when the clinic has no live subscription: documents are withheld. */
  suspended?: boolean;
  documents: PublicSdsDocument[];
};

/** Null when the token is unknown, rotated or disabled. */
export async function getPublicSafetyLibrary(token: string): Promise<PublicSafetyLibrary | null> {
  if (!/^[0-9a-f]{32}$/.test(token)) return null;
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_public_safety_library", { p_token: token });
  if (error) throw new Error(`Failed to load safety library: ${error.message}`);
  return (data as PublicSafetyLibrary | null) ?? null;
}
