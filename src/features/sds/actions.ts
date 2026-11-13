"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { routes } from "@/config/site";
import { canAddSds } from "@/features/billing/entitlement";
import { getBillingState } from "@/features/billing/server";
import { extractSds, ScannerError, SDS_EXTRACTION_MODEL } from "@/features/sds/extract";
import { normalizeExtraction } from "@/features/sds/normalize";
import { ACCEPTED_MIME_TYPES, GHS_CODES, MAX_UPLOAD_BYTES } from "@/features/sds/schema";
import { requireClinic } from "@/lib/auth/dal";
import type { Json } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

const EDITOR_ROLES = new Set(["owner", "admin"]);

async function requireEditor() {
  const ctx = await requireClinic();
  if (!EDITOR_ROLES.has(ctx.clinic.role)) {
    throw new Error("Only clinic owners and admins can change the SDS library.");
  }
  return ctx;
}

const uploadSchema = z.object({
  path: z.string().min(1).max(300),
  name: z.string().max(255).optional(),
  size: z.number().int().positive().max(MAX_UPLOAD_BYTES),
  mime: z.enum(ACCEPTED_MIME_TYPES),
});

export type ScanResult = { ok: true; id: string } | { ok: false; id?: string; error: string };

/**
 * Called after the browser uploaded the file to `sds-files/<clinic_id>/…`.
 * Creates the record, runs the AI extraction, stores the result for review.
 */
export async function processSdsUpload(input: z.input<typeof uploadSchema>): Promise<ScanResult> {
  const { clinic } = await requireEditor();
  const parsed = uploadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "This file can't be scanned. Use a PDF, JPEG, PNG or WebP under 20 MB." };
  const { path, name, size, mime } = parsed.data;

  // Plan gate: no plan, ended subscription, trial cap (15 SDSs), Starter limits.
  const billing = await getBillingState(clinic.id);
  const check = canAddSds(billing.entitlement, billing.usage);
  if (!check.allowed) return { ok: false, error: check.message };

  // The path must live in the active clinic's folder (storage RLS enforces it too).
  if (!path.startsWith(`${clinic.id}/`) || path.includes("..")) {
    return { ok: false, error: "Invalid upload location." };
  }

  const supabase = await createClient();
  const { data: row, error: insertError } = await supabase
    .from("sds_documents")
    .insert({
      clinic_id: clinic.id,
      source_path: path,
      source_name: name ?? null,
      source_mime: mime,
      source_size: size,
      status: "processing",
      extraction_model: SDS_EXTRACTION_MODEL,
    })
    .select("id")
    .single();
  if (insertError || !row) return { ok: false, error: "We couldn't create the SDS record. Please try again." };

  try {
    const { data: file, error: downloadError } = await supabase.storage.from("sds-files").download(path);
    if (downloadError || !file) throw new ScannerError("We couldn't read the uploaded file.", "unreadable");

    const bytes = Buffer.from(await file.arrayBuffer());
    const { extraction, model } = await extractSds(bytes, mime);
    const n = normalizeExtraction(extraction);

    const { error: updateError } = await supabase
      .from("sds_documents")
      .update({
        status: "needs_review",
        document_type: n.document_type,
        product_name: n.product_name,
        manufacturer: n.manufacturer,
        manufacturer_phone: n.manufacturer_phone,
        emergency_phone: n.emergency_phone,
        recommended_use: n.recommended_use,
        revision_date: n.revision_date,
        signal_word: n.signal_word,
        pictograms: n.pictograms,
        cas_numbers: n.cas_numbers,
        hazard_statements: n.hazard_statements as Json,
        ingredients: n.ingredients as Json,
        ppe: n.ppe,
        sections: n.sections as Json,
        confidence: n.confidence as Json,
        review_flags: n.review_flags,
        extraction: extraction as unknown as Json,
        extraction_model: model,
        error: null,
      })
      .eq("id", row.id);
    if (updateError) throw new Error(updateError.message);

    return { ok: true, id: row.id };
  } catch (error) {
    const message =
      error instanceof ScannerError ? error.message : "Something went wrong while scanning. Please try again.";
    if (!(error instanceof ScannerError)) console.error("[sds] extraction failed", error);
    await supabase.from("sds_documents").update({ status: "failed", error: message }).eq("id", row.id);
    return { ok: false, id: row.id, error: message };
  }
}

const reviewSchema = z.object({
  id: z.uuid(),
  product_name: z.string().trim().min(1, "Product name is required.").max(200),
  manufacturer: z.string().trim().max(200).optional(),
  emergency_phone: z.string().trim().max(60).optional(),
  revision_date: z.union([z.iso.date(), z.literal("")]).optional(),
  signal_word: z.enum(["Danger", "Warning", ""]).optional(),
  pictograms: z.array(z.enum(GHS_CODES)),
  cas_numbers: z.string().max(1000).optional(),
});

export type ReviewState = { status: "idle" | "error"; message?: string };

export async function confirmSdsReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const { user, clinic } = await requireEditor();
  const parsed = reviewSchema.safeParse({
    id: formData.get("id"),
    product_name: formData.get("product_name"),
    manufacturer: formData.get("manufacturer") ?? undefined,
    emergency_phone: formData.get("emergency_phone") ?? undefined,
    revision_date: formData.get("revision_date") ?? undefined,
    signal_word: formData.get("signal_word") ?? undefined,
    pictograms: formData.getAll("pictograms"),
    cas_numbers: formData.get("cas_numbers") ?? undefined,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the highlighted fields." };
  }
  const v = parsed.data;
  const cas = (v.cas_numbers ?? "")
    .split(/[\s,;]+/)
    .map((c) => c.trim())
    .filter(Boolean);

  const supabase = await createClient();
  const { error } = await supabase
    .from("sds_documents")
    .update({
      status: "current",
      product_name: v.product_name,
      manufacturer: v.manufacturer || null,
      emergency_phone: v.emergency_phone || null,
      revision_date: v.revision_date || null,
      signal_word: v.signal_word || null,
      pictograms: v.pictograms,
      cas_numbers: [...new Set(cas)],
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", v.id)
    .eq("clinic_id", clinic.id)
    .in("status", ["needs_review", "current"]);
  if (error) return { status: "error", message: "We couldn't save your review. Please try again." };

  redirect(`${routes.sdsLibrary}?saved=1`);
}

export async function deleteSdsDocument(formData: FormData) {
  const { clinic } = await requireEditor();
  const id = z.uuid().parse(formData.get("id"));
  const supabase = await createClient();
  const { data: row } = await supabase
    .from("sds_documents")
    .select("source_path")
    .eq("id", id)
    .eq("clinic_id", clinic.id)
    .maybeSingle();
  if (row) {
    await supabase.from("sds_documents").delete().eq("id", id).eq("clinic_id", clinic.id);
    await supabase.storage.from("sds-files").remove([row.source_path]);
  }
  redirect(routes.sdsLibrary);
}
