"use client";

import {
  ClipboardListIcon,
  DumbbellIcon,
  HouseIcon,
  SettingsIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type ItemNavegacion = {
  href: string;
  etiqueta: string;
  icono: LucideIcon;
};

export const ITEMS_NAVEGACION: ItemNavegacion[] = [
  { href: "/", etiqueta: "Inicio", icono: HouseIcon },
  { href: "/alumnos", etiqueta: "Alumnos", icono: UsersIcon },
  { href: "/rutinas", etiqueta: "Rutinas", icono: ClipboardListIcon },
  { href: "/ejercicios", etiqueta: "Ejercicios", icono: DumbbellIcon },
  { href: "/configuracion", etiqueta: "Ajustes", icono: SettingsIcon },
];

function estaActivo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Barra inferior fija, solo en mobile. */
export function NavegacionInferior() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {ITEMS_NAVEGACION.map(({ href, etiqueta, icono: Icono }) => {
          const activo = estaActivo(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={activo ? "page" : undefined}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-[0.7rem] font-medium text-muted-foreground transition-colors",
                  activo && "text-primary",
                )}
              >
                <Icono className={cn("size-5", activo && "stroke-[2.4]")} aria-hidden />
                {etiqueta}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Menú lateral, desde md. */
export function NavegacionLateral() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación principal" className="flex flex-col gap-1">
      {ITEMS_NAVEGACION.map(({ href, etiqueta, icono: Icono }) => {
        const activo = estaActivo(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={activo ? "page" : undefined}
            className={cn(
              "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              activo && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icono className="size-4.5" aria-hidden />
            {etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
