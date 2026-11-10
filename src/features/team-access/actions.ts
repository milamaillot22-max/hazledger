"use server";

import { redirect } from "next/navigation";

import { routes } from "@/config/site";
import { requireClinic } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

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
