import type { z } from "zod";

/**
 * Resultado estándar de toda Server Action.
 * - ok: true  → `datos` opcionales (p. ej. el id creado)
 * - ok: false → `error` general para mostrar en un toast/alerta y
 *               `erroresCampos` para marcar inputs puntuales.
 */
export type ResultadoAccion<T = undefined> =
  | { ok: true; datos: T }
  | { ok: false; error: string; erroresCampos?: Record<string, string[]> };

export function exito(): ResultadoAccion<undefined>;
export function exito<T>(datos: T): ResultadoAccion<T>;
export function exito<T>(datos?: T): ResultadoAccion<T | undefined> {
  return { ok: true, datos };
}

export function fallo(
  error: string,
  erroresCampos?: Record<string, string[]>,
): { ok: false; error: string; erroresCampos?: Record<string, string[]> } {
  return { ok: false, error, erroresCampos };
}

/** Convierte un error de validación de Zod en un ResultadoAccion fallido. */
export function falloValidacion(error: z.ZodError) {
  const erroresCampos: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const campo = issue.path.join(".") || "_";
    (erroresCampos[campo] ??= []).push(issue.message);
  }
  return fallo("Revisá los datos del formulario.", erroresCampos);
}

/** Traduce errores comunes de Postgres/PostgREST a mensajes para el usuario. */
export function mensajeErrorBD(error: { code?: string; message: string }): string {
  switch (error.code) {
    case "23505":
      return "Ya existe un registro con esos datos.";
    case "23503":
      return "No se puede completar: hay datos relacionados que lo impiden.";
    case "23514":
      return "Algún dato no cumple el formato esperado.";
    case "42501":
      return "No tenés permiso para hacer esto.";
    case "PGRST116":
      return "No se encontró el registro.";
    default:
      return "Ocurrió un error inesperado. Probá de nuevo.";
  }
}
