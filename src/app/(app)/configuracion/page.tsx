import { SettingsIcon } from "lucide-react";
import type { Metadata } from "next";

import { EncabezadoPagina } from "@/components/layout/encabezado-pagina";
import { EstadoVacio } from "@/components/layout/estado-vacio";

export const metadata: Metadata = { title: "Configuración" };

export default function PaginaConfiguracion() {
  return (
    <>
      <EncabezadoPagina titulo="Configuración" />
      <EstadoVacio
        icono={SettingsIcon}
        titulo="Próximamente"
        descripcion="Acá vas a cargar tus datos y tu logo para el PDF."
      />
    </>
  );
}
