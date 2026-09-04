/* Alineado con frontend/src/types/parroquias.ts del desarrollo real. */

export interface Obispado {
  id: string;
  nombre: string;
  obispo: string;
  activo: boolean;
}

export interface Parroquia {
  id: string;
  nombre: string;
  parroco: string;
  municipio: string;
  direccion: string;
  telefono: string;
  horarioAtencion: string;
  idObispado: string;
  activo: boolean;
}

export const OBISPADOS_SEED: Obispado[] = [
  { id: "ob-01", nombre: "Diócesis de Santa Rosa de Lima", obispo: "Mons. Rodolfo Antonio Aguilar", activo: true },
  { id: "ob-02", nombre: "Arquidiócesis de Guatemala", obispo: "Mons. Vacante", activo: true },
];

export const PARROQUIAS_SEED: Parroquia[] = [
  { id: "par-01", nombre: "Parroquia Santa Cruz", parroco: "Pbro. Miguel Ángel Recinos", municipio: "Chiquimulilla", direccion: "3a. calle 2-10 zona 1", telefono: "7845-0001", horarioAtencion: "Lun–Vie 08:00–17:00", idObispado: "ob-01", activo: true },
  { id: "par-02", nombre: "Parroquia San José", parroco: "Pbro. José Roberto Colindres", municipio: "Chiquimulilla", direccion: "Barrio San José", telefono: "7845-0022", horarioAtencion: "Lun–Vie 08:00–16:00", idObispado: "ob-01", activo: true },
  { id: "par-03", nombre: "Parroquia Nuestra Señora del Rosario", parroco: "Pbro. Fernando Estuardo Ríos", municipio: "Taxisco", direccion: "Centro, Taxisco", telefono: "7845-0044", horarioAtencion: "Mar–Sáb 09:00–17:00", idObispado: "ob-01", activo: true },
  { id: "par-04", nombre: "Parroquia San Miguel Arcángel", parroco: "Pbro. Carlos Humberto Marroquín", municipio: "Guazacapán", direccion: "Centro, Guazacapán", telefono: "7845-0066", horarioAtencion: "Lun–Vie 08:00–16:00", idObispado: "ob-01", activo: false },
];
