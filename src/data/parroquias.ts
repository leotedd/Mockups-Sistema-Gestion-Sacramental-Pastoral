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

/** Sin sedes precargadas: el mockup arranca vacío. Se registran localmente con "Nueva". Las diócesis (OBISPADOS_SEED) sí se conservan: son catálogo necesario para el formulario, no registros de sedes. */
export const PARROQUIAS_SEED: Parroquia[] = [];
