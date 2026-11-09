@AGENTS.md

# Rutify

Web app para que **un** personal trainer gestione a sus alumnos y les arme rutinas de gimnasio que se exportan a PDF con imágenes de cada ejercicio. El único usuario es el entrenador; los alumnos NO tienen cuenta (son registros en la base). Uso comercial.

- Interfaz 100% en español (Argentina, voseo: "Ingresá", "Guardá").
- **Mobile-first**: el entrenador la usa sobre todo desde el celular. Áreas táctiles ≥ 44px; probar siempre en 390×844.

## Stack

- Next.js 16 (App Router, `src/`, Turbopack) + React 19 + TypeScript estricto (`noUncheckedIndexedAccess`).
- Tailwind CSS v4 + shadcn/ui (preset radix-nova, componentes en `src/components/ui`; se pueden editar).
- Supabase: Auth (email + contraseña, registro deshabilitado), Postgres con RLS, Storage.
- Zod v4 + react-hook-form (`@hookform/resolvers/zod`).
- PDF: `@react-pdf/renderer`, **generado en el navegador** (ver "Decisiones").
- Drag & drop: `@dnd-kit`.
- Toasts: `sonner`. Tema claro/oscuro: `next-themes`.

## Comandos

```bash
npm run dev          # servidor de desarrollo (http://localhost:3000)
npm run build        # build de producción
npm run typecheck    # next typegen + tsc
npm run lint         # eslint
npm run check        # typecheck + lint

npm run db:link      # vincular el proyecto Supabase (una vez): npx supabase link --project-ref <ref>
npm run db:push      # aplicar migraciones pendientes al proyecto vinculado
npm run db:types     # regenerar src/types/database.ts desde el proyecto vinculado
npm run db:advisors  # chequeos de seguridad/performance de Supabase
npx supabase migration new <nombre>   # crear una migración nueva (nunca inventar el nombre a mano)
```

No hay Docker: se desarrolla contra un **proyecto Supabase cloud de desarrollo**. La CLI v3 apunta a local por defecto, por eso los scripts usan `--remote`.

## Estructura

```
src/
  proxy.ts                 # (ex middleware) refresca la sesión y redirige a /login
  app/(auth)/login         # pública
  app/(app)/...            # privada: layout con requerirUsuario() + navegación
  modulos/<dominio>/       # alumnos, ejercicios, rutinas, configuracion, auth, pdf
    esquemas.ts            # Zod (compartido form ↔ action)
    acciones.ts            # 'use server' → ResultadoAccion
    consultas.ts           # lecturas server-only
    componentes/
  components/ui            # shadcn
  components/layout        # navegación, encabezados, estados vacíos
  lib/supabase/            # client.ts (navegador), server.ts, proxy.ts
  lib/auth.ts              # requerirUsuario() (DAL, usa getClaims)
  lib/acciones.ts          # ResultadoAccion, exito/fallo, mensajeErrorBD
  types/database.ts        # GENERADO con npm run db:types
supabase/migrations        # SQL versionado
scripts/                   # seed de ejercicios (free-exercise-db)
```

## Convenciones

- **Código, tablas, columnas, archivos y funciones en español**, consistentes (`alumnos`, `rutina_dias`, `crearAlumno`, `esquemaAlumno`). Las librerías y las palabras reservadas quedan como son.
- **Componentes de servidor por defecto**; `"use client"` solo donde hay interacción.
- **Mutaciones con Server Actions** en `modulos/<dominio>/acciones.ts`. Cada acción:
  1. valida con el mismo esquema Zod del formulario (`safeParse` → `falloValidacion`),
  2. usa `crearClienteServidor()` (RLS hace la autorización; nunca la secret key en la app),
  3. devuelve `ResultadoAccion` (`exito(datos)` / `fallo(mensaje)`), nunca tira errores al cliente,
  4. llama a `revalidatePath` de lo que cambió.
