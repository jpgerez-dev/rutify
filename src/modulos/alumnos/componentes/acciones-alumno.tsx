"use client";

import {
  Loader2Icon,
  MoreVerticalIcon,
  PencilIcon,
  PowerIcon,
  PowerOffIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cambiarEstadoAlumno, eliminarAlumno } from "../acciones";

export function AccionesAlumno({
  alumnoId,
  nombreCompleto,
  activo,
  cantidadRutinas,
}: {
  alumnoId: string;
  nombreCompleto: string;
  activo: boolean;
  cantidadRutinas: number;
}) {
  const router = useRouter();
  const [pendiente, iniciarTransicion] = useTransition();
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  function alternarEstado() {
    iniciarTransicion(async () => {
      const resultado = await cambiarEstadoAlumno(alumnoId, !activo);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      toast.success(activo ? "Alumno desactivado." : "Alumno activado.");
      router.refresh();
    });
  }

  function borrar() {
    iniciarTransicion(async () => {
      const resultado = await eliminarAlumno(alumnoId);
      if (!resultado.ok) {
        toast.error(resultado.error);
        return;
      }
      setConfirmarBorrado(false);
      toast.success("Alumno eliminado.");
      router.replace("/alumnos");
    });
  }

  return (
    <>
      <Button variant="outline" asChild>
        <Link href={`/alumnos/${alumnoId}/editar`}>
          <PencilIcon /> Editar
        </Link>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Más acciones" disabled={pendiente}>
            {pendiente ? <Loader2Icon className="animate-spin" /> : <MoreVerticalIcon />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={alternarEstado}>
            {activo ? <PowerOffIcon /> : <PowerIcon />}
            {activo ? "Marcar como inactivo" : "Marcar como activo"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setConfirmarBorrado(true)}>
            <Trash2Icon /> Eliminar alumno
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmarBorrado} onOpenChange={(abierto) => !pendiente && setConfirmarBorrado(abierto)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar a {nombreCompleto}?</AlertDialogTitle>
            <AlertDialogDescription>
              {cantidadRutinas > 0
                ? `También se ${cantidadRutinas === 1 ? "va a borrar su rutina" : `van a borrar sus ${cantidadRutinas} rutinas`}. `
                : ""}
              Esta acción no se puede deshacer. Si solo dejó de entrenar, mejor marcalo como inactivo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pendiente}>Cancelar</AlertDialogCancel>
            <Button variant="destructive" onClick={borrar} disabled={pendiente}>
              {pendiente && <Loader2Icon className="animate-spin" />}
              {pendiente ? "Eliminando…" : "Eliminar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
