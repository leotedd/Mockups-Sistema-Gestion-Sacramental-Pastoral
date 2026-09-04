import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Celebracion, EstadoCelebracion, VistaCalendarioCelebraciones } from "../../data/types";
import { MiniCalendar } from "../ui/MiniCalendar";
import {
  construirGrillaMes,
  distribuirCarriles,
  esMismoDia,
  esMismoMes,
  formatoHora,
  inicioDeSemana,
  sumarDias,
} from "../../utils/calendario";

const NOMBRE_DIA = new Intl.DateTimeFormat("es-GT", { weekday: "long" });
const NOMBRE_MES = new Intl.DateTimeFormat("es-GT", { month: "long" });
const ETIQUETAS_DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const HORAS = Array.from({ length: 24 }, (_, i) => i);
const ALTO_HORA = 56;

/** Colores por estado alineados a ESTILO_ESTADO (chip--programada/confirmada/realizada/cancelada). */
const ESTILO_ESTADO_CAL: Record<EstadoCelebracion, { bg: string; border: string; text: string }> = {
  Programada: { bg: "#e5eef5", border: "#1f5f8b", text: "#1f5f8b" },
  Confirmada: { bg: "var(--dorado-suave)", border: "var(--dorado-borde)", text: "#7a4708" },
  Realizada: { bg: "#e7efe7", border: "#8fa88f", text: "#2f5233" },
  Cancelada: { bg: "var(--peligro-bg)", border: "#e3bcbc", text: "var(--peligro-700)" },
};

function capitalizar(t: string): string {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function aEvento(c: Celebracion) {
  const inicio = `${c.fecha}T${c.horaDesde}:00`;
  const fin = c.horaHasta && c.horaHasta > c.horaDesde ? `${c.fecha}T${c.horaHasta}:00` : `${c.fecha}T${c.horaDesde}:00`;
  return { id: c.id, inicio, fin, celebracion: c };
}

function tituloRango(vista: VistaCalendarioCelebraciones, fecha: Date): string {
  if (vista === "dia") return capitalizar(NOMBRE_DIA.format(fecha)) + " " + fecha.getDate();
  if (vista === "mes") return `${capitalizar(NOMBRE_MES.format(fecha))} ${fecha.getFullYear()}`;
  const inicio = vista === "laboral" ? sumarDias(inicioDeSemana(fecha), 1) : inicioDeSemana(fecha);
  const fin = sumarDias(inicio, vista === "laboral" ? 4 : 6);
  return `${inicio.getDate()} – ${fin.getDate()} de ${NOMBRE_MES.format(fin)} de ${fin.getFullYear()}`;
}

function minutosDelDia(fecha: Date): number {
  return fecha.getHours() * 60 + fecha.getMinutes();
}

interface Props {
  celebraciones: Celebracion[];
  fechaActual: Date;
  vista: VistaCalendarioCelebraciones;
  seleccionada: string | null;
  onSeleccionar: (id: string | null) => void;
  onAbrir: (id: string) => void;
  onCambiarFecha: (fecha: Date) => void;
}

/**
 * Reproduce fielmente components/celebraciones/CelebracionesCalendario.tsx
 * del desarrollo real: MiniCalendar + leyenda de ESTADOS a la izquierda,
 * y a la derecha vista Mes (celdas con badges) o Semana/Laboral/Día (rejilla
 * de horas con eventos en carriles, para no encimar celebraciones que se
 * superponen). Antes el mockup usaba una tabla simple de horas x días.
 */
export function CelebracionesCalendario({ celebraciones, fechaActual, vista, seleccionada, onSeleccionar, onAbrir, onCambiarFecha }: Props) {
  const eventos = useMemo(() => celebraciones.map(aEvento), [celebraciones]);
  const porId = useMemo(() => new Map(celebraciones.map((c) => [c.id, c])), [celebraciones]);

  const inicioSemana = inicioDeSemana(fechaActual);
  const dias =
    vista === "dia"
      ? [fechaActual]
      : vista === "laboral"
        ? Array.from({ length: 5 }, (_, i) => sumarDias(inicioSemana, i + 1))
        : Array.from({ length: 7 }, (_, i) => sumarDias(inicioSemana, i));

  const paso = vista === "dia" ? 1 : 7;
  const irAnterior = () => onCambiarFecha(sumarDias(fechaActual, -paso));
  const irSiguiente = () => onCambiarFecha(sumarDias(fechaActual, paso));
  const irMes = (delta: number) => onCambiarFecha(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + delta, 1));

  const rangoResaltado = (dia: Date): boolean => {
    if (vista === "dia") return esMismoDia(dia, fechaActual);
    if (vista === "mes") return esMismoMes(dia, fechaActual);
    const finSemana = sumarDias(inicioSemana, vista === "laboral" ? 4 : 6);
    return dia.getTime() >= inicioSemana.getTime() && dia.getTime() <= finSemana.getTime();
  };

  return (
    <div className="cel-cal">
      <aside className="cel-cal__sidebar">
        <MiniCalendar fechaActual={fechaActual} estaResaltado={rangoResaltado} onSeleccionarDia={onCambiarFecha} />
        <div className="cel-cal__estados">
          <div className="cel-cal__estados-title">ESTADOS</div>
          {(Object.keys(ESTILO_ESTADO_CAL) as EstadoCelebracion[]).map((estado) => (
            <div className="cel-cal__estado-item" key={estado}>
              <span className="cel-cal__estado-dot" style={{ background: ESTILO_ESTADO_CAL[estado].border }} />
              <span style={{ textDecoration: estado === "Cancelada" ? "line-through" : undefined }}>{estado}</span>
            </div>
          ))}
        </div>
      </aside>

      <div className="cel-cal__main">
        <div className="cel-cal__toolbar">
          <div className="cel-cal__toolbar-nav">
            <button type="button" aria-label="Rango anterior" onClick={vista === "mes" ? () => irMes(-1) : irAnterior}><ChevronLeft size={16} /></button>
            <button type="button" aria-label="Rango siguiente" onClick={vista === "mes" ? () => irMes(1) : irSiguiente}><ChevronRight size={16} /></button>
            <span className="cel-cal__periodo">{tituloRango(vista, fechaActual)}</span>
          </div>
          <span className="tag-count">{celebraciones.length} celebraciones</span>
        </div>

        {vista === "mes" ? (
          <VistaMes fechaActual={fechaActual} porId={porId} seleccionada={seleccionada} onSeleccionar={onSeleccionar} onAbrir={onAbrir} onCambiarFecha={onCambiarFecha} />
        ) : (
          <RejillaHoras dias={dias} eventos={eventos} porId={porId} seleccionada={seleccionada} onSeleccionar={onSeleccionar} onAbrir={onAbrir} />
        )}
      </div>
    </div>
  );
}