- **Formularios**: react-hook-form + zodResolver, `useTransition` para el estado "pendiente", botón deshabilitado con spinner mientras guarda, errores por campo (`FieldError`) y error general en un toast o alerta. Todos los formularios manejan carga y error.
- Lecturas en Server Components llamando a `requerirUsuario()` primero (si no hay sesión, redirige).
- Errores de Postgres → `mensajeErrorBD()`; nunca mostrar mensajes crudos de la base.
- Textos de UI en español rioplatense, cortos y claros.

## Base de datos

- Toda tabla tiene `entrenador_id uuid not null default auth.uid()` y una política RLS `for all to authenticated` con `(select auth.uid()) = entrenador_id` en `using` y `with check`. No hace falta mandar `entrenador_id` desde la app.
- Las FK entre tablas propias son **compuestas** `(x_id, entrenador_id)` para que nunca se crucen datos de distintos entrenadores.
- Las tablas nuevas NO se exponen solas a la Data API: cada migración debe hacer `grant ... to authenticated` (y `service_role` si un script la usa) y `revoke ... from anon`.
- Funciones SQL: `security invoker` y `set search_path = ''`. Nunca `security definer` para "arreglar" un permiso.
- `rutinas.alumno_id` null = plantilla (`es_plantilla` es una columna generada).
- `orden` en `rutina_dias` y `rutina_ejercicios` es único y `deferrable`: reordenar con `reordenar_dias` / `reordenar_ejercicios` (RPC).
- Duplicar o crear desde plantilla: RPC `duplicar_rutina(p_rutina_id, p_alumno_id?, p_nombre?)`.
- Después de cada migración: `npm run db:push && npm run db:types && npm run db:advisors`.

## Storage

- Buckets públicos de lectura: `ejercicios` y `marca`. En la base se guarda el **path**, no la URL.
- Paths: `dataset/<id_externo>/{0,1}.jpg` (seed), `<uid>/<ejercicio_id>/{inicio,fin}.jpg` (propios), `<uid>/logo.<ext>`.
- Escritura solo dentro de la carpeta `<uid>/` (políticas en `storage.objects`).
- Imágenes siempre en **JPEG/PNG redimensionado (~600px)**: react-pdf no soporta WebP y el PDF tiene que ser liviano para WhatsApp. Las fotos propias se redimensionan en el navegador antes de subir.

## Decisiones

- `cacheComponents` desactivado: todo depende de la sesión y Cache Components exige runtime Node (complica Cloudflare Workers).
- Nada exclusivo de Vercel: `images.unoptimized`, sin ISR ni Edge Config. El deploy será en Cloudflare (`@opennextjs/cloudflare`) o Netlify.
- PDF en el cliente: portable a cualquier hosting y permite compartir con la Web Share API (WhatsApp).
- Biblioteca de ejercicios (~870) filtrada en el cliente: búsqueda instantánea sin tildes.
- Constructor de rutinas con guardado por operación (sin botón "Guardar" global).

## Variables de entorno

Ver `.env.example`. `NEXT_PUBLIC_*` llega al navegador; `SUPABASE_SECRET_KEY` solo para scripts locales, jamás en la app ni con prefijo `NEXT_PUBLIC_`.

## Flujo de trabajo

- Se avanza por etapas, **una rama por etapa** (`etapa-N-<tema>`) creada desde `main`, y **un PR por etapa** (`gh pr create`). Al terminar cada una: `npm run check && npm run build`, prueba en el navegador en viewport mobile, commit, push y PR.
- El repo vive en OneDrive: `next dev` es muy lento (compilaciones de 20–50 s). Para pruebas E2E usar `npm run build && npx next start -p 3100`.
- Pruebas con Playwright: si la ventana del navegador queda tapada, Chrome frena el render y las acciones dan timeout → `page.bringToFront()`. Usar un usuario temporal creado con la Admin API (secret key) y borrarlo al final (sus datos se borran en cascada).
- Supabase-js: en un insert de varias filas, las columnas que faltan en alguna fila llegan como NULL (no toman el default). Mandar todas las columnas en todas las filas.
- Fuente de ejercicios: free-exercise-db (github.com/yuhonas/free-exercise-db, Unlicense). Imágenes copiadas a Storage, nunca hotlink.
