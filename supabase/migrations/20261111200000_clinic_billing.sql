-- ───────────────────────────────────────────────────────────────
-- Billing state per clinic, mirrored from Stripe.
-- Written only by the Stripe webhook / checkout server code through the
-- service role (no INSERT/UPDATE policies). Members can read their row.
-- ───────────────────────────────────────────────────────────────

create table public.clinic_billing (
  clinic_id              uuid primary key references public.clinics (id) on delete cascade,
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  plan                   text check (plan in ('starter', 'pro')),
  billing_cycle          text check (billing_cycle in ('monthly', 'annual')),
  status                 text,
  trial_ends_at          timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table public.clinic_billing is 'Stripe subscription mirror. status = Stripe subscription status (active, trialing, past_due, canceled, …).';

create trigger clinic_billing_set_updated_at
before update on public.clinic_billing
for each row execute function public.set_updated_at();

alter table public.clinic_billing enable row level security;

create policy "Members can read their clinic billing"
  on public.clinic_billing for select
  to authenticated
  using ((select private.is_clinic_member(clinic_id)));
