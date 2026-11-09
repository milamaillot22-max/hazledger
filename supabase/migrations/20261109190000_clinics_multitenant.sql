-- ───────────────────────────────────────────────────────────────
-- Multi-tenant core: clinics + memberships
-- Tenancy model: a user belongs to one or more clinics through
-- clinic_members; every tenant-scoped table will carry clinic_id and
-- be guarded by public.is_clinic_member(clinic_id).
-- ───────────────────────────────────────────────────────────────

create table public.clinics (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(btrim(name)) between 2 and 120),
  state         text not null check (state ~ '^[A-Z]{2}$'),
  practice_type text not null check (practice_type in (
    'dental', 'orthodontics', 'oral_surgery', 'veterinary', 'dermatology',
    'med_spa', 'primary_care', 'urgent_care', 'optometry', 'podiatry',
    'physical_therapy', 'chiropractic', 'other'
  )),
  created_by    uuid not null references auth.users (id) on delete restrict,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.clinics is 'Tenant root. One row per clinic / practice location.';
comment on column public.clinics.state is 'USPS two-letter state code (e.g. CA, TX, DC).';

create table public.clinic_members (
  clinic_id  uuid not null references public.clinics (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  role       text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (clinic_id, user_id)
);

create index clinic_members_user_id_idx on public.clinic_members (user_id);
create index clinics_created_by_idx on public.clinics (created_by);

-- updated_at trigger
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clinics_set_updated_at
before update on public.clinics
for each row execute function public.set_updated_at();

-- ── Membership helpers (security definer: avoid RLS recursion) ──
create function public.is_clinic_member(p_clinic_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.clinic_members m
    where m.clinic_id = p_clinic_id
      and m.user_id = (select auth.uid())
  );
$$;

create function public.has_clinic_role(p_clinic_id uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.clinic_members m
    where m.clinic_id = p_clinic_id
      and m.user_id = (select auth.uid())
      and m.role = any (p_roles)
  );
$$;

-- ── RLS ──
alter table public.clinics enable row level security;
alter table public.clinic_members enable row level security;

create policy "Members can read their clinics"
  on public.clinics for select
  to authenticated
  using ((select public.is_clinic_member(id)));

create policy "Owners and admins can update their clinic"
  on public.clinics for update
  to authenticated
  using ((select public.has_clinic_role(id, array['owner', 'admin'])))
  with check ((select public.has_clinic_role(id, array['owner', 'admin'])));

create policy "Members can read memberships of their clinics"
  on public.clinic_members for select
  to authenticated
  using ((select public.is_clinic_member(clinic_id)));

-- No INSERT/DELETE policies: clinics are created only through
-- public.create_clinic(), which also creates the owner membership atomically.

-- ── Onboarding RPC ──
create function public.create_clinic(
  p_name text,
  p_state text,
  p_practice_type text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id   uuid := auth.uid();
  v_clinic_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  insert into public.clinics (name, state, practice_type, created_by)
  values (btrim(p_name), upper(btrim(p_state)), p_practice_type, v_user_id)
  returning id into v_clinic_id;

  insert into public.clinic_members (clinic_id, user_id, role)
  values (v_clinic_id, v_user_id, 'owner');

  return v_clinic_id;
end;
$$;

revoke all on function public.create_clinic(text, text, text) from public, anon;
grant execute on function public.create_clinic(text, text, text) to authenticated;

revoke all on function public.is_clinic_member(uuid) from public, anon;
grant execute on function public.is_clinic_member(uuid) to authenticated;

revoke all on function public.has_clinic_role(uuid, text[]) from public, anon;
grant execute on function public.has_clinic_role(uuid, text[]) to authenticated;
