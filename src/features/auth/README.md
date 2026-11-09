# Auth feature

Planned: Supabase Auth (email magic link + Google), organization/location model,
role-based access (owner, safety manager, employee/view-only).

- Pages live in `src/app/(auth)` — `/login`, `/signup`.
- Session refresh and route protection go in `src/proxy.ts` (Next.js 16 renamed
  `middleware.ts` to `proxy.ts`).
- Protected app routes live under `src/app/(app)`.
