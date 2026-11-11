"use server";

import { redirect } from "next/navigation";

import { routes } from "@/config/site";
import { requireClinic } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

/** Records the activation milestone the first time a poster is printed. */
export async function markPosterPrinted() {
  const { clinic } = await requireClinic();
  if (clinic.qrPosterPrintedAt) return;
  const supabase = await createClient();
  await supabase
    .from("clinics")
    .update({ qr_poster_printed_at: new Date().toISOString() })
    .eq("id", clinic.id)
    .is("qr_poster_printed_at", null);
}

/** Invalidates every printed poster and issues a new team QR code. */
export async function rotateTeamAccessToken() {
  const { clinic } = await requireClinic();
  if (clinic.role !== "owner" && clinic.role !== "admin") {
    throw new Error("Only clinic owners and admins can regenerate the team QR code.");
  }
  const supabase = await createClient();
  const { error } = await supabase.rpc("rotate_clinic_access_token", { p_clinic_id: clinic.id });
  if (error) throw new Error("We couldn't regenerate the QR code. Please try again.");
  redirect(`${routes.teamAccess}?rotated=1`);
}
