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

Rules: bright surfaces only, soft shadows, rounded-2xl cards, blue for actions,
emerald for compliance. Photos: `src/assets/images` (credits in `CREDITS.md`).

## SDS scanner

Upload a PDF or photo → Claude extracts product, hazards, CAS numbers and the 16
sections → a human reviews → the record goes live. Details: `src/features/sds/README.md`.

```bash
npm test   # unit tests (CAS validation, review flags)
```

Set `ANTHROPIC_API_KEY` in `.env.local` (and in your host) to enable it.

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
