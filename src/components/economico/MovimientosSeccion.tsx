import { useMemo, useRef, useState } from "react";
import { FilePlus2, FolderOpen, Pencil, Trash2 } from "lucide-react";
import { MOVIMIENTOS_SEED, ORIGENES_MOVIMIENTO, TIPOS_MOVIMIENTO, totalDebe, totalHaber, type MovimientoRegistro } from "../../data/economico";
import { Button } from "../ui/Button";
import { Chip } from "../ui/Chip";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { Pagination } from "../ui/Pagination";
import { Banner } from "../ui/Banner";
import { MovimientoFormDialog } from "./MovimientoFormDialog";
import { formatFecha } from "../../utils/format";

type Dialogo = "formulario" | "confirmarEliminar" | null;
const POR_PAGINA = 10;

/** Sección "Movimientos" (libro diario) — eccabeceraregistro/ecdetalleregistro. Corresponde al reporte ecDiario documentado en tipo-de-reportes-sp.md. */
export function MovimientosSeccion({ onMensaje }: { onMensaje: (m: string) => void }) {
  const [movimientos, setMovimientos] = useState<MovimientoRegistro[]>(MOVIMIENTOS_SEED);
  const [seleccionadoId, setSeleccionadoId] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [modo, setModo] = useState<"nuevo" | "ver" | "editar">("nuevo");
  const [exito, setExito] = useState<string | null>(null);
  const nextIdRef = useRef(900);
  const numeroRef = useRef(1045);

  const seleccionado = useMemo(() => movimientos.find((m) => m.id === seleccionadoId) ?? null, [movimientos, seleccionadoId]);
  const filtrados = useMemo(() => (filtroTipo === "Todos" ? movimientos : movimientos.filter((m) => m.tipo === filtroTipo)).sort((a, b) => b.fecha.localeCompare(a.fecha)), [movimientos, filtroTipo]);
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

  const guardar = (m: MovimientoRegistro) => {
    setMovimientos((l) => (l.some((x) => x.id === m.id) ? l.map((x) => (x.id === m.id ? m : x)) : [m, ...l]));
    setSeleccionadoId(m.id);
    setDialogo(null);
    setExito(modo === "nuevo" ? `Movimiento N.° ${m.numeroRegistro} registrado correctamente.` : "Movimiento actualizado correctamente.");
    onMensaje(modo === "nuevo" ? "Movimiento registrado." : "Movimiento actualizado.");
  };
  const eliminar = () => {
    if (!seleccionadoId) return;
    setMovimientos((l) => l.filter((m) => m.id !== seleccionadoId));
    setSeleccionadoId(null);
    setDialogo(null);
    onMensaje("Movimiento eliminado.");
  };

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Libro de movimientos</h1>
          <div className="page__subtitle">Registro cronológico de ingresos, egresos y traspasos (Debe / Haber)</div>
        </div>
        <div className="btn-row">
          <Button icon={<FolderOpen size={14} />} disabled={!seleccionado} onClick={() => { setModo("ver"); setDialogo("formulario"); }}>Abrir</Button>
          <Button icon={<Pencil size={14} />} disabled={!seleccionado} onClick={() => { setModo("editar"); setDialogo("formulario"); }}>Editar</Button>
          <Button icon={<Trash2 size={14} />} variante="danger" disabled={!seleccionado} onClick={() => setDialogo("confirmarEliminar")}>Eliminar</Button>
          <Button variante="primary" icon={<FilePlus2 size={14} />} onClick={() => { setModo("nuevo"); setDialogo("formulario"); }}>Nuevo movimiento</Button>
        </div>
      </div>
      <div className="page__body">
        <div className="filters">
          <div className="filters__grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="field">
              <label className="field__label">Tipo de movimiento</label>
              <select className="select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                <option value="Todos">Todos</option>
                {TIPOS_MOVIMIENTO.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {exito && <Banner tipo="success" mensaje={exito} onCerrar={() => setExito(null)} />}

        <div className="table-wrap">
          <table className="grid">
            <thead><tr><th style={{ width: 70 }}>N.°</th><th style={{ width: 90 }}>Fecha</th><th>Origen</th><th>Descripción</th><th>Destinatario</th><th className="grid__num" style={{ width: 100 }}>Debe</th><th className="grid__num" style={{ width: 100 }}>Haber</th><th style={{ width: 90 }}>Estado</th></tr></thead>
            <tbody>
              {paginados.map((m) => (
                <tr key={m.id} className={seleccionadoId === m.id ? "is-selected" : ""} onClick={() => setSeleccionadoId(m.id)} onDoubleClick={() => { setModo("ver"); setDialogo("formulario"); }}>
                  <td className="nowrap">{m.numeroRegistro}</td>
                  <td className="nowrap">{formatFecha(m.fecha)}</td>
                  <td>{m.origen}</td>
                  <td>{m.descripcion}</td>
                  <td>{m.destinatario || "—"}</td>
                  <td className="grid__num">Q {totalDebe(m.detalle).toFixed(2)}</td>
                  <td className="grid__num">Q {totalHaber(m.detalle).toFixed(2)}</td>
                  <td><Chip tono={m.cerrado ? "inactivo" : "activo"}>{m.cerrado ? "Cerrado" : "Abierto"}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginados.length === 0 && <div className="empty-inline">No se encontraron movimientos con los criterios actuales.</div>}
        </div>
        <Pagination pagina={paginaActual} totalPaginas={totalPaginas} totalRegistros={filtrados.length} porPagina={POR_PAGINA} etiqueta="movimientos" onCambio={setPagina} />
      </div>

      {dialogo === "formulario" && (
        <MovimientoFormDialog modo={modo} movimiento={seleccionado} onCerrar={() => setDialogo(null)} onGuardar={guardar} nextId={() => `mov-${++nextIdRef.current}`} nextNumero={() => ++numeroRef.current} />
      )}
      {dialogo === "confirmarEliminar" && (
        <ConfirmDialog titulo="Eliminar movimiento" mensaje="Esta acción no se puede deshacer. ¿Deseas eliminar el movimiento seleccionado?" textoConfirmar="Eliminar" tono="alerta" onConfirmar={eliminar} onCancelar={() => setDialogo(null)} />
      )}
    </div>
  );
}

export { ORIGENES_MOVIMIENTO };
