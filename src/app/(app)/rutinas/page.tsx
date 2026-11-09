import { ClipboardListIcon } from "lucide-react";
import type { Metadata } from "next";

import { EncabezadoPagina } from "@/components/layout/encabezado-pagina";
import { EstadoVacio } from "@/components/layout/estado-vacio";

export const metadata: Metadata = { title: "Rutinas" };

export default function PaginaRutinas() {
  return (
    <>
      <EncabezadoPagina titulo="Rutinas" />
      <EstadoVacio
        icono={ClipboardListIcon}
        titulo="Próximamente"
        descripcion="Acá vas a armar rutinas y plantillas."
      />
    </>
  );
}
