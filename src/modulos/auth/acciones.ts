"use server";

import { redirect } from "next/navigation";

import { fallo, falloValidacion, type ResultadoAccion } from "@/lib/acciones";
import { crearClienteServidor } from "@/lib/supabase/server";

import { esquemaLogin, type DatosLogin } from "./esquemas";

export async function iniciarSesion(datos: DatosLogin): Promise<ResultadoAccion> {
  const validacion = esquemaLogin.safeParse(datos);
  if (!validacion.success) {
    return falloValidacion(validacion.error);
  }

  const supabase = await crearClienteServidor();
  const { error } = await supabase.auth.signInWithPassword(validacion.data);

  if (error) {
    switch (error.code) {
      case "invalid_credentials":
        return fallo("Email o contraseña incorrectos.");
      case "email_not_confirmed":
        return fallo("Tenés que confirmar tu email antes de ingresar.");
      case "over_request_rate_limit":
      case "over_email_send_rate_limit":
        return fallo("Demasiados intentos. Esperá unos minutos y probá de nuevo.");
      default:
        return fallo("No pudimos iniciar sesión. Probá de nuevo.");
    }
  }

  redirect("/");
}

export async function cerrarSesion() {
  const supabase = await crearClienteServidor();
  await supabase.auth.signOut();
  redirect("/login");
}
