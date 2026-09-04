/* Modelo funcional del modulo Celebraciones.
   Nombres de dominio orientados al usuario final (sin nombres tecnicos de tablas ni IDs visibles). */

export type EstadoCelebracion =
  | "Programada"
  | "Confirmada"
  | "Realizada"
  | "Cancelada";

export type TipoCelebracion =
  | "Misa dominical"
  | "Misa entre semana"
  | "Bautizo comunitario"
  | "Confirmación"
  | "Primera comunión"
  | "Matrimonio"
  | "Celebración especial";

export type TipoIntencion =
  | "Acción de gracias"
  | "Difuntos"
  | "Salud"
  | "Aniversario"
  | "Intención especial"
  | "Por la comunidad";

/**
 * Celebrante asignado. Alineado con `CelebranteAsignado` real
 * (components/celebraciones/CelebrantesCelebracion.tsx del desarrollo
 * actual): solo id + nombre + principal. El sistema real NO asocia un
 * "rol" (Párroco/Vicario/etc.) al celebrante; los celebrantes se eligen
 * directamente del padrón de Personas (`GET /personas`), por eso aquí se
 * seleccionan desde `data/personas.ts`, no de un catálogo aparte.
 */
export interface Celebrante {
  personaId: string;
  nombre: string;
  principal: boolean;
}

export interface Intencion {
  id: string;
  tipo: TipoIntencion;
  descripcion: string;
  solicitante?: string;
  observaciones?: string;
  /** Ofrenda / estipendio asociado a la intención (opcional), campo real "Ofrenda (Q)". */
  importe?: number;
}

export interface Celebracion {
  id: string;
  tipo: TipoCelebracion;
  fecha: string; // ISO yyyy-mm-dd
  horaDesde: string; // HH:mm
  horaHasta?: string; // HH:mm
  lugar: string;
  estado: EstadoCelebracion;
  observaciones?: string;
  celebrantes: Celebrante[];
  intenciones: Intencion[];
}

export interface CelebracionFiltro {
  texto: string;
  desde: string;
  hasta: string;
  tipo: string;
  lugar: string;
  estado: string;
}

/** Contenido principal del modulo: listado, alta (modal), detalle o edicion (en linea). */
export type ModoCelebraciones = "listado" | "nuevo" | "detalle" | "editar";
export type VistaCelebraciones = "listado" | "calendario";
export type VistaCalendarioCelebraciones = "dia" | "laboral" | "semana" | "mes";
