import { UserPlusIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EncabezadoPagina } from "@/components/layout/encabezado-pagina";
import { Button } from "@/components/ui/button";
import { ListaAlumnos } from "@/modulos/alumnos/componentes/lista-alumnos";
import { listarAlumnos } from "@/modulos/alumnos/consultas";

export const metadata: Metadata = { title: "Alumnos" };

export default async function PaginaAlumnos() {
  const alumnos = await listarAlumnos();

  return (
    <>
      <EncabezadoPagina
        titulo="Alumnos"
        acciones={
          alumnos.length > 0 && (
            <Button asChild>
              <Link href="/alumnos/nuevo">
                <UserPlusIcon /> Nuevo
              </Link>
            </Button>
          )
        }
      />
      <ListaAlumnos alumnos={alumnos} />
    </>
  );
}
