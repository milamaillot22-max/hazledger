# HazLedger

SDS management & OSHA HazCom (29 CFR 1910.1200) compliance SaaS for US dental,
veterinary and medical practices.

## Stack

- Next.js 16 (App Router, Cache Components) · React 19 · TypeScript
- Tailwind CSS v4 (tokens in `src/app/globals.css`) · shadcn/ui (radix, `components.json`)
- Fonts: Plus Jakarta Sans (headings, `font-heading`) · Inter (body, `font-sans`)
- zod for env validation (`src/lib/env.ts`)

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Structure

```
src/
  app/
    (marketing)/   landing page — navbar, footer, sticky mobile CTA
    (auth)/        /login, /signup — split-screen layout (Supabase wiring next)
    (app)/         authenticated shell — /dashboard (SDS library + scanner next)
  components/
    ui/            shadcn primitives (add more: npx shadcn@latest add dialog)
    marketing/     landing sections
    brand/         logo
  config/site.ts   brand name, routes, nav, CTA links — single source of truth
  features/
    sds/           SDS domain model (16 GHS sections, pictograms, statuses)
    auth/          auth form shell
  lib/             utils (cn), env
```

## Design system

| Token | Value | Use |
| --- | --- | --- |
| `bg-background` | `#F8FAFC` | page background |
| `bg-white` / `bg-card` | `#FFFFFF` | cards (`shadow-lg shadow-slate-200/50`) |
| `bg-primary` | `#0284C7` | medical blue — buttons, links, key icons |
| `bg-success` | `#059669` | health emerald — OSHA compliance, success |
| `bg-brand-soft` | `#F0F9FF` | tinted icon tiles, pills |
| `text-slate-900` / `text-slate-600` | | headings / body |
| `.card-soft` | white + `slate-200/80` hairline | elevated cards: one hairline border, two very soft shadows |
| `.band-pearl` | `#F8FAFC` → `#FFFFFF` | alternating section bands |
| `.bg-aurora` | faint sky/emerald radial wash | hero and page headers (decorative) |

**Light only** — no dark bands or night surfaces anywhere on the site.
Type: Geist (headings, wordmark) + Inter (body). Logo: `src/components/brand/logo.tsx` is a
plain typographic wordmark; `LogoMark` (neutral hairline frame) is kept for favicons/app chrome. **Photography** — curated
Pexels photos of modern dental, veterinary and medical clinics (`src/assets/images`, sources and
license in `CREDITS.md`), always paired with code-rendered product overlays
(`src/components/product/*`): home hero, specialty cards, solution pages, product gallery,
blog covers, final CTA and the sign-in panel. Review identifiable people before paid ads. Effects (`SpotlightCard`, `Magnetic`) are
decorative and disabled under reduced motion / touch.

## Site map

| Route | Content |
| --- | --- |
| `/` | Hero, demo, compliance flow, ROI dashboard, specialties, pricing, FAQ |
| `/product` | Product detail, features, security, comparison, roadmap |
| `/pricing` | Single Pro plan, calculator, pricing FAQ |
| `/solutions/[slug]` | Dental, veterinary, medical niche pages |
| `/resources/blog`, `/resources/blog/[slug]` | Sourced OSHA articles (`src/features/blog/posts.ts`) |

## SDS scanner

Upload a PDF or photo → Claude extracts product, hazards, CAS numbers and the 16
sections → a human reviews → the record goes live. Details: `src/features/sds/README.md`.

```bash
npm test   # unit tests (CAS validation, review flags)
```

Set `ANTHROPIC_API_KEY` in `.env.local` (and in your host) to enable it.

## Team QR access

`/dashboard/team-access` shows the clinic's QR code and prints a US Letter poster
(`/dashboard/team-access/print`, `@media print`). Staff scan it to open `/c/<token>` —
a login-free, read-only view of **confirmed** SDSs (first aid, spills, PPE first),
served only through `get_public_safety_library()`. Owners can regenerate the code,
which disables old posters. Set `NEXT_PUBLIC_SITE_URL` to the production domain before
printing; "Open the full SDS" links appear once `SUPABASE_SERVICE_ROLE_KEY` is set.

## Growth surfaces

- **Risk & ROI calculator** (`src/features/roi/calculator.ts`, tested): published OSHA
  maximums + size reduction from `src/config/compliance.ts`, editable time assumptions,
  plan prices from `src/config/pricing.ts`. ROI counts staff time only — never risk avoided.
