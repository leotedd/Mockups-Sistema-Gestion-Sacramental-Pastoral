/* Modulo Económico — construido desde cero. No existe mockup previo ni
   pantalla desarrollada; el respaldo es el esquema de base de datos
   (backend/prisma/schema.prisma, modelos ec*) y el catálogo de reportes
   (backend/prisma/tipo-de-reportes-sp.md, sección 5 "Módulo Económico y
   Contabilidad Parroquial": ecBalance, ecDiario, ecColaboracionesMes,
   ecConsultaMovAnualPersona). No se inventan procesos: cada pantalla
   corresponde a una tabla o reporte documentado.

   Jerarquía del catálogo de cuentas: Rubro > Grupo > Cuenta > Subcuenta
   (ecRubro > ecGrupo > ecCuenta > ecSubcuenta). Los movimientos se
   registran como cabecera + detalle (ecCabeceraRegistro / ecDetalleRegistro,
   columnas Debe/Haber). ecOrigenMovimiento clasifica cada movimiento como
   Ingreso, Egreso o Traspaso (ecTipoMovimiento). */

export type TipoMovimiento = "Ingreso" | "Egreso" | "Traspaso";

export const TIPOS_MOVIMIENTO: TipoMovimiento[] = ["Ingreso", "Egreso", "Traspaso"];

export const ORIGENES_MOVIMIENTO: Array<{ id: string; descripcion: string; tipo: TipoMovimiento }> = [
  { id: "om-01", descripcion: "Colecta dominical", tipo: "Ingreso" },
  { id: "om-02", descripcion: "Estipendio de intenciones", tipo: "Ingreso" },
  { id: "om-03", descripcion: "Cuota de catequesis", tipo: "Ingreso" },
  { id: "om-04", descripcion: "Donativo / colaboración", tipo: "Ingreso" },
  { id: "om-05", descripcion: "Pago de servicios (luz, agua)", tipo: "Egreso" },
  { id: "om-06", descripcion: "Pago a proveedor", tipo: "Egreso" },
  { id: "om-07", descripcion: "Estipendio a celebrante", tipo: "Egreso" },
  { id: "om-08", descripcion: "Traspaso entre cajas", tipo: "Traspaso" },
];

export const FORMAS_PAGO = ["Efectivo", "Transferencia bancaria", "Depósito", "Cheque"];

export interface Rubro { id: string; codigo: string; descripcion: string; }
export interface Grupo { id: string; rubroId: string; codigo: string; descripcion: string; }
export interface Cuenta { id: string; grupoId: string; codigo: string; descripcion: string; }
export interface Subcuenta { id: string; cuentaId: string; codigo: string; descripcion: string; activo: boolean; }

export const RUBROS_SEED: Rubro[] = [
  { id: "rub-1", codigo: "1", descripcion: "Activo" },
  { id: "rub-2", codigo: "2", descripcion: "Pasivo" },
  { id: "rub-4", codigo: "4", descripcion: "Ingresos" },
  { id: "rub-5", codigo: "5", descripcion: "Egresos" },
];

export const GRUPOS_SEED: Grupo[] = [
  { id: "gr-101", rubroId: "rub-1", codigo: "101", descripcion: "Disponibilidades" },
  { id: "gr-401", rubroId: "rub-4", codigo: "401", descripcion: "Colectas y ofrendas" },
  { id: "gr-402", rubroId: "rub-4", codigo: "402", descripcion: "Aranceles y estipendios" },
  { id: "gr-501", rubroId: "rub-5", codigo: "501", descripcion: "Gastos de funcionamiento" },
  { id: "gr-502", rubroId: "rub-5", codigo: "502", descripcion: "Gastos pastorales" },
];

