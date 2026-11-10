-- ───────────────────────────────────────────────────────────────
-- Team QR access: a revocable, unguessable token per clinic that opens a
-- read-only, login-free view of the clinic's CURRENT SDSs
-- (HazCom 1910.1200(g)(8): no barriers to employee access).
-- Anonymous callers never touch tables directly — only these functions,
-- which return safety fields only.
-- ───────────────────────────────────────────────────────────────

alter table public.clinics
  add column public_access_token text not null unique
    default replace(gen_random_uuid()::text, '-', ''),
  add column public_access_enabled boolean not null default true,
  add column public_access_rotated_at timestamptz;

-- Read-only safety library for a token. Null when the token is unknown or disabled.
create function public.get_public_safety_library(p_token text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'clinic', jsonb_build_object('name', c.name, 'state', c.state),
    'documents', coalesce((
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
          -- Emergency-relevant sections only: first aid, fire, spills, handling, exposure/PPE
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
    ), '[]'::jsonb)
  )
  from public.clinics c
  where c.public_access_token = p_token
    and c.public_access_enabled
    and length(p_token) = 32;
$$;

-- Storage path of one current SDS reachable through a token (for signed links).
create function public.get_public_sds_source(p_token text, p_document_id uuid)
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
    and d.id = p_document_id
    and d.status = 'current';
$$;

-- Owners/admins invalidate printed posters by rotating the token.
create function public.rotate_clinic_access_token(p_clinic_id uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token text := replace(gen_random_uuid()::text, '-', '');
begin
  if not private.has_clinic_role(p_clinic_id, array['owner', 'admin']) then
    raise exception 'Not allowed' using errcode = '42501';
  end if;
  update public.clinics
     set public_access_token = v_token,
         public_access_rotated_at = now()
   where id = p_clinic_id;
  return v_token;
end;
$$;

revoke all on function public.get_public_safety_library(text) from public;
grant execute on function public.get_public_safety_library(text) to anon, authenticated;

revoke all on function public.get_public_sds_source(text, uuid) from public;
grant execute on function public.get_public_sds_source(text, uuid) to anon, authenticated;

revoke all on function public.rotate_clinic_access_token(uuid) from public, anon;
grant execute on function public.rotate_clinic_access_token(uuid) to authenticated;
