/* Modulo Catequesis — construido desde cero (el frontend real solo tiene el
   servicio `catequesisService.ts` preparado, sin pantalla propia todavía).
   Campos alineados con backend/src/modules/catequesis/dto/*.dto.ts y las
   tablas caCurso, caAula, caClase, caCursoParticipante del schema:
   idTipoCurso, ciclo, periodoDesde/Hasta, aula (descripcion/ubicacion),
   participantes (persona + funcion: Catequisando/Catequista), clases
   (fecha, tema, aula, observaciones). */

export type TipoCurso = "Iniciación cristiana" | "Primera Comunión" | "Confirmación" | "Catequesis familiar" | "Catequesis de adultos";
export type FuncionCatequesis = "Catequisando" | "Catequista";

export const TIPOS_CURSO: TipoCurso[] = ["Iniciación cristiana", "Primera Comunión", "Confirmación", "Catequesis familiar", "Catequesis de adultos"];

export interface Aula {
  id: string;
  descripcion: string;
  ubicacion: string;
  predeterminada: boolean;
}

export interface ParticipanteCurso {
  personaId: string;
  nombre: string;
  funcion: FuncionCatequesis;
}

export interface ClaseCurso {
  id: string;
  fecha: string;
  aula: string;
  tema: string;
  observaciones?: string;
}

export interface Curso {
  id: string;
  tipoCurso: TipoCurso;
  ciclo: string;
  periodoDesde: string;
  periodoHasta: string;
  aulaPrincipal: string;
  participantes: ParticipanteCurso[];
  clases: ClaseCurso[];
}

export const AULAS_SEED: Aula[] = [
  { id: "aula-01", descripcion: "Aula San Pedro", ubicacion: "Planta baja, salón parroquial", predeterminada: true },
  { id: "aula-02", descripcion: "Aula Santa María", ubicacion: "Segundo nivel, salón parroquial", predeterminada: false },
  { id: "aula-03", descripcion: "Salón San José", ubicacion: "Anexo capilla San José", predeterminada: false },
];

/** Sin cursos precargados: el mockup arranca vacío. Se registran localmente con "Nuevo" para demostrar el flujo. Las aulas (AULAS_SEED) sí se conservan: son catálogo, no registros. */
export const CURSOS_SEED: Curso[] = [];
