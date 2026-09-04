import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eraser, Eye, Pencil, Sparkles, FilePlus2, Info } from "lucide-react";
import { useApp } from "../context/AppContext";
import { escuchar } from "../utils/bus";
import { TIPOS_CELEBRACION, LUGARES } from "../data/catalogos";
import type { CelebracionFiltro } from "../data/types";
import { formatFecha, parseISO } from "../utils/format";
import { EstadoChip } from "../components/ui/EstadoChip";
import { Button } from "../components/ui/Button";
import { Pagination } from "../components/ui/Pagination";
import {
  EmptyState,
  ErrorState,
  NoResultsState,
  LoadingState,
  TableSkeleton,
} from "../components/ui/States";

const POR_PAGINA = 8;

const FILTRO_VACIO: CelebracionFiltro = {
  texto: "",
  desde: "",
  hasta: "",
  tipo: "",
  lugar: "",
};

type Estado = "cargando" | "ok" | "error";

export function CelebracionesListPage() {
  const navigate = useNavigate();
  const { celebraciones, selectedId, setSelectedId, setStatus, notificar } = useApp();

  const [estado, setEstado] = useState<Estado>("cargando");
  const [borrador, setBorrador] = useState<CelebracionFiltro>(FILTRO_VACIO);
  const [aplicado, setAplicado] = useState<CelebracionFiltro>(FILTRO_VACIO);
  const [pagina, setPagina] = useState(1);

  const cargar = () => {
    setEstado("cargando");
    window.setTimeout(() => setEstado("ok"), 650);
  };

  useEffect(() => {
    cargar();
    return escuchar("ribbon:actualizar", () => {
      setEstado("cargando");
      window.setTimeout(() => {
        setEstado("ok");
        notificar("success", "Actualización exitosa", "El listado se actualizó desde el servidor parroquial.");
      }, 700);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtradas = useMemo(() => {
    const q = aplicado.texto.trim().toLowerCase();
    return celebraciones
      .filter((c) => {
        if (q) {
          const blob = `${c.tipo} ${c.lugar} ${c.observaciones ?? ""} ${c.celebrantes
            .map((x) => x.nombre)
            .join(" ")} ${c.intenciones.map((x) => x.descripcion).join(" ")}`.toLowerCase();
          if (!blob.includes(q)) return false;
        }
        if (aplicado.tipo && c.tipo !== aplicado.tipo) return false;
        if (aplicado.lugar && c.lugar !== aplicado.lugar) return false;
        if (aplicado.desde && c.fecha < aplicado.desde) return false;
        if (aplicado.hasta && c.fecha > aplicado.hasta) return false;
        return true;
      })
      .sort((a, b) => {
        const f = parseISO(a.fecha).getTime() - parseISO(b.fecha).getTime();
        return f !== 0 ? f : a.horaDesde.localeCompare(b.horaDesde);
      });
  }, [celebraciones, aplicado]);

  const hayFiltros =
    !!aplicado.texto || !!aplicado.tipo || !!aplicado.lugar || !!aplicado.desde || !!aplicado.hasta;

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = filtradas.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  useEffect(() => {
    setStatus(filtradas.length, "celebraciones");
  }, [filtradas.length, setStatus]);

  const buscar = () => {
    setAplicado(borrador);
    setPagina(1);
  };

  const limpiar = () => {
    setBorrador(FILTRO_VACIO);
    setAplicado(FILTRO_VACIO);
    setPagina(1);
  };

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">
            <Sparkles size={17} /> Listado de celebraciones
          </h1>
          <div className="page__subtitle">
            Programación general de celebraciones de la Parroquia Santa Cruz
          </div>
        </div>
        <div className="btn-row">
          <Button onClick={() => navigate("/estados")} icon={<Info size={14} />} variante="ghost" sm>
            Galería de estados
          </Button>
          <Button variante="primary" icon={<FilePlus2 size={15} />} onClick={() => navigate("/nueva")}>
            Nueva celebración
          </Button>
        </div>
      </div>

      <div className="page__body">
        {/* FILTROS */}
        <div className="filters">
          <div className="filters__grid">
            <div className="field">
              <label className="field__label">Buscar celebración</label>
              <input
                className="input"
                placeholder="Tipo, lugar, celebrante, intención..."
                value={borrador.texto}
                onChange={(e) => setBorrador({ ...borrador, texto: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && buscar()}
              />
            </div>
            <div className="field">
              <label className="field__label">Desde</label>
              <input
                className="input"
                type="date"
                value={borrador.desde}
                onChange={(e) => setBorrador({ ...borrador, desde: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label">Hasta</label>
              <input
                className="input"
                type="date"
                value={borrador.hasta}
                onChange={(e) => setBorrador({ ...borrador, hasta: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label">Tipo de celebración</label>
              <select
                className="select"
                value={borrador.tipo}
                onChange={(e) => setBorrador({ ...borrador, tipo: e.target.value })}
              >
                <option value="">Todos</option>
                {TIPOS_CELEBRACION.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label">Lugar</label>
              <select
                className="select"
                value={borrador.lugar}
                onChange={(e) => setBorrador({ ...borrador, lugar: e.target.value })}
              >
                <option value="">Todos</option>
                {LUGARES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="filters__actions">
            <Button variante="primary" icon={<Search size={14} />} onClick={buscar}>
              Buscar
            </Button>
            <Button icon={<Eraser size={14} />} onClick={limpiar}>
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* TABLA / ESTADOS */}
        {estado === "cargando" && (
          <>
            <LoadingState />
            <TableSkeleton />
          </>
        )}

        {estado === "error" && <ErrorState onReintentar={cargar} />}

        {estado === "ok" && celebraciones.length === 0 && (
          <EmptyState
            accion={
              <Button variante="primary" sm onClick={() => navigate("/nueva")}>
                Registrar la primera celebración
              </Button>
            }
          />
        )}

        {estado === "ok" && celebraciones.length > 0 && filtradas.length === 0 && (
          <NoResultsState onLimpiar={limpiar} />
        )}

        {estado === "ok" && visibles.length > 0 && (
          <>
            <div className="table-wrap">
              <table className="grid">
                <thead>
                  <tr>
                    <th style={{ width: 96 }}>Fecha</th>
                    <th style={{ width: 66 }}>Hora</th>
                    <th>Tipo de celebración</th>
                    <th>Lugar</th>
                    <th>Celebrante</th>
                    <th style={{ width: 108 }}>Estado</th>
                    <th className="grid__col-actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((c) => {
                    const principal =
                      c.celebrantes.find((x) => x.principal) ?? c.celebrantes[0];
                    return (
                      <tr
                        key={c.id}
                        className={selectedId === c.id ? "is-selected" : ""}
                        onClick={() => setSelectedId(c.id)}
                        onDoubleClick={() => navigate(`/celebracion/${c.id}`)}
                      >
                        <td className="nowrap">{formatFecha(c.fecha)}</td>
                        <td className="nowrap">{c.horaDesde}</td>
                        <td>{c.tipo}</td>
                        <td>{c.lugar}</td>
                        <td>
                          {principal ? principal.nombre : <span className="muted">Sin asignar</span>}
                          {c.celebrantes.length > 1 && (
                            <span className="muted small"> +{c.celebrantes.length - 1}</span>
                          )}
                        </td>
                        <td>
                          <EstadoChip estado={c.estado} />
                        </td>
                        <td className="grid__col-actions">
                          <button
                            className="link-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/celebracion/${c.id}`);
                            }}
                          >
                            <Eye size={13} /> Ver
                          </button>
                          <button
                            className="link-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/celebracion/${c.id}/editar`);
                            }}
                          >
                            <Pencil size={13} /> Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              pagina={paginaActual}
              totalPaginas={totalPaginas}
              totalRegistros={filtradas.length}
              porPagina={POR_PAGINA}
              onCambio={setPagina}
            />

            {hayFiltros && (
              <p className="small muted" style={{ marginTop: 4 }}>
                Filtros activos. Se muestran {filtradas.length} de {celebraciones.length} celebraciones.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
