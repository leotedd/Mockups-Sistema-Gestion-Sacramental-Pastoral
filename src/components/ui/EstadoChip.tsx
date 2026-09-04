import type { EstadoCelebracion } from "../../data/types";

const CLASE: Record<EstadoCelebracion, string> = {
  Programada: "chip--programada",
  Confirmada: "chip--confirmada",
  Realizada: "chip--realizada",
  Cancelada: "chip--cancelada",
};

export function EstadoChip({ estado }: { estado: EstadoCelebracion }) {
  return <span className={`chip ${CLASE[estado]}`}>{estado}</span>;
}
