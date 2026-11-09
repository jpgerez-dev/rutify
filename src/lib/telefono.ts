/**
 * Normaliza un teléfono argentino al formato internacional de WhatsApp
 * (549 + código de área sin 0 + número sin 15).
 *
 * Acepta: "+54 9 381 555-1234", "381 555 1234", "0381 5551234".
 * Si ya viene con otro código de país (11+ dígitos), lo deja como está.
 */
export function normalizarTelefonoWhatsApp(telefono: string | null | undefined): string | null {
  let digitos = (telefono ?? "").replace(/\D/g, "");
  if (!digitos) return null;

  if (digitos.startsWith("00")) digitos = digitos.slice(2);

  if (digitos.startsWith("54")) {
    // +54 sin el 9 de celulares: 54 + 10 dígitos
    if (!digitos.startsWith("549") && digitos.length === 12) {
      digitos = `549${digitos.slice(2)}`;
    }
    return digitos;
  }

  if (digitos.startsWith("0")) digitos = digitos.slice(1);
  if (digitos.length === 10) return `549${digitos}`;

  // Otro país o formato desconocido: se usa tal cual si parece internacional.
  return digitos.length >= 11 ? digitos : null;
}

export function enlaceWhatsApp(telefono: string | null | undefined, mensaje?: string): string | null {
  const numero = normalizarTelefonoWhatsApp(telefono);
  if (!numero) return null;
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : "";
  return `https://wa.me/${numero}${texto}`;
}

export function enlaceLlamada(telefono: string | null | undefined): string | null {
  const limpio = (telefono ?? "").replace(/[^\d+]/g, "");
  return limpio ? `tel:${limpio}` : null;
}
