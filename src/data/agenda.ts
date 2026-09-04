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

export const CITAS_SEED: Cita[] = [
  { id: "ag-01", asunto: "Reunión Consejo Pastoral", lugar: "Salón parroquial", inicio: "2026-09-01T18:00", fin: "2026-09-01T19:30", prioridad: "Alta", recordatorio: "1 día", observaciones: "Revisión de actividades del mes." },
  { id: "ag-02", asunto: "Plática pre-bautismal", lugar: "Salón San José", inicio: "2026-09-02T16:00", fin: "2026-09-02T17:30", prioridad: "Media", recordatorio: "1 hora", observaciones: "12 familias inscritas." },
  { id: "ag-03", asunto: "Visita a enfermos", lugar: "Comunidad El Ahumado", inicio: "2026-09-03T09:00", fin: "2026-09-03T11:00", prioridad: "Media", recordatorio: "1 hora", observaciones: "" },
  { id: "ag-04", asunto: "Ensayo coro juvenil", lugar: "Templo parroquial Santa Cruz", inicio: "2026-09-04T19:00", fin: "2026-09-04T20:30", prioridad: "Baja", recordatorio: "30 min", observaciones: "" },
  { id: "ag-05", asunto: "Reunión catequistas", lugar: "Salón parroquial", inicio: "2026-09-05T18:30", fin: "2026-09-05T20:00", prioridad: "Media", recordatorio: "1 hora", observaciones: "Planificación del ciclo 2026-II." },
  { id: "ag-06", asunto: "Entrevista prematrimonial", lugar: "Oficina parroquial", inicio: "2026-09-07T10:00", fin: "2026-09-07T11:00", prioridad: "Alta", recordatorio: "1 día", observaciones: "Pareja: Godoy / Xicará." },
  { id: "ag-07", asunto: "Consejo económico parroquial", lugar: "Oficina parroquial", inicio: "2026-09-08T17:00", fin: "2026-09-08T18:30", prioridad: "Alta", recordatorio: "1 día", observaciones: "Revisión del informe mensual de colecta." },
  { id: "ag-08", asunto: "Visita pastoral - Capilla San José", lugar: "Capilla San José", inicio: "2026-09-09T15:00", fin: "2026-09-09T17:00", prioridad: "Media", recordatorio: "1 hora", observaciones: "" },
  { id: "ag-09", asunto: "Reunión pastoral juvenil", lugar: "Salón parroquial", inicio: "2026-09-10T19:00", fin: "2026-09-10T20:30", prioridad: "Baja", recordatorio: "30 min", observaciones: "Preparación logística de la Confirmación." },
  { id: "ag-10", asunto: "Comité fiesta patronal", lugar: "Salón parroquial", inicio: "2026-09-11T18:00", fin: "2026-09-11T20:00", prioridad: "Alta", recordatorio: "1 día", observaciones: "Exaltación de la Santa Cruz, 14/09." },
  { id: "ag-11", asunto: "Capacitación secretaría", lugar: "Oficina parroquial", inicio: "2026-09-14T09:00", fin: "2026-09-14T12:00", prioridad: "Media", recordatorio: "1 hora", observaciones: "Uso del sistema de gestión sacramental.", cancelada: true },
  { id: "ag-12", asunto: "Visita diocesana", lugar: "Templo parroquial Santa Cruz", inicio: "2026-09-18T10:00", fin: "2026-09-18T12:00", prioridad: "Alta", recordatorio: "1 día", observaciones: "Preparación previa a la Confirmación del 26/09." },
];
