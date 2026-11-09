import { SearchXIcon } from "lucide-react";
import Link from "next/link";

import { EstadoVacio } from "@/components/layout/estado-vacio";
import { Button } from "@/components/ui/button";

export default function NoEncontradoApp() {
  return (
    <EstadoVacio
      icono={SearchXIcon}
      titulo="No encontramos lo que buscabas"
      descripcion="Puede que se haya borrado o que el enlace esté mal."
      accion={
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      }
    />
  );
}
