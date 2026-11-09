-- =============================================================================
-- Rutify — esquema inicial
-- Todas las filas pertenecen a un entrenador (entrenador_id = auth.uid()).
-- Las FK compuestas (x_id, entrenador_id) garantizan que una fila hija nunca
-- apunte a un padre de otro entrenador.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Utilidades
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- alumnos
-- -----------------------------------------------------------------------------
create table public.alumnos (
  id uuid primary key default gen_random_uuid(),
  entrenador_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nombre text not null check (char_length(nombre) between 1 and 80),
  apellido text not null check (char_length(apellido) between 1 and 80),
  telefono text check (char_length(telefono) <= 30),
  email text check (char_length(email) <= 254),
  fecha_nacimiento date,
  objetivo text check (char_length(objetivo) <= 500),
  nivel text check (nivel in ('principiante', 'intermedio', 'avanzado')),
  lesiones_limitaciones text check (char_length(lesiones_limitaciones) <= 2000),
  notas text check (char_length(notas) <= 5000),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, entrenador_id)
);

create index alumnos_entrenador_activo_apellido_idx
  on public.alumnos (entrenador_id, activo, apellido, nombre);

-- -----------------------------------------------------------------------------
-- ejercicios
-- -----------------------------------------------------------------------------
create table public.ejercicios (
  id uuid primary key default gen_random_uuid(),
  entrenador_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id_externo text,                                   -- id en free-exercise-db (null si es propio)
  nombre text not null check (char_length(nombre) between 1 and 150),
  nombre_es text check (char_length(nombre_es) between 1 and 150),
  musculos_primarios text[] not null default '{}',
  musculos_secundarios text[] not null default '{}',
  equipamiento text,                                 -- claves del dataset (ver src/lib/etiquetas.ts)
  categoria text,
  mecanica text,
  nivel text,
  instrucciones text[] not null default '{}',
  instrucciones_es text[],
  imagen_inicio text,                                -- path en Storage (bucket "ejercicios")
  imagen_fin text,
  es_propio boolean not null default false,
  favorito boolean not null default false,
  archivado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, entrenador_id),
  unique (entrenador_id, id_externo)
);

-- -----------------------------------------------------------------------------
-- rutinas (alumno_id null = plantilla)
-- -----------------------------------------------------------------------------
create table public.rutinas (
  id uuid primary key default gen_random_uuid(),
  entrenador_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  alumno_id uuid,
  nombre text not null check (char_length(nombre) between 1 and 120),
  objetivo text check (char_length(objetivo) <= 500),
  fecha_inicio date,
  semanas smallint check (semanas between 1 and 52),
  notas text check (char_length(notas) <= 5000),
  es_plantilla boolean generated always as (alumno_id is null) stored,
  origen_id uuid references public.rutinas (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, entrenador_id),
  foreign key (alumno_id, entrenador_id)
    references public.alumnos (id, entrenador_id) on delete cascade
);

create index rutinas_alumno_fecha_idx
  on public.rutinas (alumno_id, fecha_inicio desc nulls last);
create index rutinas_entrenador_plantilla_idx
  on public.rutinas (entrenador_id, es_plantilla, updated_at desc);
create index rutinas_origen_idx on public.rutinas (origen_id);

-- -----------------------------------------------------------------------------
-- rutina_dias
-- -----------------------------------------------------------------------------
create table public.rutina_dias (
  id uuid primary key default gen_random_uuid(),
  entrenador_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  rutina_id uuid not null,
  orden integer not null check (orden >= 0),
  nombre text not null check (char_length(nombre) between 1 and 150),
  indicaciones text check (char_length(indicaciones) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, entrenador_id),
  constraint rutina_dias_orden_unico unique (rutina_id, orden) deferrable initially deferred,
  foreign key (rutina_id, entrenador_id)
    references public.rutinas (id, entrenador_id) on delete cascade
);

create index rutina_dias_entrenador_idx on public.rutina_dias (entrenador_id);

