import type { ReactNode } from "react";

export type ChipTono = "activo" | "inactivo" | "pendiente" | "vencido" | "info";

const CLASE: Record<ChipTono, string> = {
  activo: "chip--activo",
  inactivo: "chip--inactivo",
  pendiente: "chip--pendiente",
  vencido: "chip--vencido",
  info: "chip--info",
};

/** Chip de estado generico (fuera de Celebraciones, que usa su propio EstadoChip). */
export function Chip({ tono, children }: { tono: ChipTono; children: ReactNode }) {
  return <span className={`chip ${CLASE[tono]}`}>{children}</span>;
}
