"use client";

import { ChevronRightIcon, SearchIcon, SearchXIcon, UserPlusIcon, UsersIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { EstadoVacio } from "@/components/layout/estado-vacio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { coincideBusqueda, iniciales } from "@/lib/texto";
import { cn } from "@/lib/utils";

import type { AlumnoResumen } from "../consultas";
import { etiquetaNivel } from "../esquemas";

const FILTROS = ["activos", "inactivos", "todos"] as const;
type Filtro = (typeof FILTROS)[number];

/** Actualiza la URL sin recargar (sincroniza con useSearchParams). */
function actualizarParametro(clave: string, valor: string, valorPorDefecto: string) {
  const params = new URLSearchParams(window.location.search);
  if (valor === valorPorDefecto || valor === "") params.delete(clave);
  else params.set(clave, valor);
  const query = params.toString();
  window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
}

export function ListaAlumnos({ alumnos }: { alumnos: AlumnoResumen[] }) {
  const searchParams = useSearchParams();
  const busqueda = searchParams.get("q") ?? "";
  const filtroParam = searchParams.get("estado");
  const filtro: Filtro = FILTROS.includes(filtroParam as Filtro) ? (filtroParam as Filtro) : "activos";

  const cantidades = useMemo(
    () => ({
      activos: alumnos.filter((a) => a.activo).length,
      inactivos: alumnos.filter((a) => !a.activo).length,
      todos: alumnos.length,
    }),
    [alumnos],
  );

  const filtrados = useMemo(
    () =>
      alumnos.filter((a) => {
        if (filtro === "activos" && !a.activo) return false;
        if (filtro === "inactivos" && a.activo) return false;
        return coincideBusqueda(`${a.nombre} ${a.apellido} ${a.telefono ?? ""}`, busqueda);
      }),
    [alumnos, filtro, busqueda],
  );

  if (alumnos.length === 0) {
    return (
      <EstadoVacio
        icono={UsersIcon}
        titulo="Todavía no cargaste alumnos"
        descripcion="Agregá tu primer alumno para empezar a armarle rutinas."
        accion={
          <Button asChild size="lg">
            <Link href="/alumnos/nuevo">
              <UserPlusIcon /> Agregar alumno
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon
            className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            enterKeyHint="search"
            placeholder="Buscar por nombre o teléfono"
            aria-label="Buscar alumnos"
            defaultValue={busqueda}
            onChange={(e) => actualizarParametro("q", e.target.value, "")}
            className="pr-10 pl-10 [&::-webkit-search-cancel-button]:hidden"
          />
          {busqueda && (
            <button
              type="button"
              aria-label="Borrar búsqueda"
              onClick={(e) => {
                const input = e.currentTarget.parentElement?.querySelector("input");
                if (input) {
                  input.value = "";
                  input.focus();
                }
                actualizarParametro("q", "", "");
              }}
              className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>

        <Tabs
          value={filtro}
          onValueChange={(valor) => actualizarParametro("estado", valor, "activos")}
        >
          <TabsList className="grid h-11 w-full grid-cols-3 sm:w-auto md:h-9">
            {FILTROS.map((f) => (
              <TabsTrigger key={f} value={f} className="capitalize">
                {f} <span className="text-muted-foreground tabular-nums">{cantidades[f]}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filtrados.length === 0 ? (
        <EstadoVacio
          icono={SearchXIcon}
          titulo="No hay alumnos que coincidan"
          descripcion={
            busqueda
              ? `No encontramos "${busqueda}" entre ${filtro === "todos" ? "tus alumnos" : `los alumnos ${filtro}`}.`
              : `No tenés alumnos ${filtro}.`
          }
        />
      ) : (
        <ul className="flex flex-col divide-y overflow-hidden rounded-2xl border bg-card">
          {filtrados.map((alumno) => {
            const nivel = etiquetaNivel(alumno.nivel);
            return (
              <li key={alumno.id}>
                <Link
                  href={`/alumnos/${alumno.id}`}
                  className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50 active:bg-muted"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold",
                      alumno.activo
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {iniciales(alumno.nombre, alumno.apellido)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={cn("truncate font-medium", !alumno.activo && "text-muted-foreground")}>
                        {alumno.nombre} {alumno.apellido}
                      </span>
                      {!alumno.activo && <Badge variant="outline">Inactivo</Badge>}
                    </span>
                    {(alumno.objetivo || nivel) && (
                      <span className="block truncate text-sm text-muted-foreground">
                        {[nivel, alumno.objetivo].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </span>
                  <ChevronRightIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
