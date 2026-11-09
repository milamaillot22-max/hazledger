# Auth & multi-tenancy

## Flow

1. `/login` or `/signup` → magic link (`sendMagicLink`) or Google (`signInWithGoogle`).
2. Supabase redirects to `/auth/callback?code=…` → session cookie set → `next` (default `/dashboard`).
3. `/dashboard` calls `requireClinic()`; users with no clinic go to `/onboarding`.
4. `/onboarding` → `createClinic` action → `public.create_clinic()` RPC creates the
   clinic + the `owner` membership atomically → `/dashboard`.

## Layers

| Layer | File | Role |
| --- | --- | --- |
| Proxy | `src/proxy.ts`, `src/lib/supabase/proxy.ts` | Refresh session cookies, optimistic redirects |
| DAL | `src/lib/auth/dal.ts` | `getUser`, `requireUser`, `getActiveClinic`, `requireClinic` |
| Database | `supabase/migrations/*` | RLS: members read their clinic; owners/admins update |

Every new tenant table: add `clinic_id uuid not null references clinics(id)`,
enable RLS, and guard with `private.is_clinic_member(clinic_id)`.

## Supabase dashboard setup (required)

- **Auth → URL Configuration**: Site URL = production URL; add redirect URLs
  `http://localhost:3000/auth/callback` and `https://<prod-domain>/auth/callback`.
- **Auth → Providers → Google**: enable, paste the Google OAuth client ID/secret;
  in Google Cloud, authorized redirect URI =
  `https://nugbzlszrfetuzloiqrc.supabase.co/auth/v1/callback`.
- **Auth → SMTP**: configure a custom SMTP sender (the built-in one is rate-limited).
