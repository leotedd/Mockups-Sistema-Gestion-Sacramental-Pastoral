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

export const MOVIMIENTOS_SEED: MovimientoRegistro[] = [
  {
    id: "mov-01", numeroRegistro: 1042, fecha: "2026-09-06", origenId: "om-01", origen: "Colecta dominical", tipo: "Ingreso",
    descripcion: "Colecta misas dominicales 06/09", destinatario: "Parroquia Santa Cruz", periodoAnio: 2026, periodoMes: 9, cerrado: false,
    detalle: [
      { id: "d-01", subcuentaId: "sub-1", subcuenta: "Caja chica secretaría", debe: 1850, haber: 0, formaPago: "Efectivo" },
      { id: "d-02", subcuentaId: "sub-3", subcuenta: "Colecta 1ª misa dominical", debe: 0, haber: 1850, formaPago: "Efectivo" },
    ],
  },
  {
    id: "mov-02", numeroRegistro: 1043, fecha: "2026-09-06", origenId: "om-02", origen: "Estipendio de intenciones", tipo: "Ingreso",
    descripcion: "Estipendios de intenciones de la semana", destinatario: "Familia Godoy / Familia Recinos", periodoAnio: 2026, periodoMes: 9, cerrado: false,
    detalle: [
      { id: "d-03", subcuentaId: "sub-1", subcuenta: "Caja chica secretaría", debe: 300, haber: 0, formaPago: "Efectivo" },
      { id: "d-04", subcuentaId: "sub-6", subcuenta: "Intenciones de misa", debe: 0, haber: 300, formaPago: "Efectivo" },
    ],
  },
  {
    id: "mov-03", numeroRegistro: 1044, fecha: "2026-09-08", origenId: "om-05", origen: "Pago de servicios (luz, agua)", tipo: "Egreso",
    descripcion: "Pago factura de energía eléctrica agosto", destinatario: "Empresa Eléctrica Municipal", periodoAnio: 2026, periodoMes: 9, cerrado: false,
    detalle: [
      { id: "d-05", subcuentaId: "sub-7", subcuenta: "Energía eléctrica", debe: 640, haber: 0, formaPago: "Transferencia bancaria" },
      { id: "d-06", subcuentaId: "sub-2", subcuenta: "Banco Industrial - cta. 123-456", debe: 0, haber: 640, formaPago: "Transferencia bancaria" },
    ],
  },
  {
    id: "mov-04", numeroRegistro: 1045, fecha: "2026-09-19", origenId: "om-07", origen: "Estipendio a celebrante", tipo: "Egreso",
    descripcion: "Estipendio matrimonio 19/09", destinatario: "Pbro. Miguel Ángel Recinos", periodoAnio: 2026, periodoMes: 9, cerrado: false,
    detalle: [
      { id: "d-07", subcuentaId: "sub-9", subcuenta: "Estipendio sacerdote celebrante", debe: 250, haber: 0, formaPago: "Efectivo" },
      { id: "d-08", subcuentaId: "sub-1", subcuenta: "Caja chica secretaría", debe: 0, haber: 250, formaPago: "Efectivo" },
    ],
  },
  {
    id: "mov-05", numeroRegistro: 1041, fecha: "2026-08-30", origenId: "om-01", origen: "Colecta dominical", tipo: "Ingreso",
    descripcion: "Colecta misas dominicales 30/08", destinatario: "Parroquia Santa Cruz", periodoAnio: 2026, periodoMes: 8, cerrado: true,
    detalle: [
      { id: "d-09", subcuentaId: "sub-1", subcuenta: "Caja chica secretaría", debe: 1620, haber: 0, formaPago: "Efectivo" },
      { id: "d-10", subcuentaId: "sub-3", subcuenta: "Colecta 1ª misa dominical", debe: 0, haber: 1620, formaPago: "Efectivo" },
    ],
  },
];

export interface Proveedor {
  id: string;
  descripcion: string;
  direccion: string;
  localidad: string;
  telefono: string;
  email: string;
  contacto: string;
}

export const PROVEEDORES_SEED: Proveedor[] = [
  { id: "prov-01", descripcion: "Empresa Eléctrica Municipal", direccion: "Zona 1, Chiquimulilla", localidad: "Chiquimulilla", telefono: "7845-9001", email: "cobros@eem.gt", contacto: "Depto. de cobros" },
  { id: "prov-02", descripcion: "Ferretería San Isidro", direccion: "4a. calle 1-12 zona 1", localidad: "Chiquimulilla", telefono: "7845-3320", email: "", contacto: "Don Isidro Pérez" },
  { id: "prov-03", descripcion: "Imprenta Litografía Central", direccion: "2a. avenida 3-45 zona 1", localidad: "Chiquimulilla", telefono: "7845-7712", email: "pedidos@litocentral.com", contacto: "Sucely Ramos" },
];

export interface Vencimiento {
  id: string;
  concepto: string;
  fechaIngreso: string;
  fechaVencimiento: string;
  importe: number;
  esDebito: boolean;
  cancelado: boolean;
}

export const VENCIMIENTOS_SEED: Vencimiento[] = [
  { id: "ven-01", concepto: "Pago agua potable - septiembre", fechaIngreso: "2026-09-01", fechaVencimiento: "2026-09-15", importe: 180, esDebito: true, cancelado: false },
  { id: "ven-02", concepto: "Cuota diocesana anual", fechaIngreso: "2026-08-01", fechaVencimiento: "2026-09-30", importe: 3200, esDebito: true, cancelado: false },
  { id: "ven-03", concepto: "Donativo pendiente de cobro - Familia Recinos", fechaIngreso: "2026-08-20", fechaVencimiento: "2026-09-10", importe: 500, esDebito: false, cancelado: true },
  { id: "ven-04", concepto: "Pago factura imprenta (boletines)", fechaIngreso: "2026-09-03", fechaVencimiento: "2026-09-20", importe: 420, esDebito: true, cancelado: false },
];