function RejillaHoras({ dias, eventos, porId, seleccionada, onSeleccionar, onAbrir }: {
  dias: Date[];
  eventos: Array<{ id: string; inicio: string; fin: string }>;
  porId: Map<string, Celebracion>;
  seleccionada: string | null;
  onSeleccionar: (id: string | null) => void;
  onAbrir: (id: string) => void;
}) {
  const alturaTotal = HORAS.length * ALTO_HORA;

  return (
    <div className="cel-cal__grid">
      <div className="cel-cal__hours">
        <div className="cel-cal__day-head-spacer" />
        {HORAS.map((h) => (
          <div key={h} className="cel-cal__hour-label" style={{ height: ALTO_HORA }}>
            <span>{String(h).padStart(2, "0")}:00</span>
          </div>
        ))}
      </div>

      {dias.map((dia) => {
        const esHoy = esMismoDia(dia, new Date());
        const idsDia = new Set(eventos.filter((e) => esMismoDia(new Date(e.inicio), dia)).map((e) => e.id));
        const conCarril = distribuirCarriles(eventos.filter((e) => idsDia.has(e.id)));

        return (
          <div key={dia.toISOString()} className="cel-cal__day-col">
            <div className={`cel-cal__day-head ${esHoy ? "cel-cal__day-head--hoy" : ""}`}>
              <span style={{ textTransform: "capitalize" }}>{NOMBRE_DIA.format(dia)}</span>
              <span>{dia.getDate()}</span>
            </div>
            <div className="cel-cal__day-body" style={{ height: alturaTotal }}>
              {HORAS.map((h) => (
                <div key={h} className="cel-cal__slot" style={{ position: "absolute", left: 0, right: 0, top: h * ALTO_HORA, height: ALTO_HORA }} onClick={() => onSeleccionar(null)} />
              ))}

              {conCarril.map(({ evento, carril, carriles }) => {
                const celebracion = porId.get(evento.id);
                if (!celebracion) return null;
                const inicio = new Date(evento.inicio);
                const fin = new Date(evento.fin);
                const top = Math.max(0, minutosDelDia(inicio) * (ALTO_HORA / 60));
                const alto = Math.max(18, Math.min(alturaTotal - top, (minutosDelDia(fin) - minutosDelDia(inicio)) * (ALTO_HORA / 60)));
                const estilo = ESTILO_ESTADO_CAL[celebracion.estado];
                const activa = evento.id === seleccionada;

                return (
                  <div
                    key={evento.id}
                    role="button"
                    tabIndex={0}
                    className={`cel-cal__event ${activa ? "cel-cal__event--seleccionado" : ""} ${celebracion.estado === "Cancelada" ? "cel-cal__event--cancelada" : ""}`}
                    style={{ top, height: alto, left: `${(carril / carriles) * 100}%`, width: `${100 / carriles}%`, background: estilo.bg, borderLeftColor: estilo.border, color: estilo.text }}
                    onClick={(e) => { e.stopPropagation(); onSeleccionar(evento.id); }}
                    onDoubleClick={(e) => { e.stopPropagation(); onAbrir(evento.id); }}
                  >
                    <p style={{ fontWeight: 700 }}>{celebracion.tipo}</p>
                    <p>{celebracion.lugar}</p>
                    <p>{formatoHora(inicio)} – {formatoHora(fin)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VistaMes({ fechaActual, porId, seleccionada, onSeleccionar, onAbrir, onCambiarFecha }: {
  fechaActual: Date;
  porId: Map<string, Celebracion>;
  seleccionada: string | null;
  onSeleccionar: (id: string | null) => void;
  onAbrir: (id: string) => void;
  onCambiarFecha: (d: Date) => void;
}) {
  const hoy = new Date();
  const dias = construirGrillaMes(fechaActual);
  const porFecha = useMemo(() => {
    const m = new Map<string, Celebracion[]>();
    for (const c of porId.values()) {
      const arr = m.get(c.fecha) ?? [];
      arr.push(c);
      m.set(c.fecha, arr);
    }
    for (const arr of m.values()) arr.sort((a, b) => a.horaDesde.localeCompare(b.horaDesde));
    return m;
  }, [porId]);

  return (
    <div className="cel-cal__month">
      <div className="cel-cal__month-dow">{ETIQUETAS_DIAS.map((e) => <span key={e}>{e}</span>)}</div>
      <div className="cel-cal__month-grid">
        {dias.map((dia) => {
          const iso = dia.toISOString().slice(0, 10);
          const fueraDeMes = !esMismoMes(dia, fechaActual);
          const esHoy = esMismoDia(dia, hoy);
          const eventos = porFecha.get(iso) ?? [];

          return (
            <div key={iso} className={`cel-cal__month-cell ${fueraDeMes ? "cel-cal__month-cell--fuera" : ""}`} onClick={() => onSeleccionar(null)}>
              <span className={`cel-cal__month-num ${esHoy ? "cel-cal__month-num--hoy" : ""}`} onClick={(e) => { e.stopPropagation(); onCambiarFecha(dia); }}>
                {dia.getDate()}
              </span>
              {eventos.slice(0, 3).map((c) => {
                const estilo = ESTILO_ESTADO_CAL[c.estado];
                return (
                  <span
                    key={c.id}
                    className="cel-cal__month-event"
                    style={{ background: estilo.bg, borderLeftColor: estilo.border, color: estilo.text, outline: c.id === seleccionada ? "1px solid var(--borgona)" : undefined }}
                    onClick={(e) => { e.stopPropagation(); onSeleccionar(c.id); }}
                    onDoubleClick={(e) => { e.stopPropagation(); onAbrir(c.id); }}
                  >
                    {c.horaDesde} {c.tipo}
                  </span>
                );
              })}
              {eventos.length > 3 && (
                <span className="cel-cal__month-more" onClick={(e) => { e.stopPropagation(); onSeleccionar(eventos[3].id); }}>+ {eventos.length - 3} más</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
