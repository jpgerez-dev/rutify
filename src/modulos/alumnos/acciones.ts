"use server";

import { revalidatePath } from "next/cache";

import {
  exito,
  fallo,
  falloValidacion,
  mensajeErrorBD,
  type ResultadoAccion,
} from "@/lib/acciones";
import { requerirUsuario } from "@/lib/auth";
import { crearClienteServidor } from "@/lib/supabase/server";

import { aFilaAlumno, esquemaAlumno, esquemaId, type DatosAlumno } from "./esquemas";

function revalidarAlumno(id?: string) {
  revalidatePath("/alumnos");
  if (id) revalidatePath(`/alumnos/${id}`);
}

export async function crearAlumno(datos: DatosAlumno): Promise<ResultadoAccion<{ id: string }>> {
  await requerirUsuario();
  const validacion = esquemaAlumno.safeParse(datos);
  if (!validacion.success) return falloValidacion(validacion.error);

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("alumnos")
    .insert(aFilaAlumno(validacion.data))
    .select("id")
    .single();

  if (error) return fallo(mensajeErrorBD(error));

  revalidarAlumno();
  return exito({ id: data.id });
}

export async function actualizarAlumno(
  id: string,
  datos: DatosAlumno,
): Promise<ResultadoAccion<{ id: string }>> {
  await requerirUsuario();
  if (!esquemaId.safeParse(id).success) return fallo("Alumno inválido.");
  const validacion = esquemaAlumno.safeParse(datos);
  if (!validacion.success) return falloValidacion(validacion.error);

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("alumnos")
    .update(aFilaAlumno(validacion.data))
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return fallo(mensajeErrorBD(error));
  if (!data) return fallo("No encontramos el alumno. Puede que se haya borrado.");

  revalidarAlumno(id);
  return exito({ id });
}

export async function cambiarEstadoAlumno(id: string, activo: boolean): Promise<ResultadoAccion> {
  await requerirUsuario();
  if (!esquemaId.safeParse(id).success) return fallo("Alumno inválido.");

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase
    .from("alumnos")
    .update({ activo })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) return fallo(mensajeErrorBD(error));
  if (!data) return fallo("No encontramos el alumno. Puede que se haya borrado.");

  revalidarAlumno(id);
  return exito();
}

/** Borra el alumno y, en cascada, todas sus rutinas. Las plantillas no se tocan. */
export async function eliminarAlumno(id: string): Promise<ResultadoAccion> {
  await requerirUsuario();
  if (!esquemaId.safeParse(id).success) return fallo("Alumno inválido.");

  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.from("alumnos").delete().eq("id", id).select("id");

  if (error) return fallo(mensajeErrorBD(error));
  if (data.length === 0) return fallo("No encontramos el alumno. Puede que ya se haya borrado.");

  revalidatePath("/alumnos");
  revalidatePath("/rutinas");
  return exito();
}
