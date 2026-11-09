import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { crearClienteServidor } from "@/lib/supabase/server";

export type UsuarioActual = {
  id: string;
  email: string | null;
};

/**
 * Data Access Layer: valida el JWT (getClaims) y devuelve el usuario.
 * Si no hay sesión válida redirige a /login. Se memoiza por request.
 * Usar en todo Server Component, Server Action o Route Handler que toque datos.
 */
export const requerirUsuario = cache(async (): Promise<UsuarioActual> => {
  const supabase = await crearClienteServidor();
  const { data, error } = await supabase.auth.getClaims();

  const claims = data?.claims;
  if (error || !claims?.sub) {
    redirect("/login");
  }

  return {
    id: claims.sub,
    email: typeof claims.email === "string" ? claims.email : null,
  };
});
