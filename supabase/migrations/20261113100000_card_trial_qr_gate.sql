-- ───────────────────────────────────────────────────────────────
-- Card-required trial + QR access tied to the subscription.
-- A clinic's team QR view works while its Stripe subscription is
-- trialing/active (or in payment retry), and for 14 days after it ends.
-- Clinics that never started a subscription have no live QR access.
-- ───────────────────────────────────────────────────────────────

alter table public.clinic_billing
  add column ended_at timestamptz,
  add column trial_used boolean not null default false;

create function private.clinic_qr_live(p_clinic_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((
    select b.status in ('trialing', 'active', 'past_due', 'unpaid')
        or (b.status in ('canceled', 'incomplete_expired', 'paused')
            and coalesce(b.ended_at, b.current_period_end) > now() - interval '14 days')
    from public.clinic_billing b
    where b.clinic_id = p_clinic_id
  ), false);
$$;

revoke all on function private.clinic_qr_live(uuid) from public, anon, authenticated;

-- Same payload as before, plus "suspended". Documents are withheld while suspended.
create or replace function public.get_public_safety_library(p_token text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'clinic', jsonb_build_object('name', c.name, 'state', c.state),
    'suspended', not private.clinic_qr_live(c.id),
    'documents', case when not private.clinic_qr_live(c.id) then '[]'::jsonb else coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', d.id,
          'product_name', d.product_name,
          'manufacturer', d.manufacturer,
          'emergency_phone', d.emergency_phone,
          'revision_date', d.revision_date,
          'signal_word', d.signal_word,
          'pictograms', d.pictograms,
          'hazard_statements', d.hazard_statements,
          'ppe', d.ppe,
          'document_type', d.document_type,
          'sections', coalesce((
            select jsonb_agg(s order by (s->>'number')::int)
            from jsonb_array_elements(d.sections) s
            where (s->>'number')::int in (4, 5, 6, 7, 8)
          ), '[]'::jsonb)
        )
        order by lower(coalesce(d.product_name, ''))
      )
      from public.sds_documents d
      where d.clinic_id = c.id and d.status = 'current'
    ), '[]'::jsonb) end
  )
  from public.clinics c
  where c.public_access_token = p_token
    and c.public_access_enabled
    and length(p_token) = 32;
$$;

create or replace function public.get_public_sds_source(p_token text, p_document_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select d.source_path
  from public.sds_documents d
  join public.clinics c on c.id = d.clinic_id
  where c.public_access_token = p_token
    and c.public_access_enabled
    and private.clinic_qr_live(c.id)
    and d.id = p_document_id
    and d.status = 'current';
$$;
