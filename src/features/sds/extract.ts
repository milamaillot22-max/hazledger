import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import sharp from "sharp";

import { SdsExtractionSchema, type AcceptedMimeType, type SdsExtraction } from "@/features/sds/schema";
import { getServerEnv } from "@/lib/env";

/** Default model for extraction. Opus 5.5: thinking is always on; effort controls depth. */
export const SDS_EXTRACTION_MODEL = "claude-opus-5-5";

/** Claude's per-image limit is 5 MB; we downscale photos well below it. */
const IMAGE_MAX_EDGE_PX = 2000;

const SYSTEM_PROMPT = `You extract data from Safety Data Sheets (SDS) and chemical product labels for a US healthcare practice's OSHA Hazard Communication (29 CFR 1910.1200) records. The practice relies on your output to decide which hazards and protective measures apply to its staff, and a human reviews it before it is used.

Report only what the document shows. When a field is not present or not readable, return null (or an empty list) and lower the matching confidence score — an honest gap is far more useful to the reviewer than a plausible guess. In particular, copy CAS numbers, hazard codes, phone numbers and dates exactly as printed; never fill them in from your own knowledge of the chemical.

Dates: return YYYY-MM-DD. US documents usually write MM/DD/YYYY; if the order is ambiguous, say so in notes and lower revision_date confidence.

Pictograms: report a GHS code only when its pictogram is printed or named in the document.

Sections: an SDS has 16 numbered sections. Add one entry per section that is actually present, with a short factual summary that a practice manager can act on (what to wear, what to do on exposure, how to store). Product labels have no sections — return an empty list.

Use notes for anything the reviewer should double-check: illegible areas, missing pages, a non-English document, a label photographed at an angle, or a document that is not an SDS at all.`;

export class ScannerError extends Error {
  constructor(
    message: string,
    readonly code: "not_configured" | "refused" | "incomplete" | "unreadable" | "api_error"
  ) {
    super(message);
    this.name = "ScannerError";
  }
}

type Prepared =
  | { kind: "pdf"; data: string }
  | { kind: "image"; data: string; mediaType: "image/jpeg" };

/** Base64-encode PDFs as-is; normalize photos (EXIF rotation, size, JPEG). */
async function prepare(bytes: Buffer, mime: AcceptedMimeType): Promise<Prepared> {
  if (mime === "application/pdf") {
    return { kind: "pdf", data: bytes.toString("base64") };
  }
  try {
    const jpeg = await sharp(bytes)
      .rotate()
      .resize(IMAGE_MAX_EDGE_PX, IMAGE_MAX_EDGE_PX, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
    return { kind: "image", data: jpeg.toString("base64"), mediaType: "image/jpeg" };
  } catch {
    throw new ScannerError("We couldn't open this image. Try a JPEG or PNG photo.", "unreadable");
  }
}

export async function extractSds(
  bytes: Buffer,
  mime: AcceptedMimeType
): Promise<{ extraction: SdsExtraction; model: string }> {
  const { ANTHROPIC_API_KEY } = getServerEnv();
  if (!ANTHROPIC_API_KEY) {
    throw new ScannerError("The SDS scanner is not configured (missing ANTHROPIC_API_KEY).", "not_configured");
  }

  const input = await prepare(bytes, mime);
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY, timeout: 110_000, maxRetries: 1 });

  const source: Anthropic.Beta.BetaContentBlockParam =
    input.kind === "pdf"
      ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: input.data } }
      : { type: "image", source: { type: "base64", media_type: input.mediaType, data: input.data } };

  let response;
  try {
    response = await client.beta.messages.parse({
      model: SDS_EXTRACTION_MODEL,
      max_tokens: 16000,
      // Re-run on a fallback model if a safety classifier declines (chemical
      // hazard content can occasionally trip it).
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: "medium",
        format: betaZodOutputFormat(SdsExtractionSchema),
      },
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            source,
            {
              type: "text",
              text: "Extract this document into the required format.",
            },
          ],
        },
      ],
    });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      throw new ScannerError("The SDS scanner's API key was rejected.", "not_configured");
    }
    if (error instanceof Anthropic.BadRequestError) {
      throw new ScannerError("This file couldn't be processed. Make sure it is a readable PDF or photo.", "unreadable");
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new ScannerError("The scanner is busy. Please try again in a minute.", "api_error");
    }
    if (error instanceof Anthropic.APIError) {
      throw new ScannerError(`The scanner is temporarily unavailable (${error.status ?? "network"}).`, "api_error");
    }
    throw error;
  }

  if (response.stop_reason === "refusal") {
    throw new ScannerError("The scanner declined to process this document.", "refused");
  }
  if (response.stop_reason === "max_tokens" || !response.parsed_output) {
    throw new ScannerError("The scan was incomplete. Try a shorter document or a clearer photo.", "incomplete");
  }

  return { extraction: response.parsed_output, model: response.model };
}
