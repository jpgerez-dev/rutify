const ZONA = "America/Argentina/Buenos_Aires";

/** Fecha de hoy en Argentina como "YYYY-MM-DD". */
export function hoyISO(): string {
  // en-CA formatea como YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONA }).format(new Date());
}

/** true si el string es una fecha "YYYY-MM-DD" válida del calendario. */
export function esFechaISOValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const [a, m, d] = valor.split("-").map(Number) as [number, number, number];
  const fecha = new Date(Date.UTC(a, m - 1, d));
  return (
    fecha.getUTCFullYear() === a && fecha.getUTCMonth() === m - 1 && fecha.getUTCDate() === d
  );
}

/** "2026-11-09" → "9 nov 2026" (fechas sin hora: se interpretan en UTC para no correrse de día). */
export function formatearFecha(
  valor: string | null | undefined,
  opciones: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" },
): string {
  if (!valor) return "";
  const soloFecha = valor.length === 10;
  const fecha = soloFecha ? new Date(`${valor}T00:00:00Z`) : new Date(valor);
  return new Intl.DateTimeFormat("es-AR", {
    ...opciones,
    timeZone: soloFecha ? "UTC" : ZONA,
  })
    .format(fecha)
    .replace(".", "");
}

/** Edad en años cumplidos a partir de "YYYY-MM-DD". */
export function calcularEdad(fechaNacimiento: string | null | undefined): number | null {
  if (!fechaNacimiento || !esFechaISOValida(fechaNacimiento)) return null;
  const [a, m, d] = fechaNacimiento.split("-").map(Number) as [number, number, number];
  const [ha, hm, hd] = hoyISO().split("-").map(Number) as [number, number, number];
  let edad = ha - a;
  if (hm < m || (hm === m && hd < d)) edad--;
  return edad >= 0 ? edad : null;
}
