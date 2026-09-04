/* Modelo funcional del modulo Personas. Campos alineados con
   frontend/src/types/personas.ts del desarrollo real. */

export type Sexo = "Masculino" | "Femenino";
export type TipoDocumento = "DPI" | "Partida de nacimiento" | "Pasaporte" | "Otro";
export type EstadoPersona = "Activo" | "Inactivo";

export interface Persona {
  id: string;
  nombres: string;
  apellidos: string;
  sexo: Sexo;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  fechaNacimiento: string; // ISO yyyy-mm-dd
  telefono: string;
  celular: string;
  direccion: string;
  localidad: string;
  estado: EstadoPersona;
}

export const SEXOS: Sexo[] = ["Masculino", "Femenino"];
export const TIPOS_DOCUMENTO: TipoDocumento[] = ["DPI", "Partida de nacimiento", "Pasaporte", "Otro"];

/** Sin personas precargadas: el mockup arranca vacío. Se registran localmente con "Nuevo" para demostrar el flujo (y quedan disponibles como celebrantes en Celebraciones). */
export const PERSONAS_SEED: Persona[] = [];
