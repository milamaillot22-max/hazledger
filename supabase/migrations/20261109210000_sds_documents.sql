-- ───────────────────────────────────────────────────────────────
-- SDS library + private storage for source files
-- Lifecycle: processing → needs_review → current   (or failed)
-- ───────────────────────────────────────────────────────────────

create table public.sds_documents (
  id                  uuid primary key default gen_random_uuid(),
  clinic_id           uuid not null references public.clinics (id) on delete cascade,
  status              text not null default 'processing'
                        check (status in ('processing', 'needs_review', 'current', 'failed')),
  document_type       text check (document_type in ('sds', 'label', 'other')),
  product_name        text,
  manufacturer        text,
  manufacturer_phone  text,
  emergency_phone     text,
  recommended_use     text,
  revision_date       date,
  signal_word         text check (signal_word in ('Danger', 'Warning')),
  pictograms          text[] not null default '{}'
                        check (pictograms <@ array['GHS01','GHS02','GHS03','GHS04','GHS05','GHS06','GHS07','GHS08','GHS09']),
  cas_numbers         text[] not null default '{}',
  hazard_statements   jsonb not null default '[]'::jsonb,
  ingredients         jsonb not null default '[]'::jsonb,
  ppe                 text[] not null default '{}',
  sections            jsonb not null default '[]'::jsonb,
  confidence          jsonb not null default '{}'::jsonb,
  review_flags        text[] not null default '{}',
  extraction          jsonb,
  extraction_model    text,
  error               text,
  source_path         text not null,
  source_name         text,
  source_mime         text not null,
  source_size         integer not null check (source_size > 0),
  created_by          uuid not null default auth.uid() references auth.users (id),
  reviewed_by         uuid references auth.users (id),
  reviewed_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint sds_source_in_clinic_folder check (split_part(source_path, '/', 1) = clinic_id::text)
);

create index sds_documents_clinic_status_idx on public.sds_documents (clinic_id, status);
create index sds_documents_clinic_created_idx on public.sds_documents (clinic_id, created_at desc);

create trigger sds_documents_set_updated_at
before update on public.sds_documents
for each row execute function public.set_updated_at();

alter table public.sds_documents enable row level security;

create policy "Members read their clinic's SDS library"
  on public.sds_documents for select to authenticated
  using ((select private.is_clinic_member(clinic_id)));

create policy "Owners and admins add SDS documents"
  on public.sds_documents for insert to authenticated
  with check (
    (select private.has_clinic_role(clinic_id, array['owner', 'admin']))
    and created_by = (select auth.uid())
  );

create policy "Owners and admins update SDS documents"
  on public.sds_documents for update to authenticated
  using ((select private.has_clinic_role(clinic_id, array['owner', 'admin'])))
  with check ((select private.has_clinic_role(clinic_id, array['owner', 'admin'])));

create policy "Owners and admins delete SDS documents"
  on public.sds_documents for delete to authenticated
  using ((select private.has_clinic_role(clinic_id, array['owner', 'admin'])));

-- ── Storage: private bucket, one folder per clinic: <clinic_id>/<uuid>.<ext> ──
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'sds-files', 'sds-files', false, 20971520,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Safe folder → clinic id (null instead of a cast error for malformed paths)
create function private.clinic_id_from_path(p_name text)
returns uuid
language sql
immutable
set search_path = ''
as $$
  select case
    when split_part(p_name, '/', 1) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
      then split_part(p_name, '/', 1)::uuid
  end;
$$;

grant execute on function private.clinic_id_from_path(text) to authenticated;

create policy "Members read their clinic's SDS files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'sds-files'
    and (select private.is_clinic_member(private.clinic_id_from_path(name)))
  );

create policy "Owners and admins upload SDS files"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'sds-files'
    and (select private.has_clinic_role(private.clinic_id_from_path(name), array['owner', 'admin']))
  );

create policy "Owners and admins delete SDS files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'sds-files'
    and (select private.has_clinic_role(private.clinic_id_from_path(name), array['owner', 'admin']))
  );
