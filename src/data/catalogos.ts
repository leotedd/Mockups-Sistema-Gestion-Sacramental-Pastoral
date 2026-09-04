import type { TipoCelebracion, TipoIntencion } from "./types";

/* Catalogos (equivalentes conceptuales a ceTipoCelebracion, ceTipoLugar,
   ceTipoIntencion, geEntidadDatos). Datos ficticios.
   Los celebrantes YA NO tienen catálogo propio aquí: en el desarrollo real
   se seleccionan directamente del padrón de Personas (`GET /personas`), por
   lo que el mockup usa `PERSONAS_SEED` de `data/personas.ts` para ese fin
   (ver SeleccionarCelebranteModal). */

export const TIPOS_CELEBRACION: TipoCelebracion[] = [
  "Misa dominical",
  "Misa entre semana",
  "Bautizo comunitario",
  "Confirmación",
  "Primera comunión",
  "Matrimonio",
  "Celebración especial",
];

export const LUGARES: string[] = [
  "Templo parroquial Santa Cruz",
  "Capilla San José",
  "Capilla Virgen de Guadalupe",
  "Capilla Divino Niño (El Ahumado)",
  "Salón parroquial",
  "Atrio del templo",
];

export const TIPOS_INTENCION: TipoIntencion[] = [
  "Acción de gracias",
  "Difuntos",
  "Salud",
  "Aniversario",
  "Intención especial",
  "Por la comunidad",
];

export const ESTADOS = [
  "Programada",
  "Confirmada",
  "Realizada",
  "Cancelada",
] as const;
