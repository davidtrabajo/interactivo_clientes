-- ============================================================
-- INTRA · Tabla de envíos del wizard de Base de Conocimiento
-- Proyecto Supabase: uqafbzazngdwznrafoyg
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.kb_submissions (
  id          uuid primary key default gen_random_uuid(),
  giro        text not null default 'hotel',
  nombre      text,
  data        jsonb not null default '{}'::jsonb,
  completion  int not null default 0,
  status      text not null default 'enviado',  -- 'borrador' | 'enviado'
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists kb_submissions_updated_idx on public.kb_submissions (updated_at desc);
create index if not exists kb_submissions_giro_idx    on public.kb_submissions (giro);

-- Mantener updated_at en cada UPDATE
create or replace function public.kb_touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists kb_submissions_touch on public.kb_submissions;
create trigger kb_submissions_touch
  before update on public.kb_submissions
  for each row execute function public.kb_touch_updated_at();

-- ============================================================
-- RLS — MVP (sin auth todavía)
-- El wizard usa la anon key para insertar/actualizar su propio envío,
-- y el admin (protegido por contraseña en frontend) usa la misma key
-- para leer. Cuando integremos Supabase Auth, endurecer estas políticas
-- (ej. select solo para rol 'admin', update solo del propio registro).
-- ============================================================
alter table public.kb_submissions enable row level security;

drop policy if exists kb_insert_anon on public.kb_submissions;
create policy kb_insert_anon on public.kb_submissions
  for insert to anon, authenticated with check (true);

drop policy if exists kb_update_anon on public.kb_submissions;
create policy kb_update_anon on public.kb_submissions
  for update to anon, authenticated using (true) with check (true);

drop policy if exists kb_select_anon on public.kb_submissions;
create policy kb_select_anon on public.kb_submissions
  for select to anon, authenticated using (true);

drop policy if exists kb_delete_anon on public.kb_submissions;
create policy kb_delete_anon on public.kb_submissions
  for delete to anon, authenticated using (true);
