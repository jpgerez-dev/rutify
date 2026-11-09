import { ChevronRightIcon, ClipboardListIcon, DumbbellIcon, UsersIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EncabezadoPagina } from "@/components/layout/encabezado-pagina";

export const metadata: Metadata = { title: "Inicio" };

const ACCESOS = [
  {
    href: "/alumnos",
    titulo: "Alumnos",
    descripcion: "Fichas, objetivos y lesiones",
    icono: UsersIcon,
  },
  {
    href: "/rutinas",
    titulo: "Rutinas",
    descripcion: "Armá, duplicá y compartí en PDF",
    icono: ClipboardListIcon,
  },
  {
    href: "/ejercicios",
    titulo: "Ejercicios",
    descripcion: "Biblioteca con imágenes",
    icono: DumbbellIcon,
  },
];

function saludo() {
  const hora = Number(
    new Intl.DateTimeFormat("es-AR", {
      hour: "numeric",
      hour12: false,
      timeZone: "America/Argentina/Buenos_Aires",
    }).format(new Date()),
  );
  if (hora < 13) return "¡Buen día!";
  if (hora < 20) return "¡Buenas tardes!";
  return "¡Buenas noches!";
}

export default function PaginaInicio() {
  return (
    <>
      <EncabezadoPagina titulo={saludo()} descripcion="¿Qué querés hacer hoy?" />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACCESOS.map(({ href, titulo, descripcion, icono: Icono }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/40"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Icono className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{titulo}</span>
                <span className="block truncate text-sm text-muted-foreground">
                  {descripcion}
                </span>
              </span>
              <ChevronRightIcon
                className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
