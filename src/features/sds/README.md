# SDS scanner

```
browser ──upload──▶ Storage  sds-files/<clinic_id>/<uuid>.<ext>   (RLS: owners/admins)
   │
   └─▶ processSdsUpload (Server Action, maxDuration 120s)
         1. insert sds_documents row (status: processing)
         2. download file (user session, RLS)
         3. extract.ts → Claude (claude-opus-5-5, structured output = schema.ts)
              • PDFs sent as document blocks; photos EXIF-rotated, ≤2000px JPEG (sharp)
              • server-side refusal fallback enabled (fallbacks: "default")
         4. normalize.ts → CAS check digits, date sanity, review flags
         5. update row (status: needs_review)  — or failed + error
   ▼
/dashboard/sds/[id]  human review → confirmSdsReview → status: current
```

| File | Role |
| --- | --- |
| `schema.ts` | Zod schema = the model's output contract; upload limits |
| `extract.ts` | Claude call, image normalization, typed `ScannerError`s |
| `normalize.ts` | Pure validation & review flags (tested in `tests/normalize.test.ts`) |
| `actions.ts` | Server Actions: process upload, confirm review, delete |
| `queries.ts` | Reads (list, detail, signed source URL) |
| `components/` | Uploader, review form, status badge |

Limits: 20 MB per file (bucket), PDF ≤ 600 pages, images re-encoded under Claude's 5 MB cap.
HEIC is rejected client-side (not supported by the API) — iOS camera capture produces JPEG.

Requires `ANTHROPIC_API_KEY` (server only).
