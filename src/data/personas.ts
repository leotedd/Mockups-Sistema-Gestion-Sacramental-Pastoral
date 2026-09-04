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

export const PERSONAS_SEED: Persona[] = [
  { id: "per-01", nombres: "María Fernanda", apellidos: "Recinos Ovalle", sexo: "Femenino", tipoDocumento: "DPI", numeroDocumento: "2451 08877 0101", fechaNacimiento: "1988-03-14", telefono: "7845-1122", celular: "5512-4400", direccion: "3a. calle 4-21 zona 1", localidad: "Chiquimulilla", estado: "Activo" },
  { id: "per-02", nombres: "Carlos Humberto", apellidos: "Godoy Marroquín", sexo: "Masculino", tipoDocumento: "DPI", numeroDocumento: "2233 55210 0101", fechaNacimiento: "1979-11-02", telefono: "7845-3390", celular: "4471-9033", direccion: "1a. avenida 6-10 zona 2", localidad: "Chiquimulilla", estado: "Activo" },
  { id: "per-03", nombres: "Ana Lucía", apellidos: "Xicará Pérez", sexo: "Femenino", tipoDocumento: "DPI", numeroDocumento: "2987 44210 0101", fechaNacimiento: "1995-06-21", telefono: "", celular: "3312-7788", direccion: "Caserío El Ahumado", localidad: "Chiquimulilla", estado: "Activo" },
  { id: "per-04", nombres: "Rigoberto", apellidos: "Alvarado Sánchez", sexo: "Masculino", tipoDocumento: "DPI", numeroDocumento: "1980 22100 0101", fechaNacimiento: "1955-01-30", telefono: "7845-0098", celular: "", direccion: "Barrio San José", localidad: "Chiquimulilla", estado: "Inactivo" },
  { id: "per-05", nombres: "Marta Lidia", apellidos: "Solís Chacón", sexo: "Femenino", tipoDocumento: "DPI", numeroDocumento: "2765 11098 0101", fechaNacimiento: "1962-09-18", telefono: "7845-2211", celular: "3399-4410", direccion: "5a. calle 2-15 zona 1", localidad: "Chiquimulilla", estado: "Activo" },
  { id: "per-06", nombres: "Efraín", apellidos: "Morales Pineda", sexo: "Masculino", tipoDocumento: "Partida de nacimiento", numeroDocumento: "1998-04-09-0234", fechaNacimiento: "1998-04-09", telefono: "", celular: "5590-6642", direccion: "Colonia Las Flores", localidad: "Chiquimulilla", estado: "Activo" },
  { id: "per-07", nombres: "Rosa Emilia", apellidos: "Chacón Girón", sexo: "Femenino", tipoDocumento: "DPI", numeroDocumento: "2544 90871 0101", fechaNacimiento: "1970-12-05", telefono: "7845-4471", celular: "3345-0091", direccion: "2a. avenida 8-40 zona 3", localidad: "Chiquimulilla", estado: "Activo" },
  { id: "per-08", nombres: "Aura Marina", apellidos: "Castañeda López", sexo: "Femenino", tipoDocumento: "DPI", numeroDocumento: "2109 88450 0101", fechaNacimiento: "1948-07-22", telefono: "7845-5501", celular: "", direccion: "Barrio El Centro", localidad: "Chiquimulilla", estado: "Inactivo" },
  { id: "per-09", nombres: "Byron Estuardo", apellidos: "Lemus Ríos", sexo: "Masculino", tipoDocumento: "DPI", numeroDocumento: "2650 33217 0101", fechaNacimiento: "1990-02-17", telefono: "", celular: "5590-6642", direccion: "3a. avenida 1-05 zona 1", localidad: "Chiquimulilla", estado: "Activo" },
  { id: "per-10", nombres: "Diego Alejandro", apellidos: "Súchite Ramírez", sexo: "Masculino", tipoDocumento: "Partida de nacimiento", numeroDocumento: "2016-08-30-0119", fechaNacimiento: "2016-08-30", telefono: "", celular: "4490-5521", direccion: "Caserío Divino Niño", localidad: "Chiquimulilla", estado: "Activo" },
  { id: "per-11", nombres: "Gabriela Alejandra", apellidos: "Xión Morales", sexo: "Femenino", tipoDocumento: "Partida de nacimiento", numeroDocumento: "2015-05-12-0088", fechaNacimiento: "2015-05-12", telefono: "", celular: "3399-4410", direccion: "Caserío El Ahumado", localidad: "Chiquimulilla", estado: "Activo" },
  { id: "per-12", nombres: "Julio César", apellidos: "Menéndez Ortiz", sexo: "Masculino", tipoDocumento: "DPI", numeroDocumento: "2871 66540 0101", fechaNacimiento: "1965-10-08", telefono: "7845-6690", celular: "4412-3390", direccion: "6a. calle 3-19 zona 1", localidad: "Chiquimulilla", estado: "Activo" },
];
