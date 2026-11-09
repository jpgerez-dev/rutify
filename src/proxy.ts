import type { NextRequest } from "next/server";

import { actualizarSesion } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return actualizarSesion(request);
}

export const config = {
  matcher: [
    // Todo menos estáticos de Next, imágenes y archivos públicos.
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
