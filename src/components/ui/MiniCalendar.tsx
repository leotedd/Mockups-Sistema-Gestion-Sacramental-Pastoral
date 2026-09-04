import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { construirGrillaMes, esMismoDia, esMismoMes, inicioDeMes, sumarMeses } from "../../utils/calendario";

const ETIQUETAS_DIAS = ["L", "M", "M", "J", "V", "S", "D"];
const NOMBRE_MES = new Intl.DateTimeFormat("es-GT", { month: "long" });

interface Props {
  fechaActual: Date;
  /** Días a resaltar como "rango activo" (semana/laboral/mes visible). */
  estaResaltado?: (dia: Date) => boolean;
  onSeleccionarDia: (fecha: Date) => void;
}

/** Reproduce components/MiniCalendar.tsx del desarrollo real (usado en el panel del sidebar de Agenda y en Celebraciones → Calendario). */
export function MiniCalendar({ fechaActual, estaResaltado, onSeleccionarDia }: Props) {
  const [mesVisible, setMesVisible] = useState(() => inicioDeMes(fechaActual));
  const hoy = new Date();
  const dias = construirGrillaMes(mesVisible);

  return (
    <div className="mini-cal">
      <div className="mini-cal__head">
        <span className="mini-cal__label">{NOMBRE_MES.format(mesVisible)} {mesVisible.getFullYear()}</span>
        <div className="mini-cal__nav">
          <button type="button" aria-label="Mes anterior" onClick={() => setMesVisible((m) => sumarMeses(m, -1))}><ChevronLeft size={14} /></button>
          <button type="button" aria-label="Mes siguiente" onClick={() => setMesVisible((m) => sumarMeses(m, 1))}><ChevronRight size={14} /></button>
        </div>
      </div>
      <div className="mini-cal__grid">
        {ETIQUETAS_DIAS.map((e, i) => <span key={i} className="mini-cal__dow">{e}</span>)}
        {dias.map((dia) => {
          const fueraDeMes = !esMismoMes(dia, mesVisible);
          const esHoy = esMismoDia(dia, hoy);
          const resaltado = estaResaltado?.(dia) ?? false;
          return (
            <button
              key={dia.toISOString()}
              type="button"
              onClick={() => onSeleccionarDia(dia)}
              className={`mini-cal__day ${resaltado ? "mini-cal__day--activo" : ""} ${fueraDeMes ? "mini-cal__day--fuera" : ""}`}
            >
              {dia.getDate()}
              {esHoy && <span className="mini-cal__hoy-dot" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