-- -----------------------------------------------------------------------------
-- rutina_ejercicios
-- -----------------------------------------------------------------------------
create table public.rutina_ejercicios (
  id uuid primary key default gen_random_uuid(),
  entrenador_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dia_id uuid not null,
  ejercicio_id uuid not null,
  orden integer not null check (orden >= 0),
  series text check (char_length(series) <= 30),
  repeticiones text check (char_length(repeticiones) <= 30),
  rir text check (char_length(rir) <= 30),
  descanso text check (char_length(descanso) <= 30),
  carga text check (char_length(carga) <= 50),
  tecnica text check (char_length(tecnica) <= 80),
  notas text check (char_length(notas) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rutina_ejercicios_orden_unico unique (dia_id, orden) deferrable initially deferred,
  foreign key (dia_id, entrenador_id)
    references public.rutina_dias (id, entrenador_id) on delete cascade,
  foreign key (ejercicio_id, entrenador_id)
    references public.ejercicios (id, entrenador_id) on delete restrict
);

create index rutina_ejercicios_ejercicio_idx on public.rutina_ejercicios (ejercicio_id, entrenador_id);
create index rutina_ejercicios_entrenador_idx on public.rutina_ejercicios (entrenador_id);

-- -----------------------------------------------------------------------------
-- rutina_progresiones
-- -----------------------------------------------------------------------------
create table public.rutina_progresiones (
  id uuid primary key default gen_random_uuid(),
  entrenador_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  rutina_id uuid not null,
  semana smallint not null check (semana between 1 and 52),
  orden integer not null default 0,
  descripcion text not null check (char_length(descripcion) between 1 and 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (rutina_id, entrenador_id)
    references public.rutinas (id, entrenador_id) on delete cascade
);

create index rutina_progresiones_rutina_idx on public.rutina_progresiones (rutina_id, semana, orden);
create index rutina_progresiones_entrenador_idx on public.rutina_progresiones (entrenador_id);

-- -----------------------------------------------------------------------------
-- configuracion (una fila por entrenador)
-- -----------------------------------------------------------------------------
create table public.configuracion (
  entrenador_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  nombre_entrenador text check (char_length(nombre_entrenador) <= 120),
  logo_path text,
  telefono text check (char_length(telefono) <= 30),
  instagram text check (char_length(instagram) <= 60),
  email text check (char_length(email) <= 254),
  texto_pie_pdf text check (char_length(texto_pie_pdf) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Triggers updated_at
-- -----------------------------------------------------------------------------
create trigger alumnos_updated_at before update on public.alumnos
  for each row execute function public.set_updated_at();
create trigger ejercicios_updated_at before update on public.ejercicios
  for each row execute function public.set_updated_at();
create trigger rutinas_updated_at before update on public.rutinas
  for each row execute function public.set_updated_at();
create trigger rutina_dias_updated_at before update on public.rutina_dias
  for each row execute function public.set_updated_at();
create trigger rutina_ejercicios_updated_at before update on public.rutina_ejercicios
  for each row execute function public.set_updated_at();
create trigger rutina_progresiones_updated_at before update on public.rutina_progresiones
  for each row execute function public.set_updated_at();
create trigger configuracion_updated_at before update on public.configuracion
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Privilegios: las tablas nuevas no se exponen solas a la Data API.
-- Solo "authenticated" accede; "anon" no ve nada.
-- -----------------------------------------------------------------------------
revoke all on table
  public.alumnos, public.ejercicios, public.rutinas, public.rutina_dias,
  public.rutina_ejercicios, public.rutina_progresiones, public.configuracion
from anon, public;

grant select, insert, update, delete on table
  public.alumnos, public.ejercicios, public.rutinas, public.rutina_dias,
  public.rutina_ejercicios, public.rutina_progresiones, public.configuracion
to authenticated;

-- service_role (scripts de seed/admin, nunca expuesto al navegador) ignora RLS.
grant select, insert, update, delete on table
  public.alumnos, public.ejercicios, public.rutinas, public.rutina_dias,
  public.rutina_ejercicios, public.rutina_progresiones, public.configuracion
to service_role;

-- -----------------------------------------------------------------------------
-- Row Level Security: cada entrenador ve y modifica solo sus filas.
-- -----------------------------------------------------------------------------
alter table public.alumnos enable row level security;
alter table public.ejercicios enable row level security;
alter table public.rutinas enable row level security;
alter table public.rutina_dias enable row level security;
alter table public.rutina_ejercicios enable row level security;
alter table public.rutina_progresiones enable row level security;
alter table public.configuracion enable row level security;

create policy "alumnos_del_entrenador" on public.alumnos
  for all to authenticated
  using ((select auth.uid()) = entrenador_id)
  with check ((select auth.uid()) = entrenador_id);

create policy "ejercicios_del_entrenador" on public.ejercicios
  for all to authenticated
  using ((select auth.uid()) = entrenador_id)
  with check ((select auth.uid()) = entrenador_id);

create policy "rutinas_del_entrenador" on public.rutinas
  for all to authenticated
  using ((select auth.uid()) = entrenador_id)
  with check ((select auth.uid()) = entrenador_id);

create policy "rutina_dias_del_entrenador" on public.rutina_dias
  for all to authenticated
  using ((select auth.uid()) = entrenador_id)
  with check ((select auth.uid()) = entrenador_id);

create policy "rutina_ejercicios_del_entrenador" on public.rutina_ejercicios
  for all to authenticated
  using ((select auth.uid()) = entrenador_id)
  with check ((select auth.uid()) = entrenador_id);

create policy "rutina_progresiones_del_entrenador" on public.rutina_progresiones
  for all to authenticated
  using ((select auth.uid()) = entrenador_id)
  with check ((select auth.uid()) = entrenador_id);

create policy "configuracion_del_entrenador" on public.configuracion
  for all to authenticated
  using ((select auth.uid()) = entrenador_id)
  with check ((select auth.uid()) = entrenador_id);

-- -----------------------------------------------------------------------------
-- Funciones de negocio (security invoker: respetan RLS)
-- -----------------------------------------------------------------------------

-- Reordena los días de una rutina según el orden del array de ids.
create or replace function public.reordenar_dias(p_rutina_id uuid, p_ids uuid[])
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.rutina_dias d
  set orden = (o.pos - 1)::integer
  from unnest(p_ids) with ordinality as o(id, pos)
  where d.id = o.id
    and d.rutina_id = p_rutina_id;
$$;

-- Reordena los ejercicios de un día según el orden del array de ids.
create or replace function public.reordenar_ejercicios(p_dia_id uuid, p_ids uuid[])
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.rutina_ejercicios e
  set orden = (o.pos - 1)::integer
  from unnest(p_ids) with ordinality as o(id, pos)
  where e.id = o.id
    and e.dia_id = p_dia_id;
$$;

-- Copia una rutina completa (días, ejercicios y progresiones).
--   p_alumno_id null  -> la copia es una plantilla
--   p_alumno_id dado  -> la copia es una rutina de ese alumno (fecha_inicio = hoy)
create or replace function public.duplicar_rutina(
  p_rutina_id uuid,
  p_alumno_id uuid default null,
  p_nombre text default null
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_nueva_id uuid;
begin
  insert into public.rutinas (alumno_id, nombre, objetivo, fecha_inicio, semanas, notas, origen_id)
  select
    p_alumno_id,
    coalesce(nullif(trim(p_nombre), ''), r.nombre),
    r.objetivo,
    case when p_alumno_id is null then null else current_date end,
    r.semanas,
    r.notas,
    r.id
  from public.rutinas r
  where r.id = p_rutina_id
  returning id into v_nueva_id;

  if v_nueva_id is null then
    raise exception 'Rutina no encontrada' using errcode = 'P0002';
  end if;

  -- Días: se mapean por "orden", que es único dentro de cada rutina.
  with dias_origen as (
    select id, orden, nombre, indicaciones
    from public.rutina_dias
    where rutina_id = p_rutina_id
  ),
  dias_nuevos as (
    insert into public.rutina_dias (rutina_id, orden, nombre, indicaciones)
    select v_nueva_id, orden, nombre, indicaciones
    from dias_origen
    returning id, orden
  )
  insert into public.rutina_ejercicios
    (dia_id, ejercicio_id, orden, series, repeticiones, rir, descanso, carga, tecnica, notas)
  select
    dn.id, e.ejercicio_id, e.orden, e.series, e.repeticiones, e.rir,
    e.descanso, e.carga, e.tecnica, e.notas
  from dias_nuevos dn
  join dias_origen d on d.orden = dn.orden
  join public.rutina_ejercicios e on e.dia_id = d.id;

  insert into public.rutina_progresiones (rutina_id, semana, orden, descripcion)
  select v_nueva_id, semana, orden, descripcion
  from public.rutina_progresiones
  where rutina_id = p_rutina_id;

  return v_nueva_id;
end;
$$;

revoke execute on function
  public.reordenar_dias(uuid, uuid[]),
  public.reordenar_ejercicios(uuid, uuid[]),
  public.duplicar_rutina(uuid, uuid, text)
from public, anon;

grant execute on function
  public.reordenar_dias(uuid, uuid[]),
  public.reordenar_ejercicios(uuid, uuid[]),
  public.duplicar_rutina(uuid, uuid, text)
to authenticated;

revoke execute on function public.set_updated_at() from public, anon, authenticated;

-- -----------------------------------------------------------------------------
-- Storage
--   ejercicios: dataset/<id_externo>/{0,1}.jpg  (seed, con la secret key)
--               <uid>/<ejercicio_id>/{inicio,fin}.jpg (fotos propias)
--   marca:      <uid>/logo.<ext>
-- Lectura pública (PDF e <img>); escritura solo dentro de la carpeta propia.
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('ejercicios', 'ejercicios', true, 2097152, array['image/jpeg', 'image/png']),
  ('marca', 'marca', true, 2097152, array['image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "storage_select_carpeta_propia" on storage.objects
  for select to authenticated
  using (
    bucket_id in ('ejercicios', 'marca')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "storage_insert_carpeta_propia" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('ejercicios', 'marca')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "storage_update_carpeta_propia" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('ejercicios', 'marca')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id in ('ejercicios', 'marca')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "storage_delete_carpeta_propia" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('ejercicios', 'marca')
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