export const CUENTAS_SEED: Cuenta[] = [
  { id: "cta-101-01", grupoId: "gr-101", codigo: "01", descripcion: "Caja general" },
  { id: "cta-101-02", grupoId: "gr-101", codigo: "02", descripcion: "Bancos" },
  { id: "cta-401-01", grupoId: "gr-401", codigo: "01", descripcion: "Colectas dominicales" },
  { id: "cta-401-02", grupoId: "gr-401", codigo: "02", descripcion: "Donativos y colaboraciones" },
  { id: "cta-402-01", grupoId: "gr-402", codigo: "01", descripcion: "Estipendios de intenciones" },
  { id: "cta-501-01", grupoId: "gr-501", codigo: "01", descripcion: "Servicios básicos" },
  { id: "cta-502-01", grupoId: "gr-502", codigo: "01", descripcion: "Estipendios a celebrantes" },
];

export const SUBCUENTAS_SEED: Subcuenta[] = [
  { id: "sub-1", cuentaId: "cta-101-01", codigo: "001", descripcion: "Caja chica secretaría", activo: true },
  { id: "sub-2", cuentaId: "cta-101-02", codigo: "001", descripcion: "Banco Industrial - cta. 123-456", activo: true },
  { id: "sub-3", cuentaId: "cta-401-01", codigo: "001", descripcion: "Colecta 1ª misa dominical", activo: true },
  { id: "sub-4", cuentaId: "cta-401-01", codigo: "002", descripcion: "Colecta 2ª misa dominical", activo: true },
  { id: "sub-5", cuentaId: "cta-401-02", codigo: "001", descripcion: "Donativos bienhechores", activo: true },
  { id: "sub-6", cuentaId: "cta-402-01", codigo: "001", descripcion: "Intenciones de misa", activo: true },
  { id: "sub-7", cuentaId: "cta-501-01", codigo: "001", descripcion: "Energía eléctrica", activo: true },
  { id: "sub-8", cuentaId: "cta-501-01", codigo: "002", descripcion: "Agua potable", activo: true },
  { id: "sub-9", cuentaId: "cta-502-01", codigo: "001", descripcion: "Estipendio sacerdote celebrante", activo: true },
];

export interface DetalleMovimiento {
  id: string;
  subcuentaId: string;
  subcuenta: string;
  centroCosto?: string;
  debe: number;
  haber: number;
  formaPago: string;
}

export interface MovimientoRegistro {
  id: string;
  numeroRegistro: number;
  fecha: string;
  origenId: string;
  origen: string;
  tipo: TipoMovimiento;
  descripcion: string;
  destinatario: string;
  periodoAnio: number;
  periodoMes: number;
  cerrado: boolean;
  detalle: DetalleMovimiento[];
}

function totalDebe(m: DetalleMovimiento[]) { return m.reduce((s, d) => s + d.debe, 0); }
function totalHaber(m: DetalleMovimiento[]) { return m.reduce((s, d) => s + d.haber, 0); }
export { totalDebe, totalHaber };

/** Sin movimientos precargados: el mockup arranca vacío. Se registran localmente con "Nuevo movimiento". El catálogo de cuentas (Rubro/Grupo/Cuenta/Subcuenta) y los orígenes de movimiento sí se conservan: son catálogo necesario para el formulario, no registros de transacciones. */
export const MOVIMIENTOS_SEED: MovimientoRegistro[] = [];

export interface Proveedor {
  id: string;
  descripcion: string;
  direccion: string;
  localidad: string;
  telefono: string;
  email: string;
  contacto: string;
}

/** Sin proveedores precargados: el mockup arranca vacío. Se registran localmente con "Nuevo proveedor". */
export const PROVEEDORES_SEED: Proveedor[] = [];

export interface Vencimiento {
  id: string;
  concepto: string;
  fechaIngreso: string;
  fechaVencimiento: string;
  importe: number;
  esDebito: boolean;
  cancelado: boolean;
}

/** Sin vencimientos precargados: el mockup arranca vacío. Se registran localmente con "Nuevo vencimiento". */
export const VENCIMIENTOS_SEED: Vencimiento[] = [];
