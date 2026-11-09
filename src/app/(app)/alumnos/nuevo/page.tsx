import type { Metadata } from "next";

import { EncabezadoPagina } from "@/components/layout/encabezado-pagina";
import { VolverA } from "@/components/layout/volver-a";
import { FormularioAlumno } from "@/modulos/alumnos/componentes/formulario-alumno";

export const metadata: Metadata = { title: "Nuevo alumno" };

export default function PaginaNuevoAlumno() {
  return (
    <div className="mx-auto max-w-2xl">
      <VolverA href="/alumnos">Alumnos</VolverA>
      <EncabezadoPagina titulo="Nuevo alumno" descripcion="Solo el nombre y el apellido son obligatorios." />
      <FormularioAlumno modo="crear" />
    </div>
  );
}
