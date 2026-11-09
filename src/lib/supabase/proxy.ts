import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/database";

/** Rutas accesibles sin sesión. */
const RUTAS_PUBLICAS = ["/login"];

function esRutaPublica(pathname: string) {
  return RUTAS_PUBLICAS.some(
    (ruta) => pathname === ruta || pathname.startsWith(`${ruta}/`),
  );
}

/**
 * Refresca el token de Supabase en cada request y hace el chequeo optimista
 * de sesión. La autorización real la hacen RLS y `requerirUsuario()`.
 *
 * IMPORTANTE: siempre devolver `respuesta` (o copiarle sus cookies y headers),
 * si no el navegador pierde el token refrescado y la sesión se cierra.
 */
export async function actualizarSesion(request: NextRequest) {
  let respuesta = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesParaSetear, headers) {
          cookiesParaSetear.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          respuesta = NextResponse.next({ request });
          cookiesParaSetear.forEach(({ name, value, options }) =>
            respuesta.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([clave, valor]) =>
            respuesta.headers.set(clave, valor),
          );
        },
      },
    },
  );

  // No meter código entre createServerClient y getClaims().
  const { data } = await supabase.auth.getClaims();
  const autenticado = Boolean(data?.claims?.sub);
  const { pathname } = request.nextUrl;

  if (!autenticado && !esRutaPublica(pathname)) {
    return redirigirConCookies(request, respuesta, "/login");
  }

  if (autenticado && pathname === "/login") {
    return redirigirConCookies(request, respuesta, "/");
  }

  return respuesta;
}

function redirigirConCookies(
  request: NextRequest,
  respuesta: NextResponse,
  destino: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = destino;
  url.search = "";
  const redireccion = NextResponse.redirect(url);
  respuesta.cookies.getAll().forEach((cookie) => redireccion.cookies.set(cookie));
  respuesta.headers.forEach((valor, clave) => {
    if (["cache-control", "expires", "pragma"].includes(clave)) {
      redireccion.headers.set(clave, valor);
    }
  });
  return redireccion;
}
