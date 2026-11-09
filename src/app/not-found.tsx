import { SearchXIcon } from "lucide-react";
import Link from "next/link";

import { EstadoVacio } from "@/components/layout/estado-vacio";
import { Button } from "@/components/ui/button";

export default function NoEncontrado() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <EstadoVacio
        icono={SearchXIcon}
        titulo="No encontramos esta página"
        descripcion="Puede que se haya borrado o que el enlace esté mal."
        accion={
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        }
        className="w-full max-w-md"
      />
    </main>
  );
}
