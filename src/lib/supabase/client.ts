import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database";

/** Cliente de Supabase para Client Components (singleton en el navegador). */
export function crearClienteNavegador() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
