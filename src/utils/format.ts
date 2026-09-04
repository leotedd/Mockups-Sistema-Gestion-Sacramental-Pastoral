/* Utilidades de formato. Fechas SIEMPRE en dd/mm/aaaa (nunca mm/dd/yyyy). */

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** yyyy-mm-dd  ->  dd/mm/aaaa */
export function formatFecha(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** yyyy-mm-dd -> "sábado 06/09/2026" */
export function formatFechaLarga(iso: string): string {
  const dt = parseISO(iso);
  return `${DIAS[dt.getDay()]} ${formatFecha(iso)}`;
}

/** yyyy-mm-dd -> "6 de septiembre de 2026" */
export function formatFechaTexto(iso: string): string {
  const dt = parseISO(iso);
  return `${dt.getDate()} de ${MESES[dt.getMonth()]} de ${dt.getFullYear()}`;
}

export function formatHorario(desde: string, hasta?: string): string {
  return hasta ? `${desde} - ${hasta}` : desde;
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function nombreMesAnio(dt: Date): string {
  return `${capitalizar(MESES[dt.getMonth()])} ${dt.getFullYear()}`;
}

export function capitalizar(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export { MESES, DIAS };
