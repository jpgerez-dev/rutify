import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/database";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Se crea uno por request porque depende de las cookies de ese request.
 */
export async function crearClienteServidor() {
  const almacenCookies = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return almacenCookies.getAll();
        },
        setAll(cookiesParaSetear) {
          try {
            cookiesParaSetear.forEach(({ name, value, options }) =>
              almacenCookies.set(name, value, options),
            );
          } catch {
            // Llamado desde un Server Component: no puede escribir cookies.
            // No pasa nada porque el proxy ya refresca la sesión en cada request.
          }
        },
      },
    },
  );
}
