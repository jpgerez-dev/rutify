import type { Metadata } from "next";

import { Logo } from "@/components/layout/logo";
import { FormularioLogin } from "@/modulos/auth/componentes/formulario-login";

export const metadata: Metadata = {
  title: "Ingresar",
};

export default function PaginaLogin() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo className="text-xl" />
          <p className="text-sm text-muted-foreground">
            Ingresá para gestionar tus alumnos y rutinas.
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <FormularioLogin />
        </div>
      </div>
    </main>
  );
}
