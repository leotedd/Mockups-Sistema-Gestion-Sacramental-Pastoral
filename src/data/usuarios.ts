/* Alineado con frontend/src/types/usuarios.ts del desarrollo real. */

export interface Rol {
  id: string;
  nombre: string;
}

export interface Usuario {
  id: string;
  usuario: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  roles: string[];
}

export const ROLES_SEED: Rol[] = [
  { id: "rol-1", nombre: "Administrador" },
  { id: "rol-2", nombre: "Secretaría" },
  { id: "rol-3", nombre: "Sacerdote" },
  { id: "rol-4", nombre: "Catequista" },
  { id: "rol-5", nombre: "Feligrés" },
  { id: "rol-6", nombre: "Comité de Semana Santa" },
];

export const USUARIOS_SEED: Usuario[] = [
  { id: "usr-01", usuario: "admin", nombre: "Administrador del sistema", descripcion: "Cuenta técnica", activo: true, roles: ["Administrador"] },
  { id: "usr-02", usuario: "secretaria", nombre: "Marta Lidia Solís", descripcion: "Secretaría parroquial", activo: true, roles: ["Secretaría"] },
  { id: "usr-03", usuario: "sacerdote", nombre: "Pbro. Miguel Ángel Recinos", descripcion: "Párroco", activo: true, roles: ["Sacerdote", "Administrador"] },
  { id: "usr-04", usuario: "catequista", nombre: "Rosa Emilia Chacón", descripcion: "Coordinadora de catequesis", activo: true, roles: ["Catequista"] },
  { id: "usr-05", usuario: "vicario", nombre: "Pbro. José Roberto Colindres", descripcion: "Vicario parroquial", activo: true, roles: ["Sacerdote"] },
  { id: "usr-06", usuario: "comite.ss", nombre: "Carlos Humberto Godoy", descripcion: "Comité de Semana Santa", activo: false, roles: ["Comité de Semana Santa"] },
];
