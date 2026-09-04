import { Filter, Search, X } from "lucide-react";
import { TIPOS_CELEBRACION, LUGARES, ESTADOS } from "../../data/catalogos";
import type { CelebracionFiltro } from "../../data/types";

interface Props {
  filtros: CelebracionFiltro;
  resultados: number;
  total: number;
  onCambiar: (f: CelebracionFiltro) => void;
  onLimpiar: () => void;
}

const VACIO: CelebracionFiltro = { texto: "", desde: "", hasta: "", tipo: "", lugar: "", estado: "" };

/**
 * Filtrado en vivo (sin boton "Buscar"): reproduce
 * components/celebraciones/CelebracionesFiltros.tsx del desarrollo real,
 * que aplica cada cambio de inmediato via onCambiar.
 */
export function CelebracionesFiltros({ filtros, resultados, total, onCambiar, onLimpiar }: Props) {
  const set = <K extends keyof CelebracionFiltro>(campo: K, valor: CelebracionFiltro[K]) =>
    onCambiar({ ...filtros, [campo]: valor });

  const hayFiltros = JSON.stringify(filtros) !== JSON.stringify(VACIO);

  return (
    <div className="filters">
      <div className="filters__grid">
        <div className="field">
          <label className="field__label">Buscar</label>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 8, top: 8, color: "var(--texto-3)" }} />
            <input
              className="input"
              style={{ paddingLeft: 26 }}
              placeholder="Tipo, lugar, celebrante o intención"
              value={filtros.texto}
              onChange={(e) => set("texto", e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label className="field__label">Fecha desde</label>
          <input className="input" type="date" value={filtros.desde} max={filtros.hasta || undefined} onChange={(e) => set("desde", e.target.value)} />
        </div>
        <div className="field">
          <label className="field__label">Fecha hasta</label>
          <input className="input" type="date" value={filtros.hasta} min={filtros.desde || undefined} onChange={(e) => set("hasta", e.target.value)} />
        </div>
        <div className="field">
          <label className="field__label">Tipo de celebración</label>
          <select className="select" value={filtros.tipo} onChange={(e) => set("tipo", e.target.value)}>
            <option value="">Todos</option>
            {TIPOS_CELEBRACION.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field__label">Lugar</label>
          <select className="select" value={filtros.lugar} onChange={(e) => set("lugar", e.target.value)}>
            <option value="">Todos</option>
            {LUGARES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field__label">Estado</label>
          <select className="select" value={filtros.estado} onChange={(e) => set("estado", e.target.value)}>
            <option value="">Todos</option>
            {ESTADOS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="filters__actions">
        <button className="btn" onClick={onLimpiar} disabled={!hayFiltros}>
          <X size={14} /> Limpiar
        </button>
        <span className="small muted" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginLeft: 4 }}>
          <Filter size={12} /> Mostrando <strong style={{ color: "var(--texto)" }}>{resultados}</strong> de {total} celebraciones
          {hayFiltros ? " (filtros aplicados)" : ""}
        </span>
      </div>
    </div>
  );
}
