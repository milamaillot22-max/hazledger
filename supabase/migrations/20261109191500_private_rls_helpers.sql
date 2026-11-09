-- Move RLS helper functions out of the API-exposed `public` schema so they
-- cannot be called through /rest/v1/rpc. Policies keep using them.

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter function public.is_clinic_member(uuid) set schema private;
alter function public.has_clinic_role(uuid, text[]) set schema private;
