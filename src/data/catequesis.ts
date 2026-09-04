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

export const CURSOS_SEED: Curso[] = [
  {
    id: "cur-01", tipoCurso: "Primera Comunión", ciclo: "2026-II", periodoDesde: "2026-02-01", periodoHasta: "2026-11-30", aulaPrincipal: "Aula San Pedro",
    participantes: [
      { personaId: "per-10", nombre: "Diego Alejandro Súchite Ramírez", funcion: "Catequisando" },
      { personaId: "per-11", nombre: "Gabriela Alejandra Xión Morales", funcion: "Catequisando" },
      { personaId: "per-07", nombre: "Rosa Emilia Chacón Girón", funcion: "Catequista" },
    ],
    clases: [
      { id: "cl-01", fecha: "2026-09-05", aula: "Aula San Pedro", tema: "La Eucaristía como banquete", observaciones: "Asistencia completa." },
      { id: "cl-02", fecha: "2026-09-12", aula: "Aula San Pedro", tema: "Preparación para la primera confesión" },
    ],
  },
  {
    id: "cur-02", tipoCurso: "Confirmación", ciclo: "2026-II", periodoDesde: "2026-03-01", periodoHasta: "2026-09-26", aulaPrincipal: "Aula Santa María",
    participantes: [
      { personaId: "per-06", nombre: "Efraín Morales Pineda", funcion: "Catequisando" },
      { personaId: "per-09", nombre: "Byron Estuardo Lemus Ríos", funcion: "Catequista" },
    ],
    clases: [
      { id: "cl-03", fecha: "2026-09-06", aula: "Aula Santa María", tema: "Los dones del Espíritu Santo" },
    ],
  },
  {
    id: "cur-03", tipoCurso: "Iniciación cristiana", ciclo: "2026-II", periodoDesde: "2026-02-15", periodoHasta: "2026-12-05", aulaPrincipal: "Salón San José",
    participantes: [{ personaId: "per-12", nombre: "Julio César Menéndez Ortiz", funcion: "Catequista" }],
    clases: [],
  },
  {
    id: "cur-04", tipoCurso: "Catequesis familiar", ciclo: "2025-II", periodoDesde: "2025-02-01", periodoHasta: "2025-11-28", aulaPrincipal: "Aula San Pedro",
    participantes: [],
    clases: [],
  },
];