- **Pricing** (`src/config/pricing.ts`, tested): one plan, Pro $149 per location, annual =
  2 months free; prices show monthly by default with the annual price as a subtitle. Plan
  limits are commercial terms, enforced once billing (Stripe) ships. Pro = unlimited AI scans
  (fair use), binder import, inspection report, priority support — **shipped features only**
  (a test fails if a Pro feature or matrix cell is marked "soon").
- **Inspection report** `/dashboard/sds/report`: dated SDS index (CAS, signal word, revision,
  items to check) printed or saved as PDF from the browser; logic in `src/features/sds/report.ts`.
  The chosen plan/billing is stored on new accounts (`selected_plan`, `selected_billing`).
- **Domain**: `NEXT_PUBLIC_SITE_URL` defaults to `https://gethazledger.com` (canonical URLs,
  Open Graph, sitemap, QR posters). Set `http://localhost:3000` locally only to test QR links.
- **Solution pages** `/solutions/{dental-compliance,veterinary-safety,medical-clinics}`:
  content in `src/features/solutions/data.ts`, OG image, SoftwareApplication + FAQ +
  Breadcrumb JSON-LD, `sitemap.xml`, `robots.txt`. The trial form prefills `/signup` and
  stores `signup_source` on the new account.
- **Activation**: onboarding → `/dashboard/team-access?welcome=1` → print poster
  (`clinics.qr_poster_printed_at`) → scan → confirm.

## Billing (Stripe)

- **Products** in the HazLedger Stripe account: `HazLedger Pro` (Starter archived), prices with
  lookup keys `hazledger_{starter|pro}_{monthly|annual}` ($79/$790, $149/$1,490), tax code
  `txcd_10103001` (SaaS, business use). Missing prices are created on first checkout (fresh/test accounts).
- **Flow**: create clinic → `/dashboard/billing` (app pages redirect there until a plan exists) →
  Stripe Checkout with a **card required** and a 14-day trial (`trialing`, $0 today, one trial per
  clinic) → the success page confirms the session immediately; the webhook mirrors every change into
  `clinic_billing` (service role). Plan changes, card, invoices and cancellation: Stripe customer portal.
- **Gates** (`src/features/billing/entitlement.ts`, tested): trial capped at 15 SDSs / 30 scans;
  Pro unlimited (Starter retired; its limits remain only for legacy rows). No plan or ended subscription: no new scans.
- **Team QR**: live while trialing/active/past_due and for 14 days after a subscription ends, then the
  staff view shows "access paused". Enforced in SQL (`private.clinic_qr_live`), not only in the UI.
- **Stripe settings to keep on**: Billing → Subscriptions and emails → send a reminder email
  before a trial ends (several US states require it for auto-renewing trials).
- **Environment (Vercel → Settings → Environment Variables, never in the repo or chat)**:
  `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` (webhook writes),
  optional `STRIPE_AUTOMATIC_TAX=true` once Stripe Tax registrations exist.
- **Webhook**: Stripe Dashboard → Developers → Webhooks → endpoint `https://<domain>/api/stripe/webhook`,
  events `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`,
  `customer.subscription.deleted`.

## Claims policy

Marketing copy must stay literally true: no "OSHA certified/compliant" (OSHA certifies no
software), no ratings or testimonials until real ones exist, no fixed ROI claims. Update
`src/config/compliance.ts` every January from osha.gov/penalties.

- **Logo badge** reads "HazCom 2024 Ready" (the standard), never "OSHA … Ready" (OSHA endorses no software).
- **No chat / support widget** until a staffed support tool exists. Never imply live support.

## Push to GitHub

```bash
# 1. Create an empty private repo (GitHub CLI), then push
gh repo create hazledger --private --source=. --remote=origin --push

# …or with a repo you created on github.com
git remote add origin git@github.com:<you>/hazledger.git
git push -u origin main
```

`.env.local` is git-ignored — set the same variables in your host (Vercel/Netlify).

## Before launch

- Re-check OSHA penalty floors and HazCom 2024 copy against osha.gov.
- Replace `siteConfig.links.bookDemo` with a real booking link.
- Validate every product claim on the page (comparison table, trust badges) against what ships.
