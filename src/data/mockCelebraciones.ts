import type { Celebracion } from "./types";

/**
 * Estado inicial del módulo Celebraciones: SIN registros precargados.
 * El mockup debe demostrar el flujo (Nuevo → Guardar → aparece en el
 * listado) con datos que el propio usuario crea en la sesión, en vez de
 * simular información de una parroquia real. Los catálogos (tipos, lugares,
 * estados, tipos de intención) SÍ se conservan en `data/catalogos.ts`
 * porque son opciones necesarias para poder usar los formularios, no
 * registros de celebraciones.
 */
export const CELEBRACIONES_SEED: Celebracion[] = [];
