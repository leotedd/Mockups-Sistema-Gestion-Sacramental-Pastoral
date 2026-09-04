import { useMemo } from "react";
import type { Cita, VistaAgenda } from "../../data/agenda";
import { COLOR_PRIORIDAD } from "../../data/agenda";
import { DIAS, formatFecha, toISO } from "../../utils/format";

const DOW_CORTO = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const HORAS = Array.from({ length: 16 }, (_, i) => i + 5);

function inicioSemana(d: Date): Date {
  const r = new Date(d);
  r.setDate(r.getDate() - r.getDay());
  return r;
}
function diasDeVista(vista: VistaAgenda, cursor: Date): Date[] {
  if (vista === "dia") return [new Date(cursor)];
  const ini = inicioSemana(cursor);
  const cantidad = vista === "laboral" ? 5 : 7;
  const desplazamiento = vista === "laboral" ? 1 : 0;
  return Array.from({ length: cantidad }, (_, i) => { const d = new Date(ini); d.setDate(d.getDate() + i + desplazamiento); return d; });
}
function fechaDe(iso: string) { return iso.split("T")[0]; }
function horaDe(iso: string) { return iso.split("T")[1]?.slice(0, 5) ?? "00:00"; }

interface Props {
  citas: Cita[];
  vista: VistaAgenda;
  cursor: Date;
  citaSeleccionadaId: string | null;
  onSeleccionar: (id: string) => void;
  onEditar: (id: string) => void;
}

/** Reproduce la familia de vistas Día/Laboral/Semana/Mes de components/{DayView,TimeGrid,MonthView}.tsx del desarrollo real, adaptada a Citas. */
export function AgendaVista({ citas, vista, cursor, citaSeleccionadaId, onSeleccionar, onEditar }: Props) {
  const porFecha = useMemo(() => {
    const m = new Map<string, Cita[]>();
    for (const c of citas) {
      const f = fechaDe(c.inicio);
      const arr = m.get(f) ?? [];
      arr.push(c);
      m.set(f, arr);
    }
    for (const arr of m.values()) arr.sort((a, b) => a.inicio.localeCompare(b.inicio));
    return m;
  }, [citas]);

  if (vista === "mes") {
    const primerDia = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const inicio = inicioSemana(primerDia);
    const celdas = Array.from({ length: 42 }, (_, i) => { const d = new Date(inicio); d.setDate(d.getDate() + i); return d; });
    return (
      <div className="cal-month">
        <div className="cal-month__dow">{DOW_CORTO.map((d) => <span key={d}>{d}</span>)}</div>
        <div className="cal-month__grid">
          {celdas.map((d, i) => {
            const iso = toISO(d);
            const fuera = d.getMonth() !== cursor.getMonth();
            const eventos = porFecha.get(iso) ?? [];
            return (
              <div key={i} className={`cal-cell ${fuera ? "cal-cell--out" : ""}`}>
                <span className="cal-cell__num">{d.getDate()}</span>
                {eventos.slice(0, 3).map((e) => (
                  <span
                    key={e.id}
                    className={`cal-event ${e.cancelada ? "cal-event--cancelada" : ""}`}
                    style={{ borderLeftColor: COLOR_PRIORIDAD[e.prioridad], background: e.id === citaSeleccionadaId ? "var(--borgona-600)" : undefined }}
                    title={`${horaDe(e.inicio)} · ${e.asunto} · ${e.lugar}`}
                    onClick={() => { onSeleccionar(e.id); onEditar(e.id); }}
                  >
                    {horaDe(e.inicio)} {e.asunto}
                  </span>
                ))}
                {eventos.length > 3 && <span className="cal-event__more">+ {eventos.length - 3} más</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const dias = diasDeVista(vista, cursor);
  const cols = `56px repeat(${dias.length}, 1fr)`;
  return (
    <div className="cal-week">
      <div className="cal-week__head" style={{ gridTemplateColumns: cols }}>
        <span>Hora</span>
        {dias.map((d) => <span key={toISO(d)}>{DOW_CORTO[d.getDay()]} {formatFecha(toISO(d)).slice(0, 5)}</span>)}
      </div>
      <div className="cal-week__body">
        {HORAS.map((h) => (
          <div key={h} style={{ display: "grid", gridTemplateColumns: cols }}>
            <div className="cal-week__hour">{String(h).padStart(2, "0")}:00</div>
            {dias.map((d) => {
              const eventos = (porFecha.get(toISO(d)) ?? []).filter((e) => Number(horaDe(e.inicio).split(":")[0]) === h);
              return (
                <div key={toISO(d) + h} className="cal-week__slot">
                  {eventos.map((e) => (
                    <span
                      key={e.id}
                      className={`cal-event ${e.cancelada ? "cal-event--cancelada" : ""}`}
                      style={{ borderLeftColor: COLOR_PRIORIDAD[e.prioridad] }}
                      title={`${horaDe(e.inicio)}–${horaDe(e.fin)} · ${e.asunto} · ${e.lugar} · Prioridad: ${e.prioridad}`}
                      onClick={() => { onSeleccionar(e.id); onEditar(e.id); }}
                    >
                      {horaDe(e.inicio)} {e.asunto}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export { DIAS };
