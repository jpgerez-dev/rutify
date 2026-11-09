import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EncabezadoPagina } from "@/components/layout/encabezado-pagina";
import { VolverA } from "@/components/layout/volver-a";
import { FormularioAlumno } from "@/modulos/alumnos/componentes/formulario-alumno";
import { obtenerAlumno } from "@/modulos/alumnos/consultas";
import type { DatosAlumno, Nivel } from "@/modulos/alumnos/esquemas";

export const metadata: Metadata = { title: "Editar alumno" };

export default async function PaginaEditarAlumno(props: PageProps<"/alumnos/[id]/editar">) {
  const { id } = await props.params;
  const alumno = await obtenerAlumno(id);
  if (!alumno) notFound();

  const valores: DatosAlumno = {
    nombre: alumno.nombre,
    apellido: alumno.apellido,
    telefono: alumno.telefono ?? "",
    email: alumno.email ?? "",
    fecha_nacimiento: alumno.fecha_nacimiento ?? "",
    objetivo: alumno.objetivo ?? "",
    nivel: (alumno.nivel as Nivel | null) ?? "",
    lesiones_limitaciones: alumno.lesiones_limitaciones ?? "",
    notas: alumno.notas ?? "",
  };

  return (
    <div className="mx-auto max-w-2xl">
      <VolverA href={`/alumnos/${id}`}>
        {alumno.nombre} {alumno.apellido}
      </VolverA>
      <EncabezadoPagina titulo="Editar alumno" />
      <FormularioAlumno modo="editar" alumnoId={id} valoresIniciales={valores} />
    </div>
  );
}
