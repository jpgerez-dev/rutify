"use client";

import { TriangleAlertIcon } from "lucide-react";
import { useEffect } from "react";

import { EstadoVacio } from "@/components/layout/estado-vacio";
import { Button } from "@/components/ui/button";

export default function ErrorApp({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EstadoVacio
      icono={TriangleAlertIcon}
      titulo="Algo salió mal"
      descripcion="No pudimos cargar esta pantalla. Revisá tu conexión y probá de nuevo."
      accion={<Button onClick={reset}>Reintentar</Button>}
    />
  );
}
