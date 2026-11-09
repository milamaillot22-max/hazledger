"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { routes } from "@/config/site";
import {
  PRACTICE_TYPE_VALUES,
  US_STATE_CODES,
} from "@/features/clinics/constants";
import { getActiveClinic, getUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

const clinicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your clinic's name.")
    .max(120, "Keep the name under 120 characters."),
  state: z.enum(US_STATE_CODES, { error: "Select the state your clinic operates in." }),
  practiceType: z.enum(PRACTICE_TYPE_VALUES, { error: "Choose your practice type." }),
});

export type CreateClinicState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "state" | "practiceType", string>>;
};

export async function createClinic(
  _prev: CreateClinicState,
  formData: FormData
): Promise<CreateClinicState> {
  // Re-verify the session inside the action — never trust the client.
  const user = await getUser();
  if (!user) redirect(routes.login);

  const parsed = clinicSchema.safeParse({
    name: formData.get("name"),
    state: formData.get("state"),
    practiceType: formData.get("practiceType"),
  });

  if (!parsed.success) {
    const fieldErrors: CreateClinicState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<CreateClinicState["fieldErrors"]>;
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", fieldErrors };
  }

  // Guard against double submits: one clinic is created during onboarding.
  if (await getActiveClinic()) redirect(routes.dashboard);

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_clinic", {
    p_name: parsed.data.name,
    p_state: parsed.data.state,
    p_practice_type: parsed.data.practiceType,
  });

  if (error) {
    return {
      status: "error",
      message: "We couldn't create your clinic. Please try again.",
    };
  }

  redirect(routes.dashboard);
}
