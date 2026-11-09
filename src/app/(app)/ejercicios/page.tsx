import { DumbbellIcon } from "lucide-react";
import type { Metadata } from "next";

import { EncabezadoPagina } from "@/components/layout/encabezado-pagina";
import { EstadoVacio } from "@/components/layout/estado-vacio";

export const metadata: Metadata = { title: "Ejercicios" };

export default function PaginaEjercicios() {
  return (
    <>
      <EncabezadoPagina titulo="Ejercicios" />
      <EstadoVacio
        icono={DumbbellIcon}
        titulo="Próximamente"
        descripcion="Acá vas a tener la biblioteca de ejercicios con imágenes."
      />
    </>
  );
}
