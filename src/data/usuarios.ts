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

/** Sin usuarios precargados: el mockup arranca vacío. Se registran localmente con "Nuevo". Los roles (ROLES_SEED) sí se conservan: son catálogo necesario para el formulario, no cuentas de usuario. */
export const USUARIOS_SEED: Usuario[] = [];
