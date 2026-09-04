import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useApp, FECHA_SIMULADA } from "../context/AppContext";
import { Button } from "../components/ui/Button";
import type { Celebracion } from "../data/types";
import { DIAS, nombreMesAnio, parseISO, toISO, formatFecha, capitalizar } from "../utils/format";

type Vista = "dia" | "laboral" | "semana" | "mes";

const DOW_CORTO = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const HORAS = Array.from({ length: 16 }, (_, i) => i + 5); // 05:00 - 20:00

function inicioSemana(d: Date): Date {
  const r = new Date(d);
  r.setDate(r.getDate() - r.getDay());
  return r;
}

/* Días efectivamente mostrados por cada vista. El encabezado del período
   se calcula a partir de este mismo arreglo para evitar desfases entre
   el rango mostrado y las columnas (p. ej. vista Laboral). */
function diasDeVista(vista: Vista, cursor: Date): Date[] {
  if (vista === "dia") return [new Date(cursor)];
  const ini = inicioSemana(cursor);
  const cantidad = vista === "laboral" ? 5 : 7;
  const desplazamiento = vista === "laboral" ? 1 : 0; // Laboral: lunes a viernes
  const out: Date[] = [];
  for (let i = 0; i < cantidad; i++) {
    const d = new Date(ini);
    d.setDate(d.getDate() + i + desplazamiento);
    out.push(d);
  }
  return out;
}

function etiquetaEvento(e: Celebracion): string {
  const base = `${e.horaDesde} ${e.tipo}`;
  return e.estado === "Cancelada" ? `✕ ${base} · CANCELADA` : base;
}

function tituloEvento(e: Celebracion): string {
  return `${e.horaDesde}${e.horaHasta ? "–" + e.horaHasta : ""} · ${e.tipo} · ${e.lugar} · Estado: ${e.estado}`;
}

