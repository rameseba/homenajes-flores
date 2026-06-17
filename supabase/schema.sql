-- ════════════════════════════════════════════════════════════════════════════
-- Homenajes Florales — esquema de Supabase
-- Ejecutar en el SQL Editor del proyecto (plan free).
--
-- Modelo: el sitio guarda TODO su contenido editable en una sola fila JSONB.
-- Login único de administrador (sin roles): cualquier sesión autenticada puede
-- editar. El registro público de usuarios debe quedar DESHABILITADO en
-- Authentication → Providers → Email, y la cuenta admin se crea a mano.
-- ════════════════════════════════════════════════════════════════════════════

-- ── Contenido del sitio ──────────────────────────────────────────────────────
create table if not exists public.site_content (
  id integer primary key default 1,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint site_content_single_row check (id = 1)
);

alter table public.site_content enable row level security;

-- Lectura pública (el sitio la usa para aplicar los overrides).
drop policy if exists "site_content_read" on public.site_content;
create policy "site_content_read"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Escritura solo con sesión iniciada.
drop policy if exists "site_content_write" on public.site_content;
create policy "site_content_write"
  on public.site_content for all
  to authenticated
  using (true)
  with check (true);

-- ── Bitácora de cambios ──────────────────────────────────────────────────────
create table if not exists public.content_audit (
  id bigint generated always as identity primary key,
  editor_email text,
  action text,
  created_at timestamptz not null default now()
);

alter table public.content_audit enable row level security;

drop policy if exists "content_audit_read" on public.content_audit;
create policy "content_audit_read"
  on public.content_audit for select
  to authenticated
  using (true);

drop policy if exists "content_audit_insert" on public.content_audit;
create policy "content_audit_insert"
  on public.content_audit for insert
  to authenticated
  with check (true);

-- ── Storage: bucket de medios (imágenes subidas desde el editor) ─────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media_auth_insert" on storage.objects;
create policy "media_auth_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

drop policy if exists "media_auth_update" on storage.objects;
create policy "media_auth_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

drop policy if exists "media_auth_delete" on storage.objects;
create policy "media_auth_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');

-- ── Pasos finales (manuales en el dashboard) ─────────────────────────────────
-- 1) Authentication → Providers → Email: desactivar "Allow new users to sign up".
-- 2) Authentication → Users → Add user: crear la cuenta del cliente (email + clave).
-- 3) Project Settings → API: copiar URL y anon key a .env.local del proyecto.
