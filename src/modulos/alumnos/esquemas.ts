import { z } from "zod";

import { esFechaISOValida, hoyISO } from "@/lib/fechas";
import { vacioANulo } from "@/lib/texto";
import type { TablesInsert } from "@/types/database";

export const NIVELES = ["principiante", "intermedio", "avanzado"] as const;
export type Nivel = (typeof NIVELES)[number];

export const ETIQUETAS_NIVEL: Record<Nivel, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

export function etiquetaNivel(nivel: string | null | undefined): string | null {
  return nivel && nivel in ETIQUETAS_NIVEL ? ETIQUETAS_NIVEL[nivel as Nivel] : null;
}

const textoOpcional = (max: number) =>
  z.string().trim().max(max, `Máximo ${max} caracteres.`);

const textoObligatorio = (campo: string, max: number) =>
  z.string().trim().min(1, `Ingresá el ${campo}.`).max(max, `Máximo ${max} caracteres.`);

/**
 * Esquema del formulario de alumno. Todos los campos son strings (lo que
 * maneja el form); los opcionales vacíos se guardan como NULL con aFilaAlumno().
 */
export const esquemaAlumno = z.object({
  nombre: textoObligatorio("nombre", 80),
  apellido: textoObligatorio("apellido", 80),
  telefono: textoOpcional(30).refine(
    (v) => v === "" || /^\+?[\d\s()-]{6,}$/.test(v),
    "Usá solo números, espacios, guiones o +.",
  ),
  email: textoOpcional(254).refine(
    (v) => v === "" || z.email().safeParse(v).success,
    "Ingresá un email válido.",
  ),
  fecha_nacimiento: z
    .string()
    .refine((v) => v === "" || esFechaISOValida(v), "Ingresá una fecha válida.")
    .refine(
      (v) => v === "" || (v >= "1900-01-01" && v <= hoyISO()),
      "La fecha tiene que ser anterior a hoy.",
    ),
  objetivo: textoOpcional(500),
  nivel: z.union([z.enum(NIVELES), z.literal("")]),
  lesiones_limitaciones: textoOpcional(2000),
  notas: textoOpcional(5000),
});

export type DatosAlumno = z.infer<typeof esquemaAlumno>;

export const VALORES_INICIALES_ALUMNO: DatosAlumno = {
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  fecha_nacimiento: "",
  objetivo: "",
  nivel: "",
  lesiones_limitaciones: "",
  notas: "",
};

/** Datos validados del form → columnas de la tabla (vacíos a NULL). */
export function aFilaAlumno(datos: DatosAlumno): TablesInsert<"alumnos"> {
  return {
    nombre: datos.nombre.trim(),
    apellido: datos.apellido.trim(),
    telefono: vacioANulo(datos.telefono),
    email: vacioANulo(datos.email)?.toLowerCase() ?? null,
    fecha_nacimiento: vacioANulo(datos.fecha_nacimiento),
    objetivo: vacioANulo(datos.objetivo),
    nivel: vacioANulo(datos.nivel),
    lesiones_limitaciones: vacioANulo(datos.lesiones_limitaciones),
    notas: vacioANulo(datos.notas),
  };
}

export const esquemaId = z.uuid("Identificador inválido.");
