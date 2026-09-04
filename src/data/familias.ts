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

/** Sin familias precargadas: el mockup arranca vacío. Se registran localmente con "Nuevo" para demostrar el flujo. */
export const FAMILIAS_SEED: Familia[] = [];
