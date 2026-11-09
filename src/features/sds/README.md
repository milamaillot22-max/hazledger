# SDS feature

Planned layout for the scanner module:

```
features/sds/
  types.ts            # domain model (done)
  schema.ts           # zod schema for SdsExtraction (LLM output validation)
  actions.ts          # server actions: upload, confirm extraction
  extract.ts          # PDF/photo → text → structured SdsExtraction
  components/         # library table, uploader, review screen
```

Routes: `src/app/(app)/dashboard/sds` (library) and `.../sds/scan` (upload + review).
