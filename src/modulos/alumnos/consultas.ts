import "server-only";

import { cache } from "react";

import { requerirUsuario } from "@/lib/auth";
import { crearClienteServidor } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

import { esquemaId } from "./esquemas";

export type AlumnoResumen = Pick<
  Tables<"alumnos">,
  "id" | "nombre" | "apellido" | "telefono" | "objetivo" | "nivel" | "activo"
>;

/**
 * Todos los alumnos del entrenador (son pocos: el filtro y la búsqueda se
 * hacen en el cliente, sin tildes e instantáneos).
 */
export async function listarAlumnos(): Promise<AlumnoResumen[]> {
  await requerirUsuario();
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("alumnos")
    .select("id, nombre, apellido, telefono, objetivo, nivel, activo")
    .order("nombre")
    .order("apellido");

  if (error) throw new Error(`No se pudieron cargar los alumnos: ${error.message}`);
  return data;
}

/** Memoizado por request (lo usan generateMetadata y la página). */
export const obtenerAlumno = cache(async (id: string): Promise<Tables<"alumnos"> | null> => {
  if (!esquemaId.safeParse(id).success) return null;
  await requerirUsuario();
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.from("alumnos").select("*").eq("id", id).maybeSingle();

  if (error) throw new Error(`No se pudo cargar el alumno: ${error.message}`);
  return data;
});

export async function contarRutinasDeAlumno(id: string): Promise<number> {
  await requerirUsuario();
  const supabase = await crearClienteServidor();
  const { count, error } = await supabase
    .from("rutinas")
    .select("id", { count: "exact", head: true })
    .eq("alumno_id", id);

  if (error) throw new Error(`No se pudieron contar las rutinas: ${error.message}`);
  return count ?? 0;
}
