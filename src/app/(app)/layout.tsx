import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { MenuUsuario } from "@/components/layout/menu-usuario";
import { NavegacionInferior, NavegacionLateral } from "@/components/layout/navegacion";
import { requerirUsuario } from "@/lib/auth";

export default async function LayoutApp({ children }: LayoutProps<"/">) {
  const usuario = await requerirUsuario();

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[15rem_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r bg-sidebar px-3 py-5 md:flex">
        <Link href="/" className="px-2">
          <Logo />
        </Link>
        <NavegacionLateral />
        <div className="mt-auto flex items-center gap-2 px-2">
          <MenuUsuario email={usuario.email} />
          <span className="truncate text-xs text-muted-foreground">{usuario.email}</span>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Encabezado (mobile) */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
          <Link href="/">
            <Logo />
          </Link>
          <MenuUsuario email={usuario.email} />
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-5 pb-28 md:px-8 md:pt-8 md:pb-10">
          {children}
        </main>
      </div>

      <NavegacionInferior />
    </div>
  );
}
