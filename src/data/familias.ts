/* Modulo Familias — construido desde cero (no existe pantalla desarrollada
   todavía; el frontend real solo tiene el servicio `familiasService.ts`
   preparado). Campos alineados con backend/src/modules/familias/dto/
   familia.dto.ts y el modelo `familia` de prisma/schema.prisma:
   Nombre, IdResidencia, IdPadre/IdMadre, IdUnion, FechaUnion, Domicilio,
   Localidad, CodigoPostal, Provincia, Telefono, PerteneceRadioParroquial,
   e integrantes (IdPersona + IdTipoIntegrante + descripcion). */

export type TipoResidencia = "Propia" | "Alquilada" | "Prestada" | "Familiar" | "No especifica";
export type TipoUnion = "Matrimonio canónico" | "Matrimonio civil" | "Unión de hecho" | "No especifica";
export type TipoIntegrante = "Padre" | "Madre" | "Hijo(a)" | "Abuelo(a)" | "Otro familiar";

export const TIPOS_RESIDENCIA: TipoResidencia[] = ["Propia", "Alquilada", "Prestada", "Familiar", "No especifica"];
export const TIPOS_UNION: TipoUnion[] = ["Matrimonio canónico", "Matrimonio civil", "Unión de hecho", "No especifica"];
export const TIPOS_INTEGRANTE: TipoIntegrante[] = ["Padre", "Madre", "Hijo(a)", "Abuelo(a)", "Otro familiar"];

export interface IntegranteFamilia {
  personaId: string;
  nombre: string;
  tipo: TipoIntegrante;
  descripcion?: string;
}

export interface Familia {
  id: string;
  nombre: string;
  tipoResidencia: TipoResidencia;
  padre?: string;
  madre?: string;
  tipoUnion: TipoUnion;
  fechaUnion?: string;
  domicilio: string;
  localidad: string;
  telefono: string;
  perteneceRadioParroquial: boolean;
  integrantes: IntegranteFamilia[];
}

export const FAMILIAS_SEED: Familia[] = [
  {
    id: "fam-01", nombre: "Familia Recinos Ovalle", tipoResidencia: "Propia", padre: "Carlos Humberto Godoy Marroquín", madre: "María Fernanda Recinos Ovalle",
    tipoUnion: "Matrimonio canónico", fechaUnion: "2015-10-20", domicilio: "3a. calle 4-21 zona 1", localidad: "Chiquimulilla", telefono: "7845-1122",
    perteneceRadioParroquial: true,
    integrantes: [
      { personaId: "per-01", nombre: "María Fernanda Recinos Ovalle", tipo: "Madre" },
      { personaId: "per-02", nombre: "Carlos Humberto Godoy Marroquín", tipo: "Padre" },
      { personaId: "per-10", nombre: "Diego Alejandro Súchite Ramírez", tipo: "Hijo(a)" },
    ],
  },
  {
    id: "fam-02", nombre: "Familia Xicará Pérez", tipoResidencia: "Familiar", madre: "Ana Lucía Xicará Pérez",
    tipoUnion: "Unión de hecho", domicilio: "Caserío El Ahumado", localidad: "Chiquimulilla", telefono: "3312-7788",
    perteneceRadioParroquial: true,
    integrantes: [
      { personaId: "per-03", nombre: "Ana Lucía Xicará Pérez", tipo: "Madre" },
      { personaId: "per-11", nombre: "Gabriela Alejandra Xión Morales", tipo: "Hijo(a)" },
    ],
  },
  {
    id: "fam-03", nombre: "Familia Solís Chacón", tipoResidencia: "Propia", madre: "Marta Lidia Solís Chacón",
    tipoUnion: "No especifica", domicilio: "5a. calle 2-15 zona 1", localidad: "Chiquimulilla", telefono: "7845-2211",
    perteneceRadioParroquial: true,
    integrantes: [{ personaId: "per-05", nombre: "Marta Lidia Solís Chacón", tipo: "Madre" }],
  },
  {
    id: "fam-04", nombre: "Familia Alvarado Sánchez", tipoResidencia: "Alquilada", padre: "Rigoberto Alvarado Sánchez",
    tipoUnion: "Matrimonio canónico", fechaUnion: "1978-05-14", domicilio: "Barrio San José", localidad: "Chiquimulilla", telefono: "7845-0098",
    perteneceRadioParroquial: false,
    integrantes: [{ personaId: "per-04", nombre: "Rigoberto Alvarado Sánchez", tipo: "Padre" }],
  },
  {
    id: "fam-05", nombre: "Familia Chacón Girón", tipoResidencia: "Propia", madre: "Rosa Emilia Chacón Girón",
    tipoUnion: "Matrimonio canónico", fechaUnion: "1992-02-08", domicilio: "2a. avenida 8-40 zona 3", localidad: "Chiquimulilla", telefono: "7845-4471",
    perteneceRadioParroquial: true,
    integrantes: [{ personaId: "per-07", nombre: "Rosa Emilia Chacón Girón", tipo: "Madre" }],
  },
];
