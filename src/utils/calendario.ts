/* Utilidades de calendario (grilla mensual, semana, carriles para eventos
   superpuestos). Portadas de frontend/src/utils/agenda.ts del desarrollo
   real para reproducir fielmente CelebracionesCalendario y el MiniCalendar
   compartido. */

export const ALTO_HORA = 56;

export function inicioDeSemana(fecha: Date): Date {
  const r = new Date(fecha);
  r.setDate(r.getDate() - r.getDay());
  r.setHours(0, 0, 0, 0);
  return r;
}

export function sumarDias(fecha: Date, n: number): Date {
  const r = new Date(fecha);
  r.setDate(r.getDate() + n);
  return r;
}

export function sumarMeses(fecha: Date, n: number): Date {
  const r = new Date(fecha);
  r.setMonth(r.getMonth() + n);
  return r;
}

export function esMismoDia(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function esMismoMes(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function inicioDeMes(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1);
}

/** Grilla de 42 días (6 semanas), alineada a lunes, para la vista Mes. */
export function construirGrillaMes(mesVisible: Date): Date[] {
  const primerDia = inicioDeMes(mesVisible);
  const offsetLunes = (primerDia.getDay() + 6) % 7;
  const inicioGrilla = sumarDias(primerDia, -offsetLunes);
  return Array.from({ length: 42 }, (_, i) => sumarDias(inicioGrilla, i));
}

export function formatoHora(fecha: Date): string {
  return fecha.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export interface EventoBase {
  id: string;
  inicio: string; // ISO datetime
  fin: string; // ISO datetime
}

export function eventosDelDia<T extends EventoBase>(eventos: T[], dia: Date): T[] {
  return eventos
    .filter((e) => esMismoDia(new Date(e.inicio), dia))
    .sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());
}

export interface EventoConCarril<T> {
  evento: T;
  carril: number;
  carriles: number;
}

/** Distribuye eventos superpuestos en "carriles" (columnas) para que no se encimen visualmente. */
export function distribuirCarriles<T extends EventoBase>(eventos: T[]): EventoConCarril<T>[] {
  const ordenados = [...eventos].sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());
  const resultado: EventoConCarril<T>[] = [];
  let grupoActual: T[] = [];
  let finMaximoGrupo = -Infinity;

  const cerrarGrupo = () => {
    if (grupoActual.length === 0) return;
    const finCarriles: number[] = [];
    const asignaciones: Array<{ evento: T; carril: number }> = [];

    for (const evento of grupoActual) {
      const inicioMs = new Date(evento.inicio).getTime();
      const finMs = new Date(evento.fin).getTime();
      let carrilLibre = finCarriles.findIndex((fin) => fin <= inicioMs);
      if (carrilLibre === -1) {
        carrilLibre = finCarriles.length;
        finCarriles.push(finMs);
      } else {
        finCarriles[carrilLibre] = finMs;
      }
      asignaciones.push({ evento, carril: carrilLibre });
    }

    const totalCarriles = finCarriles.length;
    for (const { evento, carril } of asignaciones) resultado.push({ evento, carril, carriles: totalCarriles });
    grupoActual = [];
    finMaximoGrupo = -Infinity;
  };

  for (const evento of ordenados) {
    const inicioMs = new Date(evento.inicio).getTime();
    const finMs = new Date(evento.fin).getTime();
    if (grupoActual.length > 0 && inicioMs >= finMaximoGrupo) cerrarGrupo();
    grupoActual.push(evento);
    finMaximoGrupo = Math.max(finMaximoGrupo, finMs);
  }
  cerrarGrupo();

  return resultado;
}
