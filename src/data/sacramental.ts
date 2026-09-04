/* Modulo Sacramental — construido desde cero (todavia sin pantalla en el
   desarrollo real, solo modulo de backend `modules/sacramentos`). Campos
   alineados con backend/src/modules/sacramentos/dto/*.dto.ts y los modelos
   `sacramento`, `salibro`, `saparticipante`, `sanotamarginal` del schema:
   tipo de sacramento, persona principal (+ persona2 en matrimonio), libro
   sacramental, año/folio/acta, participantes (padrino/madrina/testigo),
   notas marginales, y si cumple derecho canónico. Los ~140 campos
   genealógicos de `sadatos` (abuelos, domicilios de padrinos/testigos, etc.)
   se resumen aquí a los campos que la propia API expone en sus DTOs. */

export type TipoSacramento = "Bautismo" | "Confirmación" | "Eucaristía" | "Matrimonio" | "Exequias";
export type RelacionSacramental = "Padrino" | "Madrina" | "Testigo";

export const TIPOS_SACRAMENTO: TipoSacramento[] = ["Bautismo", "Confirmación", "Eucaristía", "Matrimonio", "Exequias"];

export interface ParticipanteSacramento {
  personaId: string;
  nombre: string;
  relacion: RelacionSacramental;
}

export interface NotaMarginal {
  id: string;
  razon: string;
  fecha: string;
  referenciaLibro?: string;
  referenciaFolio?: string;
  nota: string;
  secreta: boolean;
}

export interface RegistroSacramental {
  id: string;
  tipo: TipoSacramento;
  persona: string;
  persona2?: string; // Contrayente 2, solo Matrimonio
  libroSacramental: string;
  anio: string;
  folio: string;
  acta: string;
  fecha: string;
  cumpleDerechoCanonico: boolean;
  anulada: boolean;
  esExterno: boolean;
  observaciones?: string;
  participantes: ParticipanteSacramento[];
  notasMarginales: NotaMarginal[];
}

export const LIBROS_SEED = ["Libro de Bautismos N.° 14", "Libro de Confirmaciones N.° 6", "Libro de Matrimonios N.° 9", "Libro de Defunciones N.° 11"];

/** Sin registros sacramentales precargados: el mockup arranca vacío. Se registran localmente con "Nuevo". Los libros (LIBROS_SEED) sí se conservan: son catálogo, no registros. */
export const REGISTROS_SEED: RegistroSacramental[] = [];
