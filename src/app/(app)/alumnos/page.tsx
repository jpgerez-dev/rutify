import { UsersIcon } from "lucide-react";
import type { Metadata } from "next";

import { EncabezadoPagina } from "@/components/layout/encabezado-pagina";
import { EstadoVacio } from "@/components/layout/estado-vacio";

export const metadata: Metadata = { title: "Alumnos" };

export default function PaginaAlumnos() {
  return (
    <>
      <EncabezadoPagina titulo="Alumnos" />
      <EstadoVacio
        icono={UsersIcon}
        titulo="Próximamente"
        descripcion="Acá vas a ver y buscar a tus alumnos."
      />
    </>
  );
}
