/* Modelo funcional del modulo Agenda. Campos alineados con
   shared/src/types/agenda.ts del desarrollo real (Appointment: asunto,
   lugar, inicio/fin ISO, prioridad, recordatorio, observaciones). Se omite
   la configuracion de periodicidad (recurrencia) por ser una funcionalidad
   secundaria del formulario real; el resto de campos coincide. */

export type Prioridad = "Baja" | "Media" | "Alta";
export type Recordatorio = "15 min" | "30 min" | "1 hora" | "1 día" | "Sin recordatorio";
export type VistaAgenda = "dia" | "laboral" | "semana" | "mes";

export interface Cita {
  id: string;
  asunto: string;
  lugar: string;
  inicio: string; // ISO local "YYYY-MM-DDTHH:mm"
  fin: string;
  prioridad: Prioridad;
  recordatorio: Recordatorio;
  observaciones: string;
  cancelada?: boolean;
}

export const PRIORIDADES: Prioridad[] = ["Alta", "Media", "Baja"];
export const RECORDATORIOS: Recordatorio[] = ["15 min", "30 min", "1 hora", "1 día", "Sin recordatorio"];

export const COLOR_PRIORIDAD: Record<Prioridad, string> = {
  Alta: "var(--peligro)",
  Media: "var(--dorado)",
  Baja: "var(--ok)",
};

/** Sin citas precargadas: el mockup arranca vacío. Las citas se crean localmente con "Nuevo" para demostrar el flujo. */
export const CITAS_SEED: Cita[] = [];
