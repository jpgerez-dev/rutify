/** Minúsculas y sin tildes/diéresis, para búsquedas ("Muñoz" → "munoz"). */
export function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

/** true si todas las palabras de la búsqueda aparecen en el texto (sin tildes). */
export function coincideBusqueda(texto: string, busqueda: string): boolean {
  const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return true;
  const objetivo = normalizar(texto);
  return palabras.every((palabra) => objetivo.includes(palabra));
}

/** Iniciales para avatares ("Ana", "Pérez" → "AP"). */
export function iniciales(...partes: (string | null | undefined)[]): string {
  return partes
    .map((p) => p?.trim()?.[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** "" o solo espacios → null. Para guardar opcionales vacíos como NULL. */
export function vacioANulo(valor: string | null | undefined): string | null {
  const limpio = valor?.trim() ?? "";
  return limpio === "" ? null : limpio;
}
