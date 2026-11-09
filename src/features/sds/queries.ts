import "server-only";

import type { SdsExtraction } from "@/features/sds/schema";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type SdsRow = Tables<"sds_documents">;

export type SdsDetail = Omit<SdsRow, "hazard_statements" | "ingredients" | "sections" | "confidence"> & {
  hazard_statements: SdsExtraction["hazard_statements"];
  ingredients: SdsExtraction["ingredients"];
  sections: SdsExtraction["sections"];
  confidence: Partial<SdsExtraction["confidence"]>;
};

const LIST_COLUMNS =
  "id, status, document_type, product_name, manufacturer, revision_date, signal_word, pictograms, cas_numbers, review_flags, created_at" as const;

/** RLS restricts rows to the caller's clinics; clinicId narrows to the active one. */
export async function listSdsDocuments(clinicId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sds_documents")
    .select(LIST_COLUMNS)
    .eq("clinic_id", clinicId)
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(`Failed to load SDS library: ${error.message}`);
  return data;
}

export type SdsListItem = Awaited<ReturnType<typeof listSdsDocuments>>[number];

export async function getSdsDocument(id: string, clinicId: string): Promise<SdsDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sds_documents")
    .select("*")
    .eq("id", id)
    .eq("clinic_id", clinicId)
    .maybeSingle();
  if (error) throw new Error(`Failed to load SDS: ${error.message}`);
  return data as SdsDetail | null;
}

/** Short-lived link to the private source file, for the review preview. */
export async function getSourceUrl(path: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.storage.from("sds-files").createSignedUrl(path, 60 * 10);
  return data?.signedUrl ?? null;
}