export function CalendarioPage() {
  const navigate = useNavigate();
  const { celebraciones, setStatus } = useApp();
  const hoy = parseISO(FECHA_SIMULADA);

  const [vista, setVista] = useState<Vista>("mes");
  const [cursor, setCursor] = useState<Date>(hoy);

  const porFecha = useMemo(() => {
    const m = new Map<string, Celebracion[]>();
    for (const c of celebraciones) {
      const arr = m.get(c.fecha) ?? [];
      arr.push(c);
      m.set(c.fecha, arr);
    }
    for (const arr of m.values()) arr.sort((a, b) => a.horaDesde.localeCompare(b.horaDesde));
    return m;
  }, [celebraciones]);

  useEffect(() => {
    setStatus(celebraciones.length, "celebraciones en calendario");
  }, [celebraciones.length, setStatus]);

  const navegar = (dir: number) => {
    const d = new Date(cursor);
    if (vista === "mes") d.setMonth(d.getMonth() + dir);
    else if (vista === "semana" || vista === "laboral") d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCursor(d);
  };

  // "Hoy": vuelve al día actual; cada vista deriva su rango del cursor,
  // por lo que Día/Laboral/Semana/Mes muestran el período que contiene hoy.
  const irHoy = () => setCursor(new Date(hoy));

  const periodo = (): string => {
    if (vista === "mes") return nombreMesAnio(cursor);
    const dias = diasDeVista(vista, cursor);
    if (vista === "dia") {
      return capitalizar(`${DIAS[dias[0].getDay()]} ${formatFecha(toISO(dias[0]))}`);
    }
    return `${formatFecha(toISO(dias[0]))} — ${formatFecha(toISO(dias[dias.length - 1]))}`;
  };

  return (
    <div className="page" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 200px)" }}>
      <div className="page__head">
        <div>
          <h1 className="page__title">
            <CalendarDays size={17} /> Calendario de celebraciones
          </h1>
          <div className="page__subtitle">Programación parroquial · haga clic en una celebración para ver el detalle</div>
        </div>
        <div className="ribbon-group__actions" style={{ gap: 2 }}>
          {(["dia", "laboral", "semana", "mes"] as Vista[]).map((v) => (
            <button
              key={v}
              className={`rbtn rbtn--sm ${vista === v ? "rbtn--active" : ""}`}
              onClick={() => setVista(v)}
            >
              {v === "dia" ? "Día" : v === "laboral" ? "Laboral" : v === "semana" ? "Semana" : "Mes"}
            </button>
          ))}
          <button className="rbtn rbtn--sm" onClick={irHoy}>
            Hoy
          </button>
        </div>
      </div>

      <div className="page__body" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="cal__toolbar">
          <div className="cal__nav">
            <Button sm icon={<ChevronLeft size={14} />} onClick={() => navegar(-1)}>
              Anterior
            </Button>
            <Button sm onClick={() => navegar(1)}>
              Siguiente <ChevronRight size={14} />
            </Button>
          </div>
          <div className="cal__period">{periodo()}</div>
          <div className="cal__legend">
            <span className="cal__legend-item">
              <i className="cal__legend-dot" /> Programada / Confirmada / Realizada
            </span>
            <span className="cal__legend-item">
              <i className="cal__legend-dot cal__legend-dot--cancelada" /> Cancelada (tachada)
            </span>
          </div>
        </div>

        {vista === "mes" ? (
          <VistaMes cursor={cursor} hoy={hoy} porFecha={porFecha} onEvento={(id) => navigate(`/celebracion/${id}`)} />
        ) : (
          <VistaTiempo
            vista={vista}
            cursor={cursor}
            hoy={hoy}
            porFecha={porFecha}
            onEvento={(id) => navigate(`/celebracion/${id}`)}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- MES ---------- */
function VistaMes({
  cursor,
  hoy,
  porFecha,
  onEvento,
}: {
  cursor: Date;
  hoy: Date;
  porFecha: Map<string, Celebracion[]>;
  onEvento: (id: string) => void;
}) {
  const primerDia = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const inicio = inicioSemana(primerDia);
  const celdas: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(inicio);
    d.setDate(d.getDate() + i);
    celdas.push(d);
  }
  const isoHoy = toISO(hoy);

  return (
    <div className="cal-month">
      <div className="cal-month__dow">
        {DOW_CORTO.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="cal-month__grid">
        {celdas.map((d, i) => {
          const iso = toISO(d);
          const fuera = d.getMonth() !== cursor.getMonth();
          const eventos = porFecha.get(iso) ?? [];
          return (
            <div
              key={i}
              className={`cal-cell ${fuera ? "cal-cell--out" : ""} ${iso === isoHoy ? "cal-cell--today" : ""}`}
            >
              <span className="cal-cell__num">{d.getDate()}</span>
              {eventos.slice(0, 3).map((e) => (
                <span
                  key={e.id}
                  className={`cal-event ${e.estado === "Cancelada" ? "cal-event--cancelada" : ""}`}
                  title={tituloEvento(e)}
                  onClick={() => onEvento(e.id)}
                >
                  {etiquetaEvento(e)}
                </span>
              ))}
              {eventos.length > 3 && (
                <span className="cal-event__more" onClick={() => onEvento(eventos[3].id)}>
                  + {eventos.length - 3} más
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- DIA / LABORAL / SEMANA ---------- */
function VistaTiempo({
  vista,
  cursor,
  hoy,
  porFecha,
  onEvento,
}: {
  vista: Vista;
  cursor: Date;
  hoy: Date;
  porFecha: Map<string, Celebracion[]>;
  onEvento: (id: string) => void;
}) {
  const dias = diasDeVista(vista, cursor);
  const isoHoy = toISO(hoy);
  const cols = `56px repeat(${dias.length}, 1fr)`;

  return (
    <div className="cal-week">
      <div className="cal-week__head" style={{ gridTemplateColumns: cols }}>
        <span>Hora</span>
        {dias.map((d) => (
          <span key={toISO(d)} style={{ background: toISO(d) === isoHoy ? "var(--borgona-600)" : undefined }}>
            {DOW_CORTO[d.getDay()]} {formatFecha(toISO(d)).slice(0, 5)}
          </span>
        ))}
      </div>
      <div className="cal-week__body">
        {HORAS.map((h) => (
          <div key={h} style={{ display: "grid", gridTemplateColumns: cols }}>
            <div className="cal-week__hour">{String(h).padStart(2, "0")}:00</div>
            {dias.map((d) => {
              const eventos = (porFecha.get(toISO(d)) ?? []).filter(
                (e) => Number(e.horaDesde.split(":")[0]) === h
              );
              return (
                <div key={toISO(d) + h} className="cal-week__slot">
                  {eventos.map((e) => (
                    <span
                      key={e.id}
                      className={`cal-event ${e.estado === "Cancelada" ? "cal-event--cancelada" : ""}`}
                      title={tituloEvento(e)}
                      onClick={() => onEvento(e.id)}
                    >
                      {etiquetaEvento(e)}
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
