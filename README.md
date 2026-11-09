# HazLedger

SDS management & OSHA HazCom (29 CFR 1910.1200) compliance SaaS for US workplaces.

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
| `bg-background` | `#FAFAFA` | matte off-white canvas |
| `bg-primary` | `#0A5C36` | Deep Emerald — CTAs, accents |
| `bg-brand-deep` | `#042F1E` | dark bands, auth panel |
| `bg-brand-soft` | `#E8F2EC` | tinted brand surfaces |
| `text-foreground` | slate-900 | headings, body |
| `text-muted-foreground` | slate-600 | secondary text |
| `border-border` | `#E2E8F0` | hairline borders |

Rules: no gradients, hairline borders over shadows, mono eyebrows, one primary CTA per view.

## Before launch

- Re-check OSHA penalty floors and HazCom 2024 copy against osha.gov.
- Replace `siteConfig.links.bookDemo` with a real booking link.
- Validate every product claim on the page (comparison table, trust badges) against what ships.
