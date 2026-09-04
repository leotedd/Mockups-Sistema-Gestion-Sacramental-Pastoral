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

export const REGISTROS_SEED: RegistroSacramental[] = [
  {
    id: "sac-01", tipo: "Bautismo", persona: "Diego Alejandro Súchite Ramírez", libroSacramental: "Libro de Bautismos N.° 14", anio: "2016", folio: "088", acta: "176",
    fecha: "2016-11-06", cumpleDerechoCanonico: true, anulada: false, esExterno: false, observaciones: "Bautizo comunitario del 12/09.",
    participantes: [
      { personaId: "per-07", nombre: "Rosa Emilia Chacón Girón", relacion: "Madrina" },
      { personaId: "per-09", nombre: "Byron Estuardo Lemus Ríos", relacion: "Padrino" },
    ],
    notasMarginales: [],
  },
  {
    id: "sac-02", tipo: "Matrimonio", persona: "Carlos Humberto Godoy Marroquín", persona2: "María Fernanda Recinos Ovalle", libroSacramental: "Libro de Matrimonios N.° 9", anio: "2015", folio: "021", acta: "021",
    fecha: "2015-10-20", cumpleDerechoCanonico: true, anulada: false, esExterno: false, observaciones: "Expediente prematrimonial completo.",
    participantes: [
      { personaId: "per-05", nombre: "Marta Lidia Solís Chacón", relacion: "Testigo" },
      { personaId: "per-12", nombre: "Julio César Menéndez Ortiz", relacion: "Testigo" },
    ],
    notasMarginales: [],
  },
  {
    id: "sac-03", tipo: "Confirmación", persona: "Efraín Morales Pineda", libroSacramental: "Libro de Confirmaciones N.° 6", anio: "2024", folio: "045", acta: "112",
    fecha: "2024-09-22", cumpleDerechoCanonico: true, anulada: false, esExterno: false,
    participantes: [{ personaId: "per-07", nombre: "Rosa Emilia Chacón Girón", relacion: "Madrina" }],
    notasMarginales: [],
  },
  {
    id: "sac-04", tipo: "Exequias", persona: "Rigoberto Alvarado Sánchez", libroSacramental: "Libro de Defunciones N.° 11", anio: "2026", folio: "013", acta: "029",
    fecha: "2026-09-13", cumpleDerechoCanonico: true, anulada: false, esExterno: false, observaciones: "Misa de exequias en el templo parroquial.",
    participantes: [], notasMarginales: [],
  },
  {
    id: "sac-05", tipo: "Bautismo", persona: "Gabriela Alejandra Xión Morales", libroSacramental: "Libro de Bautismos N.° 14", anio: "2015", folio: "071", acta: "150",
    fecha: "2015-08-15", cumpleDerechoCanonico: true, anulada: false, esExterno: true, observaciones: "Bautizada en la Parroquia San Miguel Arcángel, Guazacapán.",
    participantes: [], notasMarginales: [
      { id: "nm-01", razon: "Matrimonio", fecha: "2026-01-10", referenciaLibro: "9", referenciaFolio: "030", nota: "Se anota al margen la celebración de su matrimonio.", secreta: false },
    ],
  },
];
